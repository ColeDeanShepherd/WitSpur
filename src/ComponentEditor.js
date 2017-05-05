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

function renderPropInput(propType, value, onChange) {
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

function getDefaultPropTypeValue(propType) {
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

function userPropsToInitialState(userProps) {
  return userProps.reduce((previousInitialState, userProp) => {
    var propState = {};
    propState[userProp.name] = (userProp.defaultValue === undefined) ? getDefaultPropTypeValue(userProp.type) : userProp.defaultValue;

    return Object.assign(previousInitialState, propState);
  }, {});
}

export function validateProps(userProps, props) {
  return userProps.every(userProp => !userProp.validate || userProp.validate(props[userProp.name], props));
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

export class ComponentEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      componentProps: userPropsToInitialState(props.component.userProps)
    };
  }
  
  onComponentPropChange(propName, newValue) {
    var componentPropsDelta = {};
    componentPropsDelta[propName] = newValue;

    this.setState({componentProps: Object.assign(this.state.componentProps, componentPropsDelta)});
  }
  renderPropEditors() {
    return (
      <table>
        <tbody>
          {this.props.component.userProps.map((prop) => (
            <tr>
              <td style={{textAlign: "right", verticalAlign: "top", paddingRight: "1em"}}>{camelCaseToWords(prop.name).map(capitalizeWord).join(" ")}</td>
              <td>{renderPropInput(prop.type, this.state.componentProps[prop.name], newValue => this.onComponentPropChange(prop.name, newValue))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  render() {
    return (
      <div>
        <div style={{boxSizing: "border-box", backgroundColor: "#313131", color: "#FFF", height: "100%", overflowY: "auto", position: "absolute", left: 0, top: 0}}>
          <div style={{padding: "1em"}}>
            {this.renderPropEditors()}
          </div>
        </div>
        <div style={{padding: "1em"}}>
          {validateProps(this.props.component.userProps, this.state.componentProps) ? React.createElement(this.props.component, this.state.componentProps) : <span>Invalid props.</span>}
        </div>
      </div>
    );
  }
}