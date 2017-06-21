import * as React from "react";

import * as Utils from "../Utils";
import { Complex, add, subtract, multiply, abs } from "../Complex";
import * as Color from "../Color";
import { NumberInput } from "../NumberInput";
import { ColorInput } from "../ColorInput";

function createMandelbrotSetImageDataPart(widthInPixels: number, heightInPixels: number, widthInUnits: number, heightInUnits: number, centerPosition: Complex, maxIterationCount: number, hue: number, saturation: number, startRowIndex: number, rowCount: number): Uint8ClampedArray {
  const widthOfPixelInUnits = widthInUnits / widthInPixels;
  const heightOfPixelInUnits = heightInUnits / heightInPixels;
  
  const topLeftPosition = add(centerPosition, new Complex(-(widthInUnits / 2), heightInUnits / 2));
  const topLeftPixelCenterPosition = add(topLeftPosition, new Complex(widthOfPixelInUnits / 2, -(heightOfPixelInUnits / 2)));

  let imageData = new Uint8ClampedArray(4 * widthInPixels * rowCount);
  
  const startPixelY = startRowIndex;
  const endPixelY = startPixelY + rowCount;
  let pixelRgb = new Array(3);

  for(let y = startPixelY; y < endPixelY; y++) {
    for(let x = 0; x < widthInPixels; x++) {
      const cRe = topLeftPixelCenterPosition.re + (x * widthOfPixelInUnits);
      const cIm = topLeftPixelCenterPosition.im - (y * heightOfPixelInUnits);
      let znRe = 0;
      let znIm = 0;
      let n = 1;

      /*
      n: [1 to maxIterationCount + 1]
      maxIterationCount + 1 means the point is in the set!
      n < (maxIterationCount + 1) means the point is not in the set.
      */
      for(n = 1; n <= maxIterationCount; n++) {
        // z(n + 1) = (zn * zn) + c
        const reSquared = znRe * znRe;
        const imSquared = znIm * znIm;
        const newRe = (reSquared - imSquared) + cRe;
        const newIm = (2 * (znRe * znIm)) + cIm;
        znRe = newRe;
        znIm = newIm;

        // if absSquared(zn) > (2 * 2)
        if((reSquared + imSquared) > 4) {
          break;
        }
      }
      
      const colorI = n - 1; // [0, maxIterationCount]
      const lightness = (colorI === maxIterationCount) ? 0 : Math.sqrt(colorI / (maxIterationCount - 1));
      Color.hslToRgbRef(hue, saturation, lightness, pixelRgb);

      // set pixel of image
      const pixelIndex = (widthInPixels * (y - startRowIndex)) + x;
      const pixelRByteIndex = 4 * pixelIndex;

      imageData[pixelRByteIndex] = pixelRgb[0];
      imageData[pixelRByteIndex + 1] = pixelRgb[1];
      imageData[pixelRByteIndex + 2] = pixelRgb[2];
      imageData[pixelRByteIndex + 3] = 255;
    }
  }

  return imageData;
}

export interface MandelbrotSetRendererProps {
  heightInUnits: number;
  centerPosition: Complex;
  hue: number;
  saturation: number;
  maxIterationCount: number;
  supersamplingAmount: number;

  onCenterPositionChange: (newValue: Complex) => void,

  style?: any
}
export interface MandelbrotSetRendererState {}

