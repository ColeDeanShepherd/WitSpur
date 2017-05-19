import * as React from "react";

import * as Utils from "../utils";

export interface MandelbrotSetRendererProps {}
export interface MandelbrotSetRendererState {}

export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;

  constructor(props: MandelbrotSetRendererProps) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");

    if(context) {
      context.fillRect(0, 0, 100, 100);
    }
  }
  render() {
    const width = 640;
    const height = 480;

    return <canvas ref={canvas => this.canvasDomElement = canvas} width={width} height={height} />;
  }
}