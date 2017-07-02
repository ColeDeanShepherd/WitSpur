import * as React from "react";

import * as Utils from "../Utils";
import { Color } from "../Color";
import { ColorInput } from "../ColorInput";
import { NumberInput } from "../NumberInput";

export interface CssBoxShadowProps {
  color: Color;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  isInset: boolean;
}

export interface CssBoxShadowGeneratorProps {
  editTextShadow?: boolean;
}
export interface CssBoxShadowGeneratorState {
  backgroundColor: Color,
  squareColor: Color,
  previewText: string,
  previewTextColor: Color,
  shadows: CssBoxShadowProps[],
  areShadowEditorsExpanded: boolean[]
}
export class CssBoxShadowGenerator extends React.Component<CssBoxShadowGeneratorProps, CssBoxShadowGeneratorState> {
  public static defaultProps: Partial<CssBoxShadowGeneratorProps> = {
    editTextShadow: false
  };

  constructor(props: CssBoxShadowGeneratorProps) {
    super(props);

    this.state = {
      backgroundColor: new Color(255, 255, 255, 1),
      squareColor: new Color(187, 187, 187, 1),
      previewText: "WitSpur",
      previewTextColor: new Color(0, 0, 0, 1),
      shadows: [this.getDefaultShadow()],
      areShadowEditorsExpanded: [true]
    };
  }
  getDefaultShadow(): CssBoxShadowProps {
    return {
      color: new Color(102, 102, 102, 0.75),
      offsetX: 5,
      offsetY: 5,
      blurRadius: 5,
      spreadRadius: 0,
      isInset: false
    };
  }

