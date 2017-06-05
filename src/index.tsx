import "babel-polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CharWordLineCounter } from "./char-word-line-counter/CharWordLineCounter";
import { CssBoxShadowGenerator } from "./box-shadow-generator/BoxShadowGenerator";
import { PomodoroTimer } from "./pomodoro-timer/PomodoroTimer";
import { GpaCalculator } from "./gpa-calculator/GpaCalculator";
import { UnitConverter } from "./unit-converter/UnitConverter";

import { MandelbrotSetRendererEditor } from "./mandelbrot/MandelbrotSetRenderer";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<CharWordLineCounter />, element);
}

export function renderCssBoxShadowGenerator(element: HTMLElement) {
  ReactDOM.render(<CssBoxShadowGenerator />, element);
}

export function renderPomodoroTimer(element: HTMLElement) {
  ReactDOM.render(<PomodoroTimer />, element);
}

export function renderGpaCalculator(element: HTMLElement) {
  ReactDOM.render(<GpaCalculator />, element);
}

export function renderUnitConverter(element: HTMLElement) {
  ReactDOM.render(<UnitConverter />, element);
}


export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<MandelbrotSetRendererEditor />, element);
}