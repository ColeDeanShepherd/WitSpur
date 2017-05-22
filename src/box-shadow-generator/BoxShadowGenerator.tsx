import * as React from "react";

import * as Utils from "../Utils";
import * as Text from "../Text";

export interface CssBoxShadowProps {
  color: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  isInset: boolean;
}

export interface CssBoxShadowGeneratorProps {}
export interface CssBoxShadowGeneratorState {
  shadows: CssBoxShadowProps[]
}

export class CssBoxShadowGenerator extends React.Component<CssBoxShadowGeneratorProps, CssBoxShadowGeneratorState> {
  constructor(props: CssBoxShadowGeneratorProps) {
    super(props);

    this.state = {
      shadows: [
        {
          color: "rgba(109, 150, 150, 0.25)",
          offsetX: 5,
          offsetY: 3,
          blurRadius: 5,
          spreadRadius: 0,
          isInset: false
        }
      ]
    };
  }
  onShadowColorChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, color: event.target.value };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  onShadowOffsetXChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetX: parseInt(event.target.value) };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  onShadowOffsetYChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetY: parseInt(event.target.value) };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  onShadowBlurRadiusChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, blurRadius: parseInt(event.target.value) };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  onShadowSpreadRadiusChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, spreadRadius: parseInt(event.target.value) };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  toggleIsShadowInset(shadowIndex: number) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, isInset: !oldShadow.isInset };
    this.setState({ shadows: [...this.state.shadows.slice(0, shadowIndex), newShadow, ...this.state.shadows.slice(shadowIndex + 1)] });
  }
  addShadow() {
    const newShadow = {
      color: "rgba(109, 150, 150, 0.25)",
      offsetX: -5,
      offsetY: -3,
      blurRadius: 5,
      spreadRadius: 0,
      isInset: false
    };

    this.setState({ shadows: [...this.state.shadows, newShadow] });
  }
  removeShadow(index: number) {
    this.setState({ shadows: [...this.state.shadows.slice(0, index), ...this.state.shadows.slice(index + 1)] });
  }

  render(): JSX.Element {
    const boxShadowValue = this.state.shadows.map(shadow => `${shadow.color} ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px${shadow.isInset ? " inset" : ""}`).join(", ");
    const boxShadowRuleNames = ["-webkit-box-shadow", "-moz-box-shadow", "box-shadow"];
    const boxShadowRulesText = boxShadowRuleNames.map(ruleName => `${ruleName}: ${boxShadowValue};`).join("\n");
    const boxShadowStyle = {
      WebkitBoxShadow: boxShadowValue,
      MozBoxShadow: boxShadowValue,
      boxShadow: boxShadowValue
    };

    const shadowEditors = this.state.shadows.map((shadow: CssBoxShadowProps, index: number) => (
      <div>
        Color: <input type="text" value={shadow.color} onChange={this.onShadowColorChange.bind(this, index)} /><br />
        Horizontal Offset: <input type="number" value={shadow.offsetX} onChange={this.onShadowOffsetXChange.bind(this, index)} /><br />
        Vertical Offset: <input type="number" value={shadow.offsetY} onChange={this.onShadowOffsetYChange.bind(this, index)} /><br />
        Blur Radius: <input type="number" value={shadow.blurRadius} onChange={this.onShadowBlurRadiusChange.bind(this, index)} /><br />
        Spread Radius: <input type="number" value={shadow.spreadRadius} onChange={this.onShadowSpreadRadiusChange.bind(this)} /><br />
        Is Inset: <input type="checkbox" checked={shadow.isInset} onClick={this.toggleIsShadowInset.bind(this, index)} /><br />
        <button onClick={this.removeShadow.bind(this, index)}>Remove</button>
      </div>
    ));

    return (
      <div style={{display: "flex"}}>
        <div>
          {shadowEditors}
          <button onClick={this.addShadow.bind(this)}>Add Shadow</button>
        </div>

        <div style={{paddingLeft: "1em", flexGrow: 1}}>
          <div className="card" style={{padding: "5em 1em"}}>
            <div style={{width: "256px", height: "256px", backgroundColor: "#00F", margin: "0 auto", borderRadius: "4px", ...boxShadowStyle}} />
          </div>
          <textarea value={boxShadowRulesText} style={{width: "100%", height: "150px", marginTop: "1em"}} />
        </div>
      </div>
    );
  }
}