export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  boundOnWindowResize: (event: any) => void;

  canvasDomElementWidth: number = 640;
  canvasDomElementHeight: number = 480;

  constructor(props: MandelbrotSetRendererProps) {
    super(props);

    this.state = {};
  }

  getComplexCoordinates(pixelPosition: Utils.Vector2): Complex {
    if(!this.canvasContext) { return new Complex(0, 0); }

    const widthOfCanvasInPixels = this.getSupersampledWidth();
    const heightOfCanvasInPixels = this.getSupersampledHeight();

    const canvasAspectRatio = widthOfCanvasInPixels / heightOfCanvasInPixels;

    const heightOfCanvasInUnits = this.props.heightInUnits;
    const widthOfCanvasInUnits = canvasAspectRatio * heightOfCanvasInUnits;

    const centerPosition = this.props.centerPosition;

    const widthOfPixelInUnits = widthOfCanvasInUnits / widthOfCanvasInPixels;
    const heightOfPixelInUnits = heightOfCanvasInUnits / heightOfCanvasInPixels;
    
    const topLeftPosition = add(centerPosition, new Complex(-(widthOfCanvasInUnits / 2), heightOfCanvasInUnits / 2));
    const topLeftPixelCenterPosition = add(topLeftPosition, new Complex(widthOfPixelInUnits / 2, -(heightOfPixelInUnits / 2)));

    const re = topLeftPixelCenterPosition.re + (pixelPosition.x * widthOfPixelInUnits);
    const im = topLeftPixelCenterPosition.im - (pixelPosition.y * heightOfPixelInUnits);

    return new Complex(re, im);
  }
  getSupersampledWidth(): number {
    return this.props.supersamplingAmount * this.canvasDomElementWidth;
  }
  getSupersampledHeight(): number {
    return this.props.supersamplingAmount * this.canvasDomElementHeight;
  }
  reRenderMandelbrotSet() {
    if(!this.canvasContext) { return; }

    const widthOfCanvasInPixels = this.getSupersampledWidth();
    const heightOfCanvasInPixels = this.getSupersampledHeight();

    const canvasAspectRatio = widthOfCanvasInPixels / heightOfCanvasInPixels;

    const heightOfCanvasInUnits = this.props.heightInUnits;
    const widthOfCanvasInUnits = canvasAspectRatio * heightOfCanvasInUnits;

    const centerPosition = this.props.centerPosition;
    
    const maxIterationCount = this.props.maxIterationCount;

    const hue = this.props.hue;
    const saturation = this.props.saturation;
    
    // test webworkers
    const threadCount = 8;
    const threadRowRanges = Utils.splitRangeIntoSubRanges(new Utils.IntRange(0, heightOfCanvasInPixels), threadCount);

    for(let threadIndex = 0; threadIndex < threadCount; threadIndex++) {
      const rowStartIndex = threadRowRanges[threadIndex].start;
      const rowCount = threadRowRanges[threadIndex].count;

      Utils.runInBackgroundThread(createMandelbrotSetImageDataPart, [
        widthOfCanvasInPixels,
        heightOfCanvasInPixels,
        widthOfCanvasInUnits,
        heightOfCanvasInUnits,
        centerPosition,
        maxIterationCount,
        hue,
        saturation,
        threadRowRanges[threadIndex].start,
        rowCount
      ], (pixels: Uint8ClampedArray) => {
        let imageData = this.canvasContext.createImageData(widthOfCanvasInPixels, rowCount);
        imageData.data.set(pixels);

        this.canvasContext.putImageData(imageData, 0, rowStartIndex);
      });
    }
  }

  onCanvasClick(event: any) {
    const scaledCursorPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, new Utils.Vector2(event.clientX, event.clientY));
    const newCenterPosition = this.getComplexCoordinates(scaledCursorPositionInCanvas);
    this.props.onCenterPositionChange(newCenterPosition);
  }

  onWindowResize(event: any) {
    const canvasBoundingClientRect = this.canvasDomElement.getBoundingClientRect();

    this.canvasDomElementWidth = canvasBoundingClientRect.width;
    this.canvasDomElementHeight = canvasBoundingClientRect.height;

    this.canvasDomElement.width = this.getSupersampledWidth();
    this.canvasDomElement.height = this.getSupersampledHeight();

    this.reRenderMandelbrotSet();
  }
  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.boundOnWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.boundOnWindowResize, false);

    this.onWindowResize(null);

    this.canvasContext = context;
    this.reRenderMandelbrotSet();
  }
  componentWillUnmount() {
    if(this.boundOnWindowResize) {
      window.addEventListener("resize", this.boundOnWindowResize, false);
    }
  }

  componentDidUpdate() {
    this.reRenderMandelbrotSet();
  }

  render() {
    return (
      <canvas ref={canvas => this.canvasDomElement = canvas} width={this.getSupersampledWidth()} height={this.getSupersampledHeight()} onClick={this.onCanvasClick.bind(this)} style={this.props.style}>
        Your browser does not support the canvas tag. Please upgrade your browser.
      </canvas>
    );
  }
}

export interface MandelbrotSetRendererEditorProps {
}
export interface MandelbrotSetRendererEditorState {
  componentProps: MandelbrotSetRendererProps,
  color: Color.Color
}

