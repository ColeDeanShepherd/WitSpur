import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

import { camelCaseToWords, capitalizeWord } from './Utils.js';

export function renderVisualPropInput(propType, value, onChange) {
  if(propType === VisualPropTypes.String) {
    return <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />;
  } else if(propType === VisualPropTypes.Number) {
    function onNumberInputChange(event) {
      const valueString = event.target.value;
      const value = parseFloat(valueString);

      if(!isNaN(value)) {
        onChange(value);
      }
    }

    return <input type="number" value={value} onChange={onNumberInputChange} />;
  } else if(propType === VisualPropTypes.Color) {
    function onColorInputChange(color, event) {
      onChange(color.rgb);
    }

    return <SketchPicker color={value} onChange={onColorInputChange} />;
  } else if(typeof propType === "object") {
    if(propType.name === "Array") {
      return <ArrayPropEditor elementType={propType.elementType} value={value} onChange={onChange} />
    }
  } else if(propType === VisualPropTypes.Group) {
    return null;
  }

  console.warn(`Unknown prop type: ${propType}`);
  return null;
}

export function getDefaultValueForNonGroupVisualPropType(propType) {
  if(propType === VisualPropTypes.Number) {
    return 0;
  } else if(propType === VisualPropTypes.String) {
    return "";
  } else if(typeof propType === "object") {
    if(propType.name === "Array") {
      return [];
    }
  }

  return null;
}

export function getDefaultVisualProps(visualPropDefs) {
  return visualPropDefs.reduce((prevProps, propDef) => {
    var visualPropsDelta;

    if(propDef.type !== VisualPropTypes.Group) {
      visualPropsDelta = {};
      visualPropsDelta[propDef.name] = (propDef.defaultValue === undefined) ? getDefaultValueForNonGroupVisualPropType(propDef.type) : propDef.defaultValue;
    } else {
      visualPropsDelta = getDefaultVisualProps(propDef.children);
    }

    return Object.assign(prevProps, visualPropsDelta);
  }, {});
}

export function isVisualPropValid(allVisualProps, visualPropDef) {
  if(visualPropDef.type !== "Group") {
    const visualProp = allVisualProps[visualPropDef.name];
    return !visualPropDef.validate || visualPropDef.validate(visualProp, allVisualProps);
  } else {
    return areVisualPropsValid(allVisualProps, visualPropDef.children);
  }
}
export function areVisualPropsValid(visualProps, visualPropDefs) {
  return visualPropDefs.every(propDef => isVisualPropValid(visualProps, propDef));
}

export function defaultMapVisualPropToProps(visualPropDef, visualProps) {
  if(visualPropDef.type !== "Group") {
    var props = {};
    props[visualPropDef.name] = visualProps[visualPropDef.name];

    return props;
  } else {
    return defaultMapVisualPropsToProps(visualPropDef.children, visualProps);
  }
}

export function defaultMapVisualPropsToProps(visualPropDefs, visualProps) {
  return visualPropDefs.reduce((props, visualPropDef) => Object.assign(props, defaultMapVisualPropToProps(visualPropDef, visualProps)), {});
}

export const VisualPropTypes = {
  Number: "Number",
  String: "String",
  Color: "Color",
  Array: elementType => ({ name: "Array", elementType: elementType }),
  Group: "Group"
};

export const ArrayPropEditor = ({elementType, value, onChange}) => {
  function onAddElementButtonClicked() {
    if(onChange) {
      const newValue = value.concat(getDefaultValueForNonGroupVisualPropType(elementType));

      onChange(newValue);
    }
  };
  function onRemoveElementButtonClicked(index) {
    if(onChange) {
      var newValue = value.slice();
      newValue.splice(index, 1);

      onChange(newValue);
    }
  };
  function onElementChange(newElementValue, index) {
    if(onChange) {
      var newValue = value.slice();
      newValue[index] = newElementValue;

      onChange(newValue);
    }
  }

  return (
    <div>
      {value.map((value, index) => (
        <div>
          {renderVisualPropInput(elementType, value, (newElementValue) => onElementChange(newElementValue, index))}
          <button onClick={onRemoveElementButtonClicked.bind(this, index)}>x</button>
        </div>
      ))}
      <button onClick={onAddElementButtonClicked}>+</button>
    </div>
  );
};