  onBackgroundColorChange(newValue: Color) {
    this.setState({ backgroundColor: newValue });
  }
  onSquareColorChange(newValue: Color) {
    this.setState({ squareColor: newValue });
  }
  onPreviewTextChange(e: any) {
    this.setState({ previewText: e.target.value });
  }
  onPreviewTextColorChange(newValue: Color) {
    this.setState({ previewTextColor: newValue });
  }
  onShadowColorChange(shadowIndex: number, newValue: Color) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, color: newValue };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowOffsetXChange(shadowIndex: number, newValue: number, newValueString: string) {
    if(isNaN(newValue)) { return; }

    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetX: newValue };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowOffsetYChange(shadowIndex: number, newValue: number, newValueString: string) {
    if(isNaN(newValue)) { return; }
    
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, offsetY: newValue };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowBlurRadiusChange(shadowIndex: number, newValue: number, newValueString: string) {
    if(isNaN(newValue)) { return; }
    
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, blurRadius: newValue };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  onShadowSpreadRadiusChange(shadowIndex: number, newValue: number, newValueString: string) {
    if(isNaN(newValue)) { return; }
    
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, spreadRadius: newValue };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  toggleIsShadowInset(shadowIndex: number) {
    const oldShadow = this.state.shadows[shadowIndex];
    const newShadow = { ...oldShadow, isInset: !oldShadow.isInset };
    this.setState({ shadows: Utils.setElementImmutable(this.state.shadows, shadowIndex, newShadow) });
  }
  addShadow() {
    const newShadow = this.getDefaultShadow();

    this.setState({
      shadows: [...this.state.shadows, newShadow],
      areShadowEditorsExpanded: [...this.state.areShadowEditorsExpanded, true]
    });
  }
  removeShadow(index: number) {
    this.setState({
      shadows: Utils.removeElementImmutable(this.state.shadows, index),
      areShadowEditorsExpanded: Utils.removeElementImmutable(this.state.areShadowEditorsExpanded, index)
    });
  }
  toggleShadowEditorExpanded(index: number) {
    const newValue = !this.state.areShadowEditorsExpanded[index];
    this.setState({ areShadowEditorsExpanded: Utils.setElementImmutable(this.state.areShadowEditorsExpanded, index, newValue) });
  }

  render(): JSX.Element {
    const boxShadowValue = this.state.shadows.map(shadow => `${shadow.isInset ? "inset " : ""}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${shadow.color.toString()}`).join(", ");
    const boxShadowRuleNames = ["-webkit-box-shadow", "-moz-box-shadow", "box-shadow"];
    const boxShadowRulesText = boxShadowValue ? boxShadowRuleNames.map(ruleName => `${ruleName}: ${boxShadowValue};`).join("\n") : "";
    const boxShadowStyle = {
      WebkitBoxShadow: boxShadowValue,
      MozBoxShadow: boxShadowValue,
      boxShadow: boxShadowValue
    };

    const textShadowValue = this.state.shadows.map(shadow => `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.color.toString()}`).join(", ");
    const textShadowRuleNames = ["text-shadow"];
    const textShadowRulesText = textShadowValue ? textShadowRuleNames.map(ruleName => `${ruleName}: ${textShadowValue};`).join("\n") : "";
    const textShadowStyle = {
      textShadow: textShadowValue
    };
    const minCoordinateSliderValue = -50;
    const maxCoordinateSliderValue = 50;
    const minBlurSpreadRadiusValue = 0;
    const maxBlurSpreadRadiusValue = 50;
    
    const shadowEditorHeaderStyle = { width: "100%", height: "auto", backgroundColor: "#2F2F2F", color: "#FFF", padding: "0.5em", cursor: "pointer" };
    const shadowEditorInputContainerStyle = { padding: "0.5em" };
    const shadowEditorInputRowStyle = { marginBottom: "0.5em" };
    //const shadowEditorInputNameStyle = { alignSelf: "center" };
    const shadowEditors = this.state.shadows.map((shadow: CssBoxShadowProps, index: number) => {
      const inputRows = (
        <div style={shadowEditorInputContainerStyle}>
          <div className="row no-padding" style={shadowEditorInputRowStyle}>
            <div className="col-1-2" style={{alignSelf: "center"}}>Color:</div>
            <div className="col-1-2"><ColorInput value={shadow.color} onChange={this.onShadowColorChange.bind(this, index)} /></div>
          </div>
          <div className="row no-padding" style={shadowEditorInputRowStyle}>
            <div className="col-1-2" style={{alignSelf: "center"}}>Horizontal Offset:</div>
            <div className="col-1-2"><NumberInput value={shadow.offsetX} onChange={this.onShadowOffsetXChange.bind(this, index)} minSliderValue={minCoordinateSliderValue} maxSliderValue={maxCoordinateSliderValue} /></div>
          </div>
          <div className="row no-padding" style={shadowEditorInputRowStyle}>
            <div className="col-1-2" style={{alignSelf: "center"}}>Vertical Offset:</div>
            <div className="col-1-2"><NumberInput value={shadow.offsetY} onChange={this.onShadowOffsetYChange.bind(this, index)} minSliderValue={minCoordinateSliderValue} maxSliderValue={maxCoordinateSliderValue} /></div>
          </div>
          <div className="row no-padding" style={shadowEditorInputRowStyle}>
            <div className="col-1-2" style={{alignSelf: "center"}}>Blur Radius:</div>
            <div className="col-1-2"><NumberInput value={shadow.blurRadius} onChange={this.onShadowBlurRadiusChange.bind(this, index)} minSliderValue={minBlurSpreadRadiusValue} maxSliderValue={maxBlurSpreadRadiusValue} /></div>
          </div>
          {!this.props.editTextShadow ? (
            <div>
              <div className="row no-padding" style={shadowEditorInputRowStyle}>
                <div className="col-1-2" style={{alignSelf: "center"}}>Spread Radius:</div>
                <div className="col-1-2"><NumberInput value={shadow.spreadRadius} onChange={this.onShadowSpreadRadiusChange.bind(this, index)} minSliderValue={minBlurSpreadRadiusValue} maxSliderValue={maxBlurSpreadRadiusValue} /></div>
              </div>
              <div className="row no-padding" style={shadowEditorInputRowStyle}>
                <div className="col-1-2" style={{alignSelf: "center"}}>Is Inset:</div>
                <div className="col-1-2"><input type="checkbox" checked={shadow.isInset} onClick={this.toggleIsShadowInset.bind(this, index)} style={{margin: "0.5em 0.5em 0.5em 0"}} /></div>
              </div>
            </div>
          ) : null}

          <button onClick={this.removeShadow.bind(this, index)}>Remove</button>
        </div>
      );

      return (
        <div style={{border: "1px solid #2F2F2F", borderRadius: "4px", marginBottom: "1em"}}>
          <div onClick={this.toggleShadowEditorExpanded.bind(this, index)} style={shadowEditorHeaderStyle}>
            <span>Shadow {index + 1}</span>
            <span style={{float: "right"}}><div className={`arrow-head ${this.state.areShadowEditorsExpanded[index] ? "up" : "down"}`} style={{borderColor: "#FFF", verticalAlign: "middle"}}></div></span>
          </div>
          {this.state.areShadowEditorsExpanded[index] ? inputRows : null}
        </div>
      );
    });

    return (
      <div className="row">
        <div className="col tool-sidebar" style={{padding: 0}}>
          <div className="card">
            <div className="row no-padding" style={{marginBottom: "0.5em"}}>
              <div className="col-1-2" style={{alignSelf: "center"}}>Background Color:</div>
              <div className="col-1-2"><ColorInput value={this.state.backgroundColor} onChange={this.onBackgroundColorChange.bind(this)} /></div>
            </div>

            {!this.props.editTextShadow ? (
              <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                <div className="col-1-2" style={{alignSelf: "center"}}>Square Color:</div>
                <div className="col-1-2"><ColorInput value={this.state.squareColor} onChange={this.onSquareColorChange.bind(this)} /></div>
              </div>
            ) : null}

            {this.props.editTextShadow ? (
              <div>
                <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                  <div className="col-1-2" style={{alignSelf: "center"}}>Preview Text:</div>
                  <div className="col-1-2"><input type="text" value={this.state.previewText} onChange={this.onPreviewTextChange.bind(this)} /></div>
                </div>

                <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                  <div className="col-1-2" style={{alignSelf: "center"}}>Preview Text Color:</div>
                  <div className="col-1-2"><ColorInput value={this.state.previewTextColor} onChange={this.onPreviewTextColorChange.bind(this)} /></div>
                </div>
              </div>
            ) : null}

            {shadowEditors}
            <button onClick={this.addShadow.bind(this)}>Add</button>
          </div>
        </div>

        <div className="col" style={{flexGrow: 1}}>
          <div className="card" style={{backgroundColor: this.state.backgroundColor, padding: "5em 1em"}}>
            {!this.props.editTextShadow ? (
              <div style={{width: "150px", height: "150px", backgroundColor: this.state.squareColor.toString(), margin: "0 auto", borderRadius: "4px", ...boxShadowStyle}} />
            ) : (
              <div style={{fontSize: "4em", color: this.state.previewTextColor.toString(), textAlign: "center", ...textShadowStyle}}>{this.state.previewText}</div>
            )}
          </div>
          <textarea value={!this.props.editTextShadow ? boxShadowRulesText : textShadowRulesText} readOnly style={{width: "100%", height: "150px", marginTop: "1em"}} />
        </div>
      </div>
    );
  }
}