export class MandelbrotSetRendererEditor extends React.Component<MandelbrotSetRendererEditorProps, MandelbrotSetRendererEditorState> {
  constructor(props: MandelbrotSetRendererEditorProps) {
    super(props);

    const hue = 0.66;
    const saturation = 0.5;

    this.state = {
      componentProps: {
        heightInUnits: 3,
        centerPosition: new Complex(-0.75, 0),
        hue: hue,
        saturation: saturation,
        maxIterationCount: 100,
        supersamplingAmount: 2,
        onCenterPositionChange: this.onCenterPositionChange.bind(this),
        style: { width: "100%", height: "100%" }
      },
      color: this.hsToColor(hue, saturation)
    };
  }

  hsToColor(hue: number, saturation: number): Color.Color {
    const rgb = Color.hslToRgb(hue, saturation, 0.5);
    return new Color.Color(rgb[0], rgb[1], rgb[2], 1);
  }

  onWidthChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }

    const newComponentProps = { ...this.state.componentProps, width: newValue };
    this.setState({ componentProps: newComponentProps });
  }
  onHeightChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.componentProps, height: newValue };
    this.setState({ componentProps: newComponentProps });
  }
  onHeightInUnitsChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.componentProps, heightInUnits: newValue };
    this.setState({ componentProps: newComponentProps });
  }
  onCenterPositionXChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newCenterPosition = new Complex(newValue, this.state.componentProps.centerPosition.im);
    const newComponentProps = { ...this.state.componentProps, centerPosition: newCenterPosition };
    this.setState({ componentProps: newComponentProps });
  }
  onCenterPositionYChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newCenterPosition = new Complex(this.state.componentProps.centerPosition.re, newValue);
    const newComponentProps = { ...this.state.componentProps, centerPosition: newCenterPosition };
    this.setState({ componentProps: newComponentProps });
  }
  onCenterPositionChange(newValue: Complex) {
    const newComponentProps = { ...this.state.componentProps, centerPosition: newValue };
    this.setState({ componentProps: newComponentProps });
  }
  onColorChange(newValue: Color.Color) {
    const hsl = Color.rgbToHsl(newValue.r, newValue.g, newValue.b);
    const newComponentProps = { ...this.state.componentProps, hue: hsl[0], saturation: hsl[1] };

    this.setState({ componentProps: newComponentProps, color: newValue });
  }
  onMaxIterationCountChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.componentProps, maxIterationCount: newValue };
    this.setState({ componentProps: newComponentProps });
  }
  onSupersamplingAmountChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.componentProps, supersamplingAmount: newValue };
    this.setState({ componentProps: newComponentProps });
  }

  render() {
    /*
    Width: <NumberInput value={this.state.componentProps.width} onChange={this.onWidthChange.bind(this)} /><br />
    Height: <NumberInput value={this.state.componentProps.height} onChange={this.onHeightChange.bind(this)} /><br />
    Supersampling Amount: <NumberInput value={this.state.componentProps.supersamplingAmount} onChange={this.onSupersamplingAmountChange.bind(this)} /><br />
    */

    const minCoordinateSliderValue = -10;
    const maxCoordinateSliderValue = 10;
    const toolSidebarStyle: React.CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0
    };
    
    return (
      <div style={{width: "100%", height: "100vh", padding: "1em"}}>
        <div style={{width: "100%", height: "100%", position: "relative"}}>
          <div className="card" style={toolSidebarStyle}>
            View Height In Units: <NumberInput value={this.state.componentProps.heightInUnits} onChange={this.onHeightInUnitsChange.bind(this)} showSlider={false} /><br />
            x (real coordinate): <NumberInput value={this.state.componentProps.centerPosition.re} onChange={this.onCenterPositionXChange.bind(this)} showSlider={false} /><br />
            y (imaginary coordinate): <NumberInput value={this.state.componentProps.centerPosition.im} onChange={this.onCenterPositionYChange.bind(this)} showSlider={false} /><br />
            Color: <ColorInput value={this.state.color} onChange={this.onColorChange.bind(this)} /><br />
            Max. Iteration Count: <NumberInput value={this.state.componentProps.maxIterationCount} onChange={this.onMaxIterationCountChange.bind(this)} showSlider={false} /><br />
          </div>

          {React.createElement(MandelbrotSetRenderer, this.state.componentProps)}
        </div>
      </div>
    );
  }
}