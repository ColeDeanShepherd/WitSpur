import * as React from "react";
import equal = require("deep-equal");

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

  className?: string,
  style?: any
}
export interface MandelbrotSetRendererState {
  cursorPositionRelativeToCanvas: Utils.Vector2,
  cursorDragStartPositionRelativeToCanvas: Utils.Vector2 | null
}

export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  boundOnWindowResize: (event: any) => void;

  canvasDomElementWidth: number = 640;
  canvasDomElementHeight: number = 480;

  constructor(props: MandelbrotSetRendererProps) {
    super(props);

    this.state = {
      cursorPositionRelativeToCanvas: new Utils.Vector2(0, 0),
      cursorDragStartPositionRelativeToCanvas: null
    };
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

  onMouseDown(event: any) {
    const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
    this.setState({ cursorDragStartPositionRelativeToCanvas: Utils.getOffsetRelativeToElement(this.canvasDomElement, scrolledCursorPosition) });
  }
  onMouseUp(event: any) {
    if(this.props.onCenterPositionChange) {
      const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
      const cursorDragEndScaledPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, scrolledCursorPosition);
      const cursorDragEndComplexPosition = this.getComplexCoordinates(cursorDragEndScaledPositionInCanvas);

      this.props.onCenterPositionChange(cursorDragEndComplexPosition);
    }

    this.setState({ cursorDragStartPositionRelativeToCanvas: null });
  }
  onMouseMove(event: any) {
    const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
    this.setState({ cursorPositionRelativeToCanvas: Utils.getOffsetRelativeToElement(this.canvasDomElement, scrolledCursorPosition) });
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

  shouldComponentUpdate(nextProps: MandelbrotSetRendererProps, nextState: MandelbrotSetRendererState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }
  componentDidUpdate(prevProps: MandelbrotSetRendererProps, prevState: MandelbrotSetRendererState) {
    if(!equal(this.props, prevProps)) {
      this.reRenderMandelbrotSet();
    }
  }

  renderSelectionRect() {
    if(!this.state.cursorDragStartPositionRelativeToCanvas) { return null; }

    const left = Math.min(this.state.cursorDragStartPositionRelativeToCanvas.x, this.state.cursorPositionRelativeToCanvas.x);
    const right = Math.max(this.state.cursorDragStartPositionRelativeToCanvas.x, this.state.cursorPositionRelativeToCanvas.x);
    const top = Math.min(this.state.cursorDragStartPositionRelativeToCanvas.y, this.state.cursorPositionRelativeToCanvas.y);
    const bottom = Math.max(this.state.cursorDragStartPositionRelativeToCanvas.y, this.state.cursorPositionRelativeToCanvas.y);
    
    const width = right - left;
    const height = bottom - top;

    const style: React.CSSProperties = {
      width: width,
      height: height,
      border: "2px solid #F00",
      position: "absolute",
      left: left,
      top: top
    };

    return <div style={style} />;
  }
  render() {
    return (
      <div style={{width: "100%", height: "100%", position: "relative"}}>
        <canvas
          ref={canvas => this.canvasDomElement = canvas}
          width={this.getSupersampledWidth()}
          height={this.getSupersampledHeight()}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          className={this.props.className}
          style={this.props.style}>
          Your browser does not support the canvas tag. Please upgrade your browser.
        </canvas>
        {this.renderSelectionRect()}
      </div>
    );
  }
}

export interface MandelbrotSetRendererEditorProps {
}
export interface MandelbrotSetRendererEditorState {
  componentProps: MandelbrotSetRendererProps,
  nextComponentProps: MandelbrotSetRendererProps,
  color: Color.Color,
  isMenuOpen: boolean
}

export class MandelbrotSetRendererEditor extends React.Component<MandelbrotSetRendererEditorProps, MandelbrotSetRendererEditorState> {
  constructor(props: MandelbrotSetRendererEditorProps) {
    super(props);

    const hue = 0.66;
    const saturation = 0.5;
    const componentProps = {
      heightInUnits: 3,
      centerPosition: new Complex(-0.75, 0),
      hue: hue,
      saturation: saturation,
      maxIterationCount: 100,
      supersamplingAmount: 1,
      onCenterPositionChange: this.onCenterPositionChange.bind(this),
      className: "hover-cursor",
      style: { width: "100%", height: "100%" }
    };

    this.state = {
      componentProps: componentProps,
      nextComponentProps: { ...componentProps },
      color: this.hsToColor(hue, saturation),
      isMenuOpen: true
    };
  }

