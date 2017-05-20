import * as React from "react";

import * as Utils from "../utils";

export interface MandelbrotSetRendererProps {
  width: number;
  height: number;
  heightInUnits: number;
  centerPosition: Utils.Complex;
  maxIterationCount: number;
}
export interface MandelbrotSetRendererState {}

/*
Next Steps
==========
-reverse y coord (im unit)
-Color tint
-Controls
*/
export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  constructor(props: MandelbrotSetRendererProps) {
    super(props);

    this.state = {};
  }
  renderImage(context: CanvasRenderingContext2D, widthInPixels: number, heightInPixels: number, widthInUnits: number, heightInUnits: number, centerPosition: Utils.Complex, maxIterationCount: number): ImageData {
    const widthOfPixelInUnits = widthInUnits / widthInPixels;
    const heightOfPixelInUnits = heightInUnits / heightInPixels;
    
    const topLeftPosition = Utils.subtract(centerPosition, new Utils.Complex(widthInUnits / 2, heightInUnits / 2));
    const topLeftPixelCenterPosition = Utils.add(topLeftPosition, new Utils.Complex(widthOfPixelInUnits / 2, heightOfPixelInUnits / 2));

    let imageDataObject = context.createImageData(widthInPixels, heightInPixels);
    let imageData = imageDataObject.data;

    for(let x = 0; x < widthInPixels; x++) {
      for(let y = 0; y < heightInPixels; y++) {
        const pixelCenterPosition = Utils.add(topLeftPixelCenterPosition, new Utils.Complex(x * widthOfPixelInUnits, y * heightOfPixelInUnits));

        const z0 = new Utils.Complex(0, 0);
        const c = pixelCenterPosition;
        let zn = z0;
        let n = 1;

        /*
        n: [1 to maxIterationCount + 1]
        maxIterationCount + 1 means the point is in the set!
        n < (maxIterationCount + 1) means the point is not in the set.
        */
        for(n = 1; n <= maxIterationCount; n++) {
          zn = Utils.add(Utils.multiply(zn, zn), c);

          if(Utils.abs(zn) > 2) {
            break;
          }
        }
        
        const colorI = n - 1; // [0, maxIterationCount]
        const pixelT = (colorI === maxIterationCount) ? 0 : (colorI / (maxIterationCount - 1));
        const pixelValue = 255 * pixelT;

        // set pixel of image
        const pixelIndex = (widthInPixels * y) + x;
        const pixelRByteIndex = 4 * pixelIndex;

        imageData[pixelRByteIndex] = pixelValue;
        imageData[pixelRByteIndex + 1] = pixelValue;
        imageData[pixelRByteIndex + 2] = pixelValue;
        imageData[pixelRByteIndex + 3] = 255;
      }
    }
    
    return imageDataObject;
  }
  reRenderMandelbrotSet() {
    if(!this.canvasContext) { return; }

    const widthOfCanvasInPixels = this.props.width;
    const heightOfCanvasInPixels = this.props.height;

    const canvasAspectRatio = widthOfCanvasInPixels / heightOfCanvasInPixels;

    const heightOfCanvasInUnits = this.props.heightInUnits;
    const widthOfCanvasInUnits = canvasAspectRatio * heightOfCanvasInUnits;

    const centerPosition = this.props.centerPosition;
    
    const maxIterationCount = this.props.maxIterationCount;

    const imageData = this.renderImage(this.canvasContext, widthOfCanvasInPixels, heightOfCanvasInPixels, widthOfCanvasInUnits, heightOfCanvasInUnits, centerPosition, maxIterationCount);

    this.canvasContext.putImageData(imageData, 0, 0);
  }

  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.canvasContext = context;
    this.reRenderMandelbrotSet();
  }
  componentDidUpdate() {
    this.reRenderMandelbrotSet();
  }

  render() {
    return (
      <canvas ref={canvas => this.canvasDomElement = canvas} width={this.props.width} height={this.props.height}>
        Your browser does not support the canvas tag. Please upgrade your browser.
      </canvas>
    );
  }
}

export interface MandelbrotSetRendererEditorProps {
}
export interface MandelbrotSetRendererEditorState {
  componentProps: MandelbrotSetRendererProps
}

export class MandelbrotSetRendererEditor extends React.Component<MandelbrotSetRendererEditorProps, MandelbrotSetRendererEditorState> {
  constructor(props: MandelbrotSetRendererEditorProps) {
    super(props);

    this.state = {
      componentProps: {
        width: 640,
        height: 480,
        heightInUnits: 2,
        centerPosition: new Utils.Complex(0, 0),
        maxIterationCount: 50
      }
    };
  }
  onWidthChange(event: any) {
    const newComponentProps = Object.assign(this.state.componentProps, { width: parseFloat(event.target.value) });
    this.setState({ componentProps: newComponentProps });
  }
  onHeightChange(event: any) {
    const newComponentProps = Object.assign(this.state.componentProps, { height: parseFloat(event.target.value) });
    this.setState({ componentProps: newComponentProps });
  }
  onHeightInUnitsChange(event: any) {
    const newComponentProps = Object.assign(this.state.componentProps, { heightInUnits: parseFloat(event.target.value) });
    this.setState({ componentProps: newComponentProps });
  }
  onCenterPositionXChange(event: any) {
    const newCenterPosition = new Utils.Complex(parseFloat(event.target.value), this.state.componentProps.centerPosition.im);
    const newComponentProps = Object.assign(this.state.componentProps, { centerPosition: newCenterPosition });
    this.setState({ componentProps: newComponentProps });
  }
  onCenterPositionYChange(event: any) {
    const newCenterPosition = new Utils.Complex(this.state.componentProps.centerPosition.re, parseFloat(event.target.value));
    const newComponentProps = Object.assign(this.state.componentProps, { centerPosition: newCenterPosition });
    this.setState({ componentProps: newComponentProps });
  }
  onMaxIterationCountChange(event: any) {
    const newComponentProps = Object.assign(this.state.componentProps, { maxIterationCount: parseInt(event.target.value) });
    this.setState({ componentProps: newComponentProps });
  }

  render() {
    return (
      <div>
        Width: <input type="number" value={this.state.componentProps.width} onChange={this.onWidthChange.bind(this)} /><br />
        Height: <input type="number" value={this.state.componentProps.height} onChange={this.onHeightChange.bind(this)} /><br />
        Height In Units: <input type="number" value={this.state.componentProps.heightInUnits} onChange={this.onHeightInUnitsChange.bind(this)} /><br />
        x (real coordinate): <input type="number" value={this.state.componentProps.centerPosition.re} onChange={this.onCenterPositionXChange.bind(this)} /><br />
        y (imaginary coordinate): <input type="number" value={this.state.componentProps.centerPosition.im} onChange={this.onCenterPositionYChange.bind(this)} /><br />
        Max. Iteration Count: <input type="number" value={this.state.componentProps.maxIterationCount} onChange={this.onMaxIterationCountChange.bind(this)} /><br />

        {React.createElement(MandelbrotSetRenderer, this.state.componentProps)}
      </div>
    );
  }
}