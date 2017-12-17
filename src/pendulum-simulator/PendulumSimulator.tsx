import * as React from "react";

import * as Utils from "../Utils";
import * as Units from "../Units";
import * as Numerical from "../Numerical";
import { NumberInput } from "../NumberInput";

export function angularVelocityToLinearVelocity(radius: number, angularVelocity: number) {
  return angularVelocity * radius;
}

export function rad2Deg(radians: number) {
  return radians * (180 / Math.PI);
}
export function deg2Rad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export interface PendulumSimulatorProps {}
export interface PendulumSimulatorState {}

export class PendulumSimulator extends React.Component<PendulumSimulatorProps, PendulumSimulatorState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  canvasWidth: number = 640;
  canvasHeight: number = 480;
  
  pixelsInUnit: number = 65;

  g: number = 9.8;

  pendulumAnchorPositionInPixels: Utils.Vector2 = new Utils.Vector2(this.canvasWidth / 2, this.canvasHeight / 2);
  get pendulumAnchorPositionInUnits(): Utils.Vector2 { return Utils.Vector2.divide(this.pendulumAnchorPositionInPixels, this.pixelsInUnit); }

  pendulumAngleInRadians: number = Math.PI / 6;
  pendulumAngularVelocity: number = 0;

  get pendulumStringLengthInPixels(): number { return this.pendulumStringLength * this.pixelsInUnit }
  pendulumStringLength: number = 2;

  get pendulumBobPositionInUnits(): Utils.Vector2 {
    const bobOffset = Utils.Vector2.multiply(new Utils.Vector2(Math.sin(this.pendulumAngleInRadians), Math.cos(this.pendulumAngleInRadians)), this.pendulumStringLength);
    return Utils.Vector2.add(this.pendulumAnchorPositionInUnits, bobOffset);
  }
  get pendulumBobPositionInPixels(): Utils.Vector2 {
    return Utils.Vector2.multiply(this.pendulumBobPositionInUnits, this.pixelsInUnit);
  }

  pendulumMass: number = 4;

  gravitationalPotentialEnergy: number = 0;
  kineticEnergy: number = 0;

  anchorRadiusInUnits: number = 0.1;
  get anchorRadiusInPixels() { return this.pixelsInUnit * this.anchorRadiusInUnits; }

  get bobRadiusInUnits(): number { return Math.sqrt(this.pendulumMass / Math.PI) / 4; }
  get bobRadiusInPixels() { return this.pixelsInUnit * this.bobRadiusInUnits; }

  cursorPositionInUnits: Utils.Vector2 = new Utils.Vector2(0, 0);
  isGrabbingBob: boolean = false;

  constructor(props: PendulumSimulatorProps) {
    super(props);

    this.state = {};
  }

  getAngularAcceleration(angleInRadians: number) {
    return -(this.g / this.pendulumStringLength) * Math.sin(angleInRadians);
  }
  startSimulation() {
    const fixedDt = 1 / 60;
    let accumulatedTime = 0;

    let lastTimeStamp: number;
    const runFrame = (timeStamp) => {
      const dt = (timeStamp - lastTimeStamp) / Units.millisecondsInSecond;

      accumulatedTime += dt;

      while(accumulatedTime >= fixedDt) {
        this.update(fixedDt);

        accumulatedTime -= fixedDt;
      }
      
      this.renderFrame();
      
      requestAnimationFrame(runFrame);

      lastTimeStamp = timeStamp;
    };

    lastTimeStamp = performance.now();
    requestAnimationFrame(runFrame);
  }
  update(dt) {
    // Update motion of pendulum.
    if(!this.isGrabbingBob) {
      const acceleration = this.getAngularAcceleration.bind(this);

      const oldAngle = this.pendulumAngleInRadians;
      const oldAngularVelocity = this.pendulumAngularVelocity;
      const oldAngularAcceleration = acceleration(oldAngle);

      const futureAngle = (futureDt: number) => Numerical.explicitEulerGivenYPrimeN(oldAngle, 0, futureDt, oldAngularVelocity);
      const futureAngularVelocity = (futureDt: number) => Numerical.explicitEulerGivenYPrimeN(oldAngularVelocity, 0, futureDt, oldAngularAcceleration);
      const futureAngularAcceleration = (futureDt: number) => acceleration(futureAngle(futureDt));

      const newAngle = Numerical.explicitRk4(oldAngle, 0, dt, (t: number, y: number) => futureAngularVelocity(t));
      const newAngularVelocity = Numerical.explicitRk4(oldAngularVelocity, 0, dt, (t: number, y: number) => futureAngularAcceleration(t));

      this.pendulumAngleInRadians = newAngle;
      this.pendulumAngularVelocity = newAngularVelocity;
    } else {
      const cursorDisplacementFromAnchor = Utils.Vector2.subtract(this.cursorPositionInUnits, this.pendulumAnchorPositionInUnits);
      this.pendulumAngleInRadians = Math.atan2(cursorDisplacementFromAnchor.x, cursorDisplacementFromAnchor.y);
      this.pendulumAngularVelocity = 0;
    }

    // Calculate energy.
    const m = this.pendulumMass;
    const h = this.pendulumStringLength * (1 - Math.cos(this.pendulumAngleInRadians));

    this.gravitationalPotentialEnergy = m * this.g * h;

    const newLinearVelocity = angularVelocityToLinearVelocity(this.pendulumStringLength, this.pendulumAngularVelocity);
    this.kineticEnergy = (this.pendulumMass * (newLinearVelocity * newLinearVelocity)) / 2;

    // Update cursor.
    const isCursorOverBob = Utils.isPointInCircle(this.bobRadiusInUnits, this.pendulumBobPositionInUnits, this.cursorPositionInUnits);
    this.canvasDomElement.style.cursor = isCursorOverBob ? "pointer" : "auto";
  }

  strokeLine(x1: number, y1: number, x2: number, y2: number) {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x1, y1);
    this.canvasContext.lineTo(x2, y2);
    this.canvasContext.closePath();
    this.canvasContext.stroke();
  }
  fillCircle(radius: number, x: number, y: number, color: string) {
    this.canvasContext.fillStyle = color;

    this.canvasContext.beginPath();
    this.canvasContext.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.canvasContext.closePath();

    this.canvasContext.fill();
  }
  drawPendulum() {
    // Draw the anchor.
    this.fillCircle(this.anchorRadiusInPixels, this.pendulumAnchorPositionInPixels.x, this.pendulumAnchorPositionInPixels.y, "#000");

    // Calculate the bob's position;
    const bobPositionInPixels = this.pendulumBobPositionInPixels;

    // Draw the string.
    this.strokeLine(this.pendulumAnchorPositionInPixels.x, this.pendulumAnchorPositionInPixels.y, bobPositionInPixels.x, bobPositionInPixels.y);

    // Draw the bob.
    this.fillCircle(this.bobRadiusInPixels, bobPositionInPixels.x, bobPositionInPixels.y, "#000");
  }
  renderFrame() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawPendulum();

    const fontSizeInPixels = 18;
    const textX = 10;
    let textY = fontSizeInPixels;
    let textYSpacing = 1.3 * fontSizeInPixels;

    const thetaChar = "\u03B8";
    const degreesSymbolChar = "\u00B0";
    
    this.canvasContext.font = `${fontSizeInPixels}px sans-serif`;

    this.canvasContext.fillText("g = " + this.g.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("l = " + (this.pendulumStringLengthInPixels / this.pixelsInUnit).toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("m = " + this.pendulumMass.toFixed(2), textX, textY);
    textY += textYSpacing;
    
    this.canvasContext.fillText(thetaChar + " = " + rad2Deg(this.pendulumAngleInRadians).toFixed(2) + degreesSymbolChar, textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText(thetaChar + "' = " + rad2Deg(this.pendulumAngularVelocity).toFixed(2) + degreesSymbolChar, textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText(thetaChar + "'' = " + rad2Deg(this.getAngularAcceleration(this.pendulumAngleInRadians)).toFixed(2) + degreesSymbolChar, textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("PE = mgh = " + this.gravitationalPotentialEnergy.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("KE = (1/2)mv^2 = " + this.kineticEnergy.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("E = PE + KE = " + (this.gravitationalPotentialEnergy + this.kineticEnergy).toFixed(2), textX, textY);
    textY += textYSpacing;
  }

  onMouseMove(event: any) {
    const scaledCursorPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, new Utils.Vector2(event.clientX, event.clientY));
    this.cursorPositionInUnits = Utils.Vector2.divide(scaledCursorPositionInCanvas, this.pixelsInUnit);
  }
  onMouseDown(event: any) {
    if(Utils.isPointInCircle(this.bobRadiusInUnits, this.pendulumBobPositionInUnits, this.cursorPositionInUnits)) {
      this.isGrabbingBob = true;
    }
  }
  onMouseUp(event: any) {
    this.isGrabbingBob = false;
  }

  onGChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    this.g = newValue;
  }
  onPendulumMassChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    this.pendulumMass = newValue;
  }
  onPendulumStringLengthChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    this.pendulumStringLength = newValue;
  }
  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.canvasContext = context;
    this.startSimulation();
  }

  render(): JSX.Element {
    return (
      <div className="row">
        <div className="col tool-sidebar">
          <div className="card">
            <div className="row no-padding">
              <div className="col-1-2">g (gravity):</div>
              <div className="col-1-2">
                <NumberInput value={this.g} onChange={this.onGChange.bind(this)} minSliderValue={0} maxSliderValue={50} sliderStepSize={0.1} />
              </div>
            </div>

            <div className="row no-padding">
              <div className="col-1-2">l (length)</div>
              <div className="col-1-2">
                <NumberInput value={this.pendulumStringLength} onChange={this.onPendulumStringLengthChange.bind(this)} minSliderValue={0.1} maxSliderValue={3} sliderStepSize={0.1} />
              </div>
            </div>

            <div className="row no-padding">
              <div className="col-1-2">m (mass)</div>
              <div className="col-1-2">
                <NumberInput value={this.pendulumMass} onChange={this.onPendulumMassChange.bind(this)} minSliderValue={0.1} maxSliderValue={10} sliderStepSize={0.1} />
              </div>
            </div>
          </div>
        </div>

        <div className="col" style={{flexGrow: 1}}>
          <div className="card">
            <canvas ref={canvas => canvas ? (this.canvasDomElement = canvas) : null} width={this.canvasWidth} height={this.canvasHeight} onMouseMove={this.onMouseMove.bind(this)} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
              Your browser does not support the canvas tag. Please upgrade your browser.
            </canvas>
          </div>
        </div>
      </div>
    );
  }
}