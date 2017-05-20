import * as React from "react";
import * as ReactDOM from "react-dom";

import { Complex } from "./utils";
import { TextAnalyzer } from "./text-analysis/TextAnalyzer";
import { MandelbrotSetRenderer } from "./mandelbrot/MandelbrotSetRenderer";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<TextAnalyzer />, element);
}

export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<MandelbrotSetRenderer width={640} height={480} heightInUnits={1} centerPosition={new Complex(0, 0)} maxIterationCount={100} />, element);
}