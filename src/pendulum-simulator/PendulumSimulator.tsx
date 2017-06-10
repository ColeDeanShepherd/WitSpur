import * as React from "react";

import * as Utils from "../Utils";
import * as Units from "../Units";
import { NumberInput } from "../NumberInput";

/**
 * Finds an approximation to a root of the function f using the Newton-Raphson method.
 * @param {Number} x0 The initial guess.
 * @param {Function} f The function to find the root of.
 * @param {Function} fPrime The derivative of the function to find the root of.
 * @param {Number} minBackwardError The minimum backward error (abs(f(x)))
 * @param {Number} maxIterationCount The maximum iteration count.
 */
export function newtonRaphson(x0: number, f: (x: number) => number, fPrime: (x: number) => number, minBackwardError: number | null, maxIterationCount: number | null) {
  Utils.assert((minBackwardError !== null) || (maxIterationCount !== null));

  let xn = x0;
  let backwardError = Math.abs(f(xn));
  let iterationCount = 0;

  while(((minBackwardError === null) || (backwardError > minBackwardError)) && ((maxIterationCount === null) || (iterationCount < maxIterationCount))) {
    xn = xn - (f(xn) / fPrime(xn));
    
    backwardError = Math.abs(f(xn));
    iterationCount++;
  }

  return xn;
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the explicit Euler method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations. Ignored.
 * @param {Number} h The step size (delta t).
 * @param {Number} yPrimeN The expression f(tn, yn).
 */
export function explicitEulerGivenYPrimeN(yn: number, tn: number, h: number, yPrimeN: number) {
  return yn + (h * yPrimeN);
}

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
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the implicit Euler method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 * @param {Function} dfdy The derivative of f with respect to y = y''.
 */
export function implicitEuler(yn: number, tn: number, h: number, f: (t: number, y: number) => number, dfdy: (t: number, y: number) => number, minBackwardError: number | null, maxIterationCount: number | null): number { 
  const tnPlus1 = tn + h;
  const rootFn = (ynPlus1: number) => ynPlus1 - yn - (h * f(tnPlus1, ynPlus1));
  const rootDerivativeFn = (ynPlus1: number) => 1 - (h * dfdy(tnPlus1, ynPlus1));
  
  return newtonRaphson(yn, rootFn, rootDerivativeFn, minBackwardError, maxIterationCount);
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the explicit Midpoint method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 */
export function explicitMidpoint(yn: number, tn: number, h: number, f: (t: number, y: number) => number): number {
  return yn + (h * f(tn + (h / 2), yn + (h / 2) * f(tn, yn)));
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
  pendulumStringLength: number = this.pendulumStringLengthInPixels / this.pixelsInUnit;
  pendulumMass: number = 1;

  pendulumAnchorX: number = this.canvasWidth / 2;
  pendulumAnchorY: number = 10;

  pendulumAngleInRadians: number = Math.PI / 6;
  pendulumAngularVelocity: number = 0;

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
    // Update motion of pendulum.
    const acceleration = (angleInRadians: number): number => -(this.g / this.pendulumStringLength) * Math.sin(angleInRadians);

    const oldAngle = this.pendulumAngleInRadians;
    const oldAngularVelocity = this.pendulumAngularVelocity;
    const oldAngularAcceleration = acceleration(oldAngle);

    const futureAngle = (futureDt: number) => explicitEulerGivenYPrimeN(oldAngle, 0, futureDt, oldAngularVelocity);
    const futureAngularVelocity = (futureDt: number) => explicitEulerGivenYPrimeN(oldAngularVelocity, 0, futureDt, oldAngularAcceleration);
    const futureAngularAcceleration = (futureDt: number) => acceleration(futureAngle(futureDt));

    const newAngle = explicitRk4(oldAngle, 0, dt, (t: number, y: number) => futureAngularVelocity(t));
    const newAngularVelocity = explicitRk4(oldAngularVelocity, 0, dt, (t: number, y: number) => futureAngularAcceleration(t));

    this.pendulumAngleInRadians = newAngle;
    this.pendulumAngularVelocity = newAngularVelocity;

    // Calculate energy.
    const m = this.pendulumMass;
    const h = this.pendulumStringLength * (1 - Math.cos(this.pendulumAngleInRadians));

    this.gravitationalPotentialEnergy = m * this.g * h;

    const newLinearVelocity = angularVelocityToLinearVelocity(this.pendulumStringLength, this.pendulumAngularVelocity);
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