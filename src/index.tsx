import * as React from "react";
import * as ReactDOM from "react-dom";

import { TextAnalyzer } from "./text-analysis/TextAnalyzer";
import { CssBoxShadowGenerator } from "./box-shadow-generator/BoxShadowGenerator";
import { MandelbrotSetRendererEditor } from "./mandelbrot/MandelbrotSetRenderer";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<TextAnalyzer />, element);
}

export function renderCssBoxShadowGenerator(element: HTMLElement) {
  ReactDOM.render(<CssBoxShadowGenerator />, element);
}

export function renderMandelbrotSetRenderer(element: HTMLElement) {
  ReactDOM.render(<MandelbrotSetRendererEditor />, element);
}