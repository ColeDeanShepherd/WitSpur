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

export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;

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
  componentDidMount() {
    /*
    Next Steps
    ==========
    -Color tint
    -Controls
    */
    const context = this.canvasDomElement.getContext("2d");

    if(!context) { return; }

    const widthOfCanvasInPixels = this.props.width;
    const heightOfCanvasInPixels = this.props.height;

    const canvasAspectRatio = widthOfCanvasInPixels / heightOfCanvasInPixels;

    const heightOfCanvasInUnits = this.props.heightInUnits;
    const widthOfCanvasInUnits = canvasAspectRatio * heightOfCanvasInUnits;

    const centerPosition = this.props.centerPosition;
    
    const maxIterationCount = this.props.maxIterationCount;

    const imageData = this.renderImage(context, widthOfCanvasInPixels, heightOfCanvasInPixels, widthOfCanvasInUnits, heightOfCanvasInUnits, centerPosition, maxIterationCount);

    context.putImageData(imageData, 0, 0);
  }
  render() {
    return (
      <canvas ref={canvas => this.canvasDomElement = canvas} width={this.props.width} height={this.props.height}>
        Your browser does not support the canvas tag. Please upgrade your browser.
      </canvas>
    );
  }
}