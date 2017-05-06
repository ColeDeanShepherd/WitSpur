import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

import { camelCaseToWords, capitalizeWord } from './Utils.js';

/*
User-defined component
======================
* Prop info
  * name (string)
  * type
  * default value
* react component code
*/

export function renderPropInput(propType, value, onChange) {
  if(propType === CustomPropTypes.String) {
    return <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />;
  } else if(propType === CustomPropTypes.Number) {
    function onNumberInputChange(event) {
      const valueString = event.target.value;
      const value = parseFloat(valueString);

      if(!isNaN(value)) {
        onChange(value);
      }
    }

    return <input type="number" value={value} onChange={onNumberInputChange} />;
  } else if(propType === CustomPropTypes.Color) {
    function onColorInputChange(color, event) {
      onChange(color.rgb);
    }

    return <SketchPicker color={value} onChange={onColorInputChange} />;
  } else if(typeof propType === "object") {
    if(propType.name === "Array") {
      return <ArrayPropEditor elementType={propType.elementType} value={value} onChange={onChange} />
    }
  }

  return null;
}

export function getDefaultPropTypeValue(propType) {
  if(propType === CustomPropTypes.Number) {
    return 0;
  } else if(propType === CustomPropTypes.String) {
    return "";
  } else if(typeof propType === "object") {
    if(propType.name === "Array") {
      return [];
    }
  }

  return null;
}

export function userPropsToInitialState(userProps) {
  return userProps.reduce((previousInitialState, userProp) => {
    var propState = {};
    propState[userProp.name] = (userProp.defaultValue === undefined) ? getDefaultPropTypeValue(userProp.type) : userProp.defaultValue;

    return Object.assign(previousInitialState, propState);
  }, {});
}

export function isPropValid(props, userProp) {
  return !userProp.validate || userProp.validate(props[userProp.name], props);
}
export function arePropsValid(props, userProps) {
  return userProps.every(userProp => isPropValid(props, userProp));
}

export const CustomPropTypes = {
  Number: "Number",
  String: "String",
  Color: "Color",
  Array: elementType => ({ name: "Array", elementType: elementType })
};

export const ArrayPropEditor = ({elementType, value, onChange}) => {
  function onAddElementButtonClicked() {
    if(onChange) {
      const newValue = value.concat(getDefaultPropTypeValue(elementType));

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
          {renderPropInput(elementType, value, (newElementValue) => onElementChange(newElementValue, index))}
          <button onClick={onRemoveElementButtonClicked.bind(this, index)}>x</button>
        </div>
      ))}
      <button onClick={onAddElementButtonClicked}>+</button>
    </div>
  );
};