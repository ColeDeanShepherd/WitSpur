import "babel-polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CharWordLineCounter } from "./char-word-line-counter/CharWordLineCounter";
import { CssBoxShadowGenerator } from "./box-shadow-generator/BoxShadowGenerator";
import { PomodoroTimer } from "./pomodoro-timer/PomodoroTimer";
import { InvestmentCalculator } from "./investment-calculator/InvestmentCalculator";
import { GpaCalculator } from "./gpa-calculator/GpaCalculator";
import { SightReadingExercises } from "./sight-reading-exercises/SightReadingExercises";
import { PendulumSimulator } from "./pendulum-simulator/PendulumSimulator";
import { FractalRendererEditor } from "./mandelbrot/FractalRenderer";
import { PongTutorial } from "./pong-tutorial/PongTutorial";
import { VerilogTutorial } from "./verilog/Verilog";

import { UnitConverter } from "./unit-converter/UnitConverter";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<CharWordLineCounter />, element);
}
export function renderCssBoxShadowGenerator(element: HTMLElement) {
  ReactDOM.render(<CssBoxShadowGenerator />, element);
}
export function renderCssTextShadowGenerator(element: HTMLElement) {
  ReactDOM.render(<CssBoxShadowGenerator editTextShadow={true} />, element);
}
export function renderPomodoroTimer(element: HTMLElement) {
  ReactDOM.render(<PomodoroTimer />, element);
}

export function renderInvestmentCalculator(element: HTMLElement) {
  ReactDOM.render(<InvestmentCalculator />, element);
}
export function renderGpaCalculator(element: HTMLElement) {
  ReactDOM.render(<GpaCalculator />, element);
}

export function renderSightReadingExercises(element: HTMLElement) {
  ReactDOM.render(<SightReadingExercises />, element);
}
export function renderPendulumSimulator(element: HTMLElement) {
  ReactDOM.render(<PendulumSimulator />, element);
}
export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<FractalRendererEditor isMandelbrot={true} />, element);
}
export function renderJuliaSetRenderer(element: HTMLElement) {
  ReactDOM.render(<FractalRendererEditor isMandelbrot={false} />, element);
}
export function renderVerilogTutorial(element: HTMLElement) {
  ReactDOM.render(<VerilogTutorial />, element);
}

export function renderPongTutorial(element: HTMLElement) {
  ReactDOM.render(<PongTutorial />, element);
}

export function renderUnitConverter(element: HTMLElement) {
  ReactDOM.render(<UnitConverter />, element);
}