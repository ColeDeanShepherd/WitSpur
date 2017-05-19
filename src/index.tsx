import * as React from "react";
import * as ReactDOM from "react-dom";

import { TextAnalyzer } from "./text-analysis/TextAnalyzer";
import { MandelbrotSetRenderer } from "./mandelbrot/MandelbrotSetRenderer";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<TextAnalyzer />, element);
}

export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<MandelbrotSetRenderer />, element);
}