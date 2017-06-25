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

  onMouseDown?: (cursorPositionRelativeToCanvas: Utils.Vector2, cursorComplexPosition: Complex, event: MouseEvent) => void;
  onMouseUp?: (cursorPositionRelativeToCanvas: Utils.Vector2, cursorComplexPosition: Complex, event: MouseEvent) => void;
  onMouseMove?: (cursorPositionRelativeToCanvas: Utils.Vector2, cursorComplexPosition: Complex, event: MouseEvent) => void;

  className?: string,
  style?: any
}
export interface MandelbrotSetRendererState {}

export class MandelbrotSetRenderer extends React.Component<MandelbrotSetRendererProps, MandelbrotSetRendererState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  boundOnWindowResize: ((event: any) => void) | null;

  canvasDomElementWidth: number = 640;
  canvasDomElementHeight: number = 480;

  renderId: string;

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

    const localRenderId = Utils.genUniqueId();
    this.renderId = localRenderId;

    const widthOfCanvasInPixels = this.getSupersampledWidth();
    const heightOfCanvasInPixels = this.getSupersampledHeight();

    const canvasAspectRatio = widthOfCanvasInPixels / heightOfCanvasInPixels;

    const heightOfCanvasInUnits = this.props.heightInUnits;
    const widthOfCanvasInUnits = canvasAspectRatio * heightOfCanvasInUnits;

    const centerPosition = this.props.centerPosition;
    
    const maxIterationCount = this.props.maxIterationCount;

    const hue = this.props.hue;
    const saturation = this.props.saturation;
    
    const threadCount = 16;
    const threadRowRanges = Utils.splitRangeIntoSubRanges(new Utils.IntRange(0, heightOfCanvasInPixels), threadCount);

    const executeThreadRecursively = (threadIndex) => {
      if(localRenderId !== this.renderId) { return; }

      const rowStartIndex = threadRowRanges[threadIndex].start;
      const rowCount = threadRowRanges[threadIndex].count;

      const pixels = createMandelbrotSetImageDataPart(
        widthOfCanvasInPixels,
        heightOfCanvasInPixels,
        widthOfCanvasInUnits,
        heightOfCanvasInUnits,
        centerPosition,
        maxIterationCount,
        hue,
        saturation,
        rowStartIndex,
        rowCount
      );

      let imageData = this.canvasContext.createImageData(widthOfCanvasInPixels, rowCount);
      imageData.data.set(pixels);

      this.canvasContext.putImageData(imageData, 0, rowStartIndex);

      threadIndex++;
      if(threadIndex < threadCount) {
        setTimeout(() => executeThreadRecursively(threadIndex), 20);
      }
    };

    executeThreadRecursively(0);
  }

  onWindowResize(event: any) {
    const canvasBoundingClientRect = this.canvasDomElement.getBoundingClientRect();

    this.canvasDomElementWidth = canvasBoundingClientRect.width;
    this.canvasDomElementHeight = canvasBoundingClientRect.height;

    this.canvasDomElement.width = this.getSupersampledWidth();
    this.canvasDomElement.height = this.getSupersampledHeight();

    this.reRenderMandelbrotSet();
  }

  onMouseDown(event: any) {
    if(this.props.onMouseDown) {
      const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
      const cursorPositionRelativeToCanvas = Utils.getOffsetRelativeToElement(this.canvasDomElement, scrolledCursorPosition);
      const cursorScaledPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, scrolledCursorPosition);
      const cursorComplexPosition = this.getComplexCoordinates(cursorScaledPositionInCanvas);

      this.props.onMouseDown(cursorPositionRelativeToCanvas, cursorComplexPosition, event);
    }
  }
  onMouseUp(event: any) {
    if(this.props.onMouseUp) {
      const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
      const cursorPositionRelativeToCanvas = Utils.getOffsetRelativeToElement(this.canvasDomElement, scrolledCursorPosition);
      const cursorScaledPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, scrolledCursorPosition);
      const cursorComplexPosition = this.getComplexCoordinates(cursorScaledPositionInCanvas);

      this.props.onMouseUp(cursorPositionRelativeToCanvas, cursorComplexPosition, event);
    }
  }
  onMouseMove(event: any) {
    if(this.props.onMouseMove) {
      const scrolledCursorPosition = new Utils.Vector2(event.clientX, event.clientY);
      const cursorPositionRelativeToCanvas = Utils.getOffsetRelativeToElement(this.canvasDomElement, scrolledCursorPosition);
      const cursorScaledPositionInCanvas = Utils.getScaledPositionInCanvas(this.canvasDomElement, scrolledCursorPosition);
      const cursorComplexPosition = this.getComplexCoordinates(cursorScaledPositionInCanvas);

      this.props.onMouseMove(cursorPositionRelativeToCanvas, cursorComplexPosition, event);
    }
  }

  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.boundOnWindowResize = this.onWindowResize.bind(this);
    if(this.boundOnWindowResize !== null) {
      window.addEventListener("resize", this.boundOnWindowResize, false);
    }

    this.onWindowResize(null);

    this.canvasContext = context;
    this.reRenderMandelbrotSet();
  }
  componentWillUnmount() {
    if(this.boundOnWindowResize) {
      window.removeEventListener("resize", this.boundOnWindowResize, false);
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
      </div>
    );
  }
}

export interface MandelbrotSetRendererEditorProps {}
export interface MandelbrotSetRendererEditorState {
  componentProps: MandelbrotSetRendererProps,
  nextComponentProps: MandelbrotSetRendererProps,
  color: Color.Color,
  isMenuOpen: boolean,
  autoMaxIterationCount: boolean,
  cursorDragStartPositionRelativeToCanvas: Utils.Vector2 | null,
  cursorDragStartComplexPosition: Complex,
  cursorPositionRelativeToCanvas: Utils.Vector2,
  cursorComplexPosition: Complex,
  hasLoadedInitialParams: boolean
}

export class MandelbrotSetRendererEditor extends React.Component<MandelbrotSetRendererEditorProps, MandelbrotSetRendererEditorState> {
  containerElement: HTMLElement;
  boundOnMouseUp: ((event: any) => void) | null;
  boundOnHashChange: ((event: any) => void) | null;
  defaultHue = 0.66;
  defaultSaturation = 0.5;
  wasHashChangedProgrammatically = false;

  constructor(props: MandelbrotSetRendererEditorProps) {
    super(props);

    this.state = {
      componentProps: this.getDefaultComponentProps(),
      nextComponentProps: this.getDefaultComponentProps(),
      color: this.hsToColor(this.defaultHue, this.defaultSaturation),
      isMenuOpen: false,
      autoMaxIterationCount: true,
      cursorDragStartPositionRelativeToCanvas: null,
      cursorDragStartComplexPosition: new Complex(0, 0),
      cursorPositionRelativeToCanvas: new Utils.Vector2(0, 0),
      cursorComplexPosition: new Complex(0, 0),
      hasLoadedInitialParams: false
    };
  }

  getDefaultComponentProps(): MandelbrotSetRendererProps {
    const heightInUnits = 3;

    return {
      heightInUnits: heightInUnits,
      centerPosition: new Complex(-0.75, 0),
      hue: this.defaultHue,
      saturation: this.defaultSaturation,
      maxIterationCount: this.calcAutoMaxIterationCount(heightInUnits),
      supersamplingAmount: 1,
      onMouseDown: this.onMouseDown.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
      className: "hover-cursor",
      style: { width: "100%", height: "100%" }
    };
  }
  calcAutoMaxIterationCount(heightInUnits): number {
    return Math.floor(200 / Math.pow(heightInUnits, 1 / 4));
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

  onMouseDown(cursorPositionRelativeToCanvas: Utils.Vector2, cursorComplexPosition: Complex, event: MouseEvent) {
    if(event.button === 0) {
      this.boundOnMouseUp = this.onMouseUp.bind(this);
      if(this.boundOnMouseUp !== null) {
        window.addEventListener("mouseup", this.boundOnMouseUp);
      }

      this.setState({
        cursorDragStartPositionRelativeToCanvas: cursorPositionRelativeToCanvas,
        cursorDragStartComplexPosition: cursorComplexPosition
      });
    } else if(event.button === 2) {
      const newComponentProps = { ...this.state.nextComponentProps, heightInUnits: 2 * this.state.componentProps.heightInUnits };
      this.commitNewComponentProps(newComponentProps, this.state.color, this.state.autoMaxIterationCount, true);
    }
  }
  onMouseUp(event: any) {
    if(event.button === 0) {
      if(this.boundOnMouseUp !== null) {
        window.removeEventListener("mouseup", this.boundOnMouseUp);
        this.boundOnMouseUp = null;
      }

      const centerPosition = new Complex((this.state.cursorDragStartComplexPosition.re + this.state.cursorComplexPosition.re) / 2, (this.state.cursorDragStartComplexPosition.im + this.state.cursorComplexPosition.im) / 2);
      
      let heightInUnits = Math.abs(this.state.cursorComplexPosition.re - this.state.cursorDragStartComplexPosition.re);
      if(heightInUnits === 0) {
        heightInUnits = this.state.componentProps.heightInUnits;
      }

      const newComponentProps = {
        ...this.state.nextComponentProps,
        centerPosition: centerPosition,
        heightInUnits: heightInUnits,
        maxIterationCount: this.state.autoMaxIterationCount ? this.calcAutoMaxIterationCount(heightInUnits) : this.state.nextComponentProps.maxIterationCount
      };

      this.setState({ cursorDragStartPositionRelativeToCanvas: null });

      this.commitNewComponentProps(newComponentProps, this.state.color, this.state.autoMaxIterationCount, true);
    }
  }
  onMouseMove(cursorPositionRelativeToCanvas: Utils.Vector2, cursorComplexPosition: Complex, event: MouseEvent) {
    this.setState({
      cursorPositionRelativeToCanvas: cursorPositionRelativeToCanvas,
      cursorComplexPosition: cursorComplexPosition
    });
  }

  toggleAutoMaxIterationCount() {
    const newComponentProps = {
      ...this.state.nextComponentProps,
      maxIterationCount: this.calcAutoMaxIterationCount(this.state.nextComponentProps.heightInUnits)
    };
    this.setState({
      autoMaxIterationCount: !this.state.autoMaxIterationCount,
      nextComponentProps: newComponentProps
    });
  }

  onRenderClick() {
    this.commitNewComponentProps(this.state.nextComponentProps, this.state.color, this.state.autoMaxIterationCount, true);
  }
  onResetClick() {
    const newComponentProps = this.getDefaultComponentProps();
    this.commitNewComponentProps(newComponentProps, this.hsToColor(this.defaultHue, this.defaultSaturation), true, true);
  }

  onContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
  onHashChange(e: any) {
    if(!this.wasHashChangedProgrammatically) {
      this.updateComponentPropsFromUrl();
    } else {
      this.wasHashChangedProgrammatically = false;
    }
  }
  
  updateUrlFromComponentProps(newComponentProps: MandelbrotSetRendererProps, newColor: Color.Color, autoMaxIterationCount: boolean) {
    const urlParamsObj = {
      heightInUnits: newComponentProps.heightInUnits,
      x: newComponentProps.centerPosition.re,
      y: newComponentProps.centerPosition.im,
      hue: newComponentProps.hue,
      saturation: newComponentProps.saturation,
      maxIterationCount: newComponentProps.maxIterationCount,
      supersamplingAmount: newComponentProps.supersamplingAmount,
      color: newColor,
      autoMaxIterationCount: autoMaxIterationCount
    };
    //history.pushState(null, "", "#" + Utils.objectToUrlParamsString(urlParamsObj));
    window.location.hash = Utils.objectToUrlParamsString(urlParamsObj);
  }
  updateComponentPropsFromUrl() {
    const urlParamsString = window.location.hash.substr(1);

    if(urlParamsString.length > 0) {
      const urlParams = Utils.urlParamsStringToObject(urlParamsString);

      const newComponentProps = {
        ...this.state.componentProps,
        heightInUnits: parseFloat(urlParams.heightInUnits),
        centerPosition: new Complex(parseFloat(urlParams.x), parseFloat(urlParams.y)),
        hue: parseFloat(urlParams.hue),
        saturation: parseFloat(urlParams.saturation),
        maxIterationCount: parseInt(urlParams.maxIterationCount),
        supersamplingAmount: parseInt(urlParams.supersamplingAmount),
      };
      let newColor = Color.Color.parse(urlParams.color);
      newColor = newColor ? newColor : this.hsToColor(this.defaultHue, this.defaultSaturation);

      const newAutoMaxIterationCount = urlParams.autoMaxIterationCount === "true";

      this.commitNewComponentProps(newComponentProps, newColor, newAutoMaxIterationCount, false);
    } else {
      this.commitNewComponentProps(this.getDefaultComponentProps(), this.hsToColor(this.defaultHue, this.defaultSaturation), true, false);
    }
  }
  commitNewComponentProps(newComponentProps: MandelbrotSetRendererProps, newColor: Color.Color, newAutoMaxIterationCount: boolean, updateUrl: boolean) {
    if(updateUrl) {
      this.wasHashChangedProgrammatically = true;
      this.updateUrlFromComponentProps(newComponentProps, newColor, newAutoMaxIterationCount);
    }

    this.setState({
      componentProps: newComponentProps,
      nextComponentProps: newComponentProps,
      color: newColor,
      autoMaxIterationCount: newAutoMaxIterationCount
    });
  }

  componentDidMount() {
    // Scroll to the Mandelbrot set.
    window.scroll(0, this.containerElement.getBoundingClientRect().top);

    // Scroll to the top before refreshing so that Chrome doesn't mess up our auto-scrolling with its auto-scrolling.
    window.addEventListener("beforeUnload", () => window.scroll(0, 0));

    this.boundOnHashChange = this.onHashChange.bind(this);
    if(this.boundOnHashChange) {
      window.addEventListener("hashchange", this.boundOnHashChange, false);
    }

    if(window.location.hash.substr(1).length > 0) {
      this.updateComponentPropsFromUrl();
    }
    
    this.setState({ hasLoadedInitialParams: true });
  }
  componentWillUnmount() {
    if(this.boundOnMouseUp !== null) {
      window.removeEventListener("mouseup", this.boundOnMouseUp);
      this.boundOnMouseUp = null;
    }

    if(this.boundOnHashChange !== null) {
      window.removeEventListener("hashchange", this.boundOnHashChange);
      this.boundOnHashChange = null;
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

    return <div onMouseUp={this.onMouseUp.bind(this)} className="no-pointer-events" style={style} />;
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
      <div ref={containerElement => this.containerElement = containerElement} style={{width: "100%", height: "100vh"}}>
        <div onContextMenu={this.onContextMenu.bind(this)} style={{width: "100%", height: "100%", position: "relative"}}>
          {this.state.hasLoadedInitialParams ? React.createElement(MandelbrotSetRenderer, this.state.componentProps) : null}

          <div style={toolSidebarContainerStyle}>
            {this.state.isMenuOpen ? (
              <div className="card no-user-select">
                <div style={{textAlign: "right", paddingBottom: "0.5em"}}>
                  <span onClick={this.toggleIsMenuOpen.bind(this)} className="fa fa-times hover-cursor" />
                </div>

                <p style={{fontWeight: "bold", textAlign: "center"}}>Click to move, click and drag to zoom.</p>

                <div>
                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>View Height In Units:</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.heightInUnits} onChange={this.onHeightInUnitsChange.bind(this)} showSlider={false} />
                    </div>
                  </div>
                  
                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>real coordinate (x):</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.centerPosition.re} onChange={this.onCenterPositionXChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>imaginary coordinate (y):</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.centerPosition.im} onChange={this.onCenterPositionYChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Color:</div>
                    <div className="col-1-2">
                      <ColorInput value={this.state.color} onChange={this.onColorChange.bind(this)} />
                    </div>
                  </div>

                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Auto. Iteration Count:</div>
                    <div className="col-1-2">
                      <input type="checkbox" checked={this.state.autoMaxIterationCount} onChange={this.toggleAutoMaxIterationCount.bind(this)} />
                    </div>
                  </div>

                  <div className="row no-padding" style={{marginBottom: "0.5em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Max. Iteration Count:</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.nextComponentProps.maxIterationCount} onChange={this.onMaxIterationCountChange.bind(this)} showSlider={false} readOnly={this.state.autoMaxIterationCount} />
                    </div>
                  </div>

                  <div className="row no-padding" style={{marginBottom: "1em"}}>
                    <div className="col-1-2" style={{alignSelf: "center"}}>Supersamples<br />(Render Quality):</div>
                    <div className="col-1-2">
                      <NumberInput value={this.state.componentProps.supersamplingAmount} onChange={this.onSupersamplingAmountChange.bind(this)} showSlider={false} />
                    </div>
                  </div>

                  <div style={{marginTop: "2em"}}>
                    <button onClick={this.onRenderClick.bind(this)}>Re-render</button>
                    <span style={{paddingLeft: "1em"}}><button onClick={this.onResetClick.bind(this)} className="green">Reset</button></span>
                  </div>
                </div>
              </div>
            ) : (
              <span onClick={this.toggleIsMenuOpen.bind(this)} className="fa fa-bars hover-cursor" style={menuIconStyle} />
            )}
          </div>
          
          {this.renderSelectionRect()}
        </div>
      </div>
    );
  }
}