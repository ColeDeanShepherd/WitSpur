import * as React from "react";

import * as Utils from "../Utils";
import * as Units from "../Units";
import { NumberInput } from "../NumberInput";

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the explicit Euler method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 */
export function explicitEuler(yn: number, tn: number, h: number, f: (t: number, y: number) => number): number {
  return yn + (h * f(tn, yn));
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the explicit 4th order Runge-Kutta method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 * @returns {Number} y(n + 1)
 */
export function explicitRk4(yn: number, tn: number, h: number, f: (t: number, y: number) => number): number {
  const k1 = f(tn, yn);
  const k2 = f(tn + (h / 2), yn + ((h / 2) * k1));
  const k3 = f(tn + (h / 2), yn + ((h / 2) * k2));
  const k4 = f(tn + h, yn + (h * k3));

  return yn + ((h / 6) * (k1 + (2 * k2) + (2 * k3) + k4));
}

export function angularVelocityToLinearVelocity(radius: number, angularVelocity: number) {
  return angularVelocity * radius;
}

export interface PendulumSimulatorProps {}
export interface PendulumSimulatorState {}

export class PendulumSimulator extends React.Component<PendulumSimulatorProps, PendulumSimulatorState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  canvasWidth: number = 640;
  canvasHeight: number = 480;

  g: number = 9.8;

  pixelsInUnit: number = 100;
  pendulumStringLengthInPixels: number = 200;
  pendulumMass: number = 1;

  pendulumAnchorX: number = this.canvasWidth / 2;
  pendulumAnchorY: number = 10;

  pendulumAngleInRadians: number = Math.PI / 6;
  pendulumAngularVelocity: number = 0;
  pendulumAngularAcceleration: number = 0;

  gravitationalPotentialEnergy: number = 0;
  kineticEnergy: number = 0;

  constructor(props: PendulumSimulatorProps) {
    super(props);

    this.state = {};
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
    const l = this.pendulumStringLengthInPixels / this.pixelsInUnit;

    const oldAngle = this.pendulumAngleInRadians;
    const oldAngularVelocity = this.pendulumAngularVelocity;
    const oldAngularAcceleration = this.pendulumAngularAcceleration;

    const futureAngularVelocity = (futureDt: number) => oldAngularVelocity + (futureDt * oldAngularAcceleration);
    const futureAngularAcceleration = (futureDt: number) => -(this.g / l) * Math.sin(oldAngle + (futureDt * oldAngularVelocity));

    const newAngle = explicitRk4(oldAngle, 0, dt, (t: number, angle: number) => futureAngularVelocity(t));
    const newAngularVelocity = explicitRk4(oldAngularVelocity, 0, dt, (t: number, velocity: number) => futureAngularAcceleration(t));
    const newAngularAcceleration = -(this.g / l) * Math.sin(oldAngle);

    this.pendulumAngleInRadians = newAngle;
    this.pendulumAngularVelocity = newAngularVelocity;
    this.pendulumAngularAcceleration = newAngularAcceleration;

    const m = this.pendulumMass;
    const h = l * (1 - Math.cos(newAngle));

    this.gravitationalPotentialEnergy = m * this.g * h;

    const newLinearVelocity = angularVelocityToLinearVelocity(l, newAngularVelocity);
    this.kineticEnergy = (this.pendulumMass * (newLinearVelocity * newLinearVelocity)) / 2;
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
  drawPendulum(stringLength: number, angleInRadians: number, anchorX: number, anchorY: number) {
    // Draw the anchor.
    this.fillCircle(10, anchorX, anchorY, "#000");

    // Calculate the bob's position;
    const bobOffsetX = stringLength * Math.sin(angleInRadians);
    const bobOffsetY = stringLength * Math.cos(angleInRadians);
    
    const bobPositionX = anchorX + bobOffsetX;
    const bobPositionY = anchorY + bobOffsetY;

    // Draw the string.
    this.strokeLine(anchorX, anchorY, bobPositionX, bobPositionY);

    // Draw the bob.
    this.fillCircle(20, bobPositionX, bobPositionY, "#000");
  }
  renderFrame() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawPendulum(this.pendulumStringLengthInPixels, this.pendulumAngleInRadians, this.pendulumAnchorX, this.pendulumAnchorY);

    const textX = 10;
    let textY = 10;
    let textYSpacing = 15;

    this.canvasContext.fillText("m = " + this.pendulumMass.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("l = " + (this.pendulumStringLengthInPixels / this.pixelsInUnit).toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("g = " + this.g.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("PE = mgh = " + this.gravitationalPotentialEnergy.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("KE = (1/2)mv^2 = " + this.kineticEnergy.toFixed(2), textX, textY);
    textY += textYSpacing;

    this.canvasContext.fillText("E = PE + KE = " + (this.gravitationalPotentialEnergy + this.kineticEnergy).toFixed(2), textX, textY);
    textY += textYSpacing;

  }

  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.canvasContext = context;
    this.startSimulation();
  }

  render(): JSX.Element {
    return (
      <canvas ref={canvas => this.canvasDomElement = canvas} width={this.canvasWidth} height={this.canvasHeight}>
        Your browser does not support the canvas tag. Please upgrade your browser.
      </canvas>
    );
  }
}