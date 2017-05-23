import * as React from "react";

import * as Utils from "../Utils";
import * as Text from "../Text";

function addElementImmutable<T>(arr: T[], newElement: T): T[] {
  return [...arr, newElement];
}
function setElementImmutable<T>(arr: T[], elementIndex: number, newValue: T): T[] {
  return [...arr.slice(0, elementIndex), newValue, ...arr.slice(elementIndex + 1)];
}
function removeElementImmutable<T>(arr: T[], elementIndex: number): T[] {
  return [...arr.slice(0, elementIndex), ...arr.slice(elementIndex + 1)]
}

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
  shadows: CssBoxShadowProps[],
  areShadowEditorsExpanded: boolean[]
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
      ],
      areShadowEditorsExpanded: [true]
    };
  }
  onShadowColorChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, color: event.target.value };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowOffsetXChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetX: parseInt(event.target.value) };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowOffsetYChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetY: parseInt(event.target.value) };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowBlurRadiusChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, blurRadius: parseInt(event.target.value) };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowSpreadRadiusChange(shadowIndex: number, event: any) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, spreadRadius: parseInt(event.target.value) };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  toggleIsShadowInset(shadowIndex: number) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, isInset: !oldShadow.isInset };
    this.setState({ shadows: setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
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

    this.setState({
      shadows: [...this.state.shadows, newShadow],
      areShadowEditorsExpanded: [...this.state.areShadowEditorsExpanded, true]
    });
  }
  removeShadow(index: number) {
    this.setState({
      shadows: removeElementImmutable(this.state.shadows, index),
      areShadowEditorsExpanded: removeElementImmutable(this.state.areShadowEditorsExpanded, index)
    });
  }
  toggleShadowEditorExpanded(index: number) {
    const newValue = !this.state.areShadowEditorsExpanded[index];
    this.setState({ areShadowEditorsExpanded: setElementImmutable(this.state.areShadowEditorsExpanded, index, newValue) });
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

    const shadowEditors = this.state.shadows.map((shadow: CssBoxShadowProps, index: number) => {
      const inputRows = (
        <div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Color:</div>
            <div className="col-1-2"><input type="text" value={shadow.color} onChange={this.onShadowColorChange.bind(this, index)} /></div>
          </div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Horizontal Offset:</div>
            <div className="col-1-2"><input type="number" value={shadow.offsetX} onChange={this.onShadowOffsetXChange.bind(this, index)} /></div>
          </div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Vertical Offset:</div>
            <div className="col-1-2"><input type="number" value={shadow.offsetY} onChange={this.onShadowOffsetYChange.bind(this, index)} /></div>
          </div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Blur Radius:</div>
            <div className="col-1-2"><input type="number" value={shadow.blurRadius} onChange={this.onShadowBlurRadiusChange.bind(this, index)} /></div>
          </div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Spread Radius:</div>
            <div className="col-1-2"><input type="number" value={shadow.spreadRadius} onChange={this.onShadowSpreadRadiusChange.bind(this)} /></div>
          </div>
          <div className="row no-padding">
            <div className="col-1-2" style={{alignSelf: "center"}}>Is Inset:</div>
            <div className="col-1-2"><input type="checkbox" checked={shadow.isInset} onClick={this.toggleIsShadowInset.bind(this, index)} style={{margin: "0.5em 0.5em 0.5em 0"}} /></div>
          </div>

          <button onClick={this.removeShadow.bind(this, index)}>-</button>
        </div>
      );

      return (
        <div>
          <div>
            <span style={{paddingRight: "1em"}}>Shadow {index + 1}</span>
            <span onClick={this.toggleShadowEditorExpanded.bind(this, index)} style={{cursor: "pointer"}}><div className={`arrow-head ${this.state.areShadowEditorsExpanded[index] ? "up" : "down"}`}></div></span>
          </div>
          {this.state.areShadowEditorsExpanded[index] ? inputRows : null}
        </div>
      );
    });

    return (
      <div style={{display: "flex"}}>
        <div className="card" style={{minWidth: "360px"}}>
          {shadowEditors}
          <button onClick={this.addShadow.bind(this)}>+</button>
        </div>

        <div style={{paddingLeft: "1em", flexGrow: 1}}>
          <div className="card" style={{padding: "5em 1em"}}>
            <div style={{width: "256px", height: "256px", backgroundColor: "#00F", margin: "0 auto", borderRadius: "4px", ...boxShadowStyle}} />
          </div>
          <textarea value={boxShadowRulesText} readOnly style={{width: "100%", height: "150px", marginTop: "1em"}} />
        </div>
      </div>
    );
  }
}