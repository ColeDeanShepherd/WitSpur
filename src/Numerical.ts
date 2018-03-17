import * as Utils from "./Utils";

/**
 * Finds an approximation to a root of the function f using the Newton-Raphson method.
 * @param {Number} x0 The initial guess.
 * @param {Function} f The function to find the root of.
 * @param {Function} fPrime The derivative of the function to find the root of.
 * @param {Number} minBackwardError The minimum backward error (abs(f(x)))
 * @param {Number} maxIterationCount The maximum iteration count.
 * @returns {Number} An approximate root of f.
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
 * @returns {Number} y(n + 1)
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
 * @returns {Number} y(n + 1)
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
  const ynPlus1InitialGuess = explicitEulerGivenYPrimeN(yn, tn, h, f(tn, yn));
  const rootFn = (ynPlus1: number) => ynPlus1 - yn - (h * f(tnPlus1, ynPlus1));
  const rootDerivativeFn = (ynPlus1: number) => 1 - (h * dfdy(tnPlus1, ynPlus1));
  
  return newtonRaphson(ynPlus1InitialGuess, rootFn, rootDerivativeFn, minBackwardError, maxIterationCount);
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the implicit midpoint method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 * @param {Function} dfdy The derivative of f with respect to y = y''.
 * @param {Number} minBackwardError The minimum backward error.
 * @param {Number} maxIterationCount The maximum iteration count.
 * @returns {Number} y(n + 1)
 */
export function implicitMidpoint(yn: number, tn: number, h: number, f: (t: number, y: number) => number, dfdy: (t: number, y: number) => number, minBackwardError: number | null, maxIterationCount: number | null): number {
  const tMidpoint = tn + (h / 2);
  const ynPlus1InitialGuess = explicitEulerGivenYPrimeN(yn, tn, h, f(tn, yn));
  const rootFn = (ynPlus1: number) => ynPlus1 - yn - (h * f(tMidpoint, (yn + ynPlus1) / 2));
  const rootDerivativeFn = (ynPlus1: number) => 1 - (h * (dfdy(tMidpoint, (yn + ynPlus1) / 2) / 2));

  return newtonRaphson(ynPlus1InitialGuess, rootFn, rootDerivativeFn, minBackwardError, maxIterationCount);
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the trapezoidal rule (implicit).
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 * @param {Function} dfdy The derivative of f with respect to y = y''.
 * @param {Number} minBackwardError The minimum backward error.
 * @param {Number} maxIterationCount The maximum iteration count.
 * @returns {Number} y(n + 1)
 */
export function trapezoidalRule(yn: number, tn: number, h: number, f: (t: number, y: number) => number, dfdy: (t: number, y: number) => number, minBackwardError: number | null, maxIterationCount: number | null): number {
  const tnPlus1 = tn + h;
  const ynPlus1InitialGuess = explicitEulerGivenYPrimeN(yn, tn, h, f(tn, yn));
  const rootFn = (ynPlus1: number) => ynPlus1 - yn - ((h * (f(tn, yn) + f(tnPlus1, ynPlus1))) / 2);
  const rootDerivativeFn = (ynPlus1: number) => 1 - ((h * dfdy(tnPlus1, ynPlus1)) / 2);

  return newtonRaphson(ynPlus1InitialGuess, rootFn, rootDerivativeFn, minBackwardError, maxIterationCount);
}

/**
 * Solves an iteration of an IVP: y' = f(t, y), y(t0) = y0 using the explicit Midpoint method.
 * @param {Number} yn The value of y after n iterations.
 * @param {Number} tn The value of t after n iterations.
 * @param {Number} h The step size (delta t).
 * @param {Function} f The function f(t, y) = y'.
 * @returns {Number} y(n + 1)
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