  hsToColor(hue: number, saturation: number): Color.Color {
    const rgb = Color.hslToRgb(hue, saturation, 0.5);
    return new Color.Color(rgb[0], rgb[1], rgb[2], 1);
  }

  onWidthChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }

    const newComponentProps = { ...this.state.nextComponentProps, width: newValue };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onHeightChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.nextComponentProps, height: newValue };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onHeightInUnitsChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.nextComponentProps, heightInUnits: newValue };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onCenterPositionXChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newCenterPosition = new Complex(newValue, this.state.nextComponentProps.centerPosition.im);
    const newComponentProps = { ...this.state.nextComponentProps, centerPosition: newCenterPosition };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onCenterPositionYChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newCenterPosition = new Complex(this.state.nextComponentProps.centerPosition.re, newValue);
    const newComponentProps = { ...this.state.nextComponentProps, centerPosition: newCenterPosition };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onCenterPositionChange(newValue: Complex) {
    const newComponentProps = { ...this.state.nextComponentProps, centerPosition: newValue };
    this.setState({ componentProps: newComponentProps, nextComponentProps: { ...newComponentProps } });
  }
  onColorChange(newValue: Color.Color) {
    const hsl = Color.rgbToHsl(newValue.r, newValue.g, newValue.b);
    const newComponentProps = { ...this.state.nextComponentProps, hue: hsl[0], saturation: hsl[1] };

    this.setState({ nextComponentProps: newComponentProps, color: newValue });
  }
  onMaxIterationCountChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.nextComponentProps, maxIterationCount: newValue };
    this.setState({ nextComponentProps: newComponentProps });
  }
  onSupersamplingAmountChange(newValue: number | null, newValueString: string) {
    if(newValue === null) { return; }
    
    const newComponentProps = { ...this.state.nextComponentProps, supersamplingAmount: newValue };
    this.setState({ nextComponentProps: newComponentProps });
  }

  toggleIsMenuOpen() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  onRenderClick() {
    this.setState({ componentProps: this.state.nextComponentProps });
  }

  render() {
    const minCoordinateSliderValue = -10;
    const maxCoordinateSliderValue = 10;
    const toolSidebarContainerStyle: React.CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0,
      padding: "1em"
    };
    const menuIconStyle: React.CSSProperties = {
      width: "40px",
      height: "40px",
      color: "#FFF",
      fontSize: "32px"
    };
    
    return (
      <div style={{width: "100%", height: "100vh", padding: "1em"}}>
        <div style={{width: "100%", height: "100%", position: "relative"}}>
          {React.createElement(MandelbrotSetRenderer, this.state.componentProps)}

          <div style={toolSidebarContainerStyle}>
            {this.state.isMenuOpen ? (
              <div className="card">
                <div style={{textAlign: "right", paddingBottom: "0.5em"}}>
                  <span onClick={this.toggleIsMenuOpen.bind(this)} className="fa fa-times hover-cursor" />
                </div>
                <div>
                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>View Height In Units:</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.heightInUnits} onChange={this.onHeightInUnitsChange.bind(this)} showSlider={false} />
                    </div>
                  </div>
                  
                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>x (real coordinate):</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.centerPosition.re} onChange={this.onCenterPositionXChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>y (imaginary coordinate):</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.centerPosition.im} onChange={this.onCenterPositionYChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Color:</div>
                    <div className="col-1-2">
                      <ColorInput value={this.state.color} onChange={this.onColorChange.bind(this)} />
                    </div>
                  </div>

                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Max. Iteration Count:</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.maxIterationCount} onChange={this.onMaxIterationCountChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div className="row" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Supersamples:</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.componentProps.supersamplingAmount} onChange={this.onSupersamplingAmountChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div>
                    <button onClick={this.onRenderClick.bind(this)}>Re-render</button>
                  </div>
                </div>
              </div>
            ) : (
              <span onClick={this.toggleIsMenuOpen.bind(this)} className="fa fa-bars hover-cursor" style={menuIconStyle} />
            )}
          </div>
        </div>
      </div>
    );
  }
}