import "babel-polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CharWordLineCounter } from "./char-word-line-counter/CharWordLineCounter";
import { CssBoxShadowGenerator } from "./box-shadow-generator/BoxShadowGenerator";
import { PomodoroTimer } from "./pomodoro-timer/PomodoroTimer";
import { GpaCalculator } from "./gpa-calculator/GpaCalculator";
import { SightReadingExercises } from "./sight-reading-exercises/SightReadingExercises";
import { PendulumSimulator } from "./pendulum-simulator/PendulumSimulator";
import { MandelbrotSetRendererEditor } from "./mandelbrot/MandelbrotSetRenderer";
import { JuliaSetRendererEditor } from "./julia-set/JuliaSetRenderer";

import { UnitConverter } from "./unit-converter/UnitConverter";

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
export function renderSightReadingExercises(element: HTMLElement) {
  ReactDOM.render(<SightReadingExercises />, element);
}
export function renderPendulumSimulator(element: HTMLElement) {
  ReactDOM.render(<PendulumSimulator />, element);
}
export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<MandelbrotSetRendererEditor />, element);
}
export function renderJuliaSetRenderer(element: HTMLElement) {
  ReactDOM.render(<JuliaSetRendererEditor />, element);
}

export function renderUnitConverter(element: HTMLElement) {
  ReactDOM.render(<UnitConverter />, element);
}