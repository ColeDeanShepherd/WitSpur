import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

import { camelCaseToWords, capitalizeWord } from './Utils.js';

export function renderVisualPropInput(propType, value, onChange, className) {
  if(propType === VisualPropTypes.String) {
    return <input type="text" value={value} onChange={(event) => onChange(event.target.value)} className={className} />;
  } else if(propType === VisualPropTypes.Number) {
    function onNumberInputChange(event) {
      const valueString = event.target.value;
      const value = parseFloat(valueString);

      if(!isNaN(value)) {
        onChange(value);
      }
    }

    return <input type="number" value={value} onChange={onNumberInputChange} className={className} />;
  } else if(propType === VisualPropTypes.Color) {
    function onColorInputChange(color, event) {
      onChange(color.rgb);
    }

    return <SketchPicker color={value} onChange={onColorInputChange} className={className} />;
  } else if(propType === VisualPropTypes.TextStyle) {
    return <TextStyleInput value={value} onChange={onChange} className={className} />;
  } else if(propType === VisualPropTypes.Group) {
    return null;
  } else if(typeof propType === "object") {
    if(propType.name === "Array") {
      return <ArrayPropInput elementType={propType.elementType} value={value} onChange={onChange} className={className} />
    }
  }

  console.warn(`Unknown prop type: ${propType}`);
  return null;
}

export function getDefaultValueForNonGroupVisualPropType(propType) {
  if(propType === VisualPropTypes.Number) {
    return 0;
  } else if(propType === VisualPropTypes.String) {
    return "";
  } else if(propType === VisualPropTypes.TextStyle) {
    return {
      size: 16,
      isBold: false,
      isItalic: false,
      color: "#000"
    };
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
  TextStyle: "TextStyle",
  Array: elementType => ({ name: "Array", elementType: elementType }),
  Group: "Group"
};

export const TextStyleInput = ({value, onChange}) => {
  function onSizeChange(event) {
    if(onChange) {
      const newValue = Object.assign(value, {size: event.target.value});
      onChange(newValue);
    }
  }
  function onIsBoldToggle(event) {
    if(onChange) {
      const newValue = Object.assign(value, {isBold: !value.isBold});
      onChange(newValue);
    }
  }
  function onIsItalicToggle(event) {
    if(onChange) {
      const newValue = Object.assign(value, {isItalic: !value.isItalic});
      onChange(newValue);
    }
  }
  function onColorInputChange(color, event) {
    if(onChange) {
      const newValue = Object.assign(value, {color: color.rgb});
      onChange(newValue);
    }
  }

  return (
    <div>
      Size: <input type="number" value={value.size} onChange={onSizeChange} /><br />
      Weight:
      <span>B<input type="checkbox" value={value.isBold} onChange={onIsBoldToggle} /></span>
      <span style={{paddingLeft: "0.5em"}}>I<input type="checkbox" value={value.isItalic} onChange={onIsItalicToggle} /><br /></span>
      Color: <SketchPicker color={value.color} onChange={onColorInputChange} />
    </div>
  );
};

export const ArrayPropInput = ({elementType, value, onChange}) => {
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
        <div className="input-group">
          {renderVisualPropInput(elementType, value, (newElementValue) => onElementChange(newElementValue, index), 'first')}
          <button onClick={onRemoveElementButtonClicked.bind(this, index)} className="last">x</button>
        </div>
      ))}
      <button onClick={onAddElementButtonClicked}>+</button>
    </div>
  );
};