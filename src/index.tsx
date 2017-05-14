import * as React from "react";
import * as ReactDOM from "react-dom";

import { TextAnalyzer } from "./TextAnalyzer";

export function renderTextAnalysis(element: HTMLElement) {
  ReactDOM.render(<TextAnalyzer />, element);
}