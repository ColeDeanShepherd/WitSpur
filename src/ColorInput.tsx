import * as React from "react";
import { SketchPicker } from 'react-color';

import { Color } from "./Color";

export interface ColorInputProps {
  value: Color,
  onChange: (newValue: Color) => void
}
export interface ColorInputState {
  isExpanded: boolean
}
export class ColorInput extends React.Component<ColorInputProps, ColorInputState> {
  constructor(props: ColorInputProps) {
    super(props);

    this.state = { isExpanded: false };
  }
  onChange(newValue: any, event: any) {
    if(this.props.onChange) {
      this.props.onChange(new Color(newValue.rgb.r, newValue.rgb.g, newValue.rgb.b, newValue.rgb.a));
    }
  }
  toggleIsExpanded() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div style={{display: "inline-block", width: "30px", height: "30px", padding: "3px", border: "1px solid #CCC", borderRadius: "4px", position: "relative"}}>
        <div onClick={this.toggleIsExpanded.bind(this)} style={{width: "100%", height: "100%", backgroundColor: this.props.value.toString(), borderRadius: "4px", cursor: "pointer"}} />
        <div style={{paddingTop: "5px", position: "absolute", left: 0, top: "100%", zIndex: 999}}>
          {this.state.isExpanded ? <div style={{}}><SketchPicker color={this.props.value} onChange={this.onChange.bind(this)} /></div> : null}
        </div>
      </div>
    );
  }
}