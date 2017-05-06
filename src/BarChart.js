import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {colorToString, camelCaseToWords, capitalizeWord, openNewTab} from './Utils.js';
import {
  CustomPropTypes,
  arePropsValid,
  userPropsToInitialState,
  isPropValid,
  renderPropInput
} from './ComponentEditor.js';

export class BarChart extends React.Component {
  render() {
    const {
      values,
      valueLabels,
      title,
      xAxisLabel,
      yAxisLabel,
      yAxisValueLabelInterval,
      yAxisMin,
      yAxisMax,
      width,
      height,
      backgroundColor,
      lineColor,
      textFontFamily,
      textSize,
      textColor,
      barFillColor,
      barValueTextColor,
      barWidth,
      barMargin
    } = this.props;

    if(!arePropsValid(this.props, BarChart.userProps)) {
        return null;
    }

    const titleRectWidth = width;
    const titleRectHeight = 30;
    const titleRectX = 0;
    const titleRectY = 0;

    const xAxisRectHeight = 40;
    const yAxisRectWidth = 50;

    const xAxisRectX = yAxisRectWidth;
    const xAxisRectY = height - xAxisRectHeight;
    const yAxisRectX = 0;
    const yAxisRectY = titleRectHeight;

    const xAxisLabelMarginBottom = 5;
    const yAxisLabelMarginLeft = 5;

    const barsAreaX = yAxisRectWidth;
    const barsAreaY = titleRectHeight;
    const barsAreaWidth = width - yAxisRectWidth;
    const barsAreaHeight = height - titleRectHeight - xAxisRectHeight;

    const xAxisRectWidth = barsAreaWidth;
    const yAxisRectHeight = barsAreaHeight;

    const xAxisValueLabelMarginTop = 5;

    const yAxisLabelLineWidth = 5;
    const yAxisLabelMarginRight = 10;
    const valueToHeight = value => barsAreaHeight * ((value - yAxisMin) / (yAxisMax - yAxisMin));

    const barsMarginLeft = 5;

    const barValueLabelMarginTop = 5;

    const waterMarkMargin = 10;
    const waterMarkX = width - waterMarkMargin;
    const waterMarkY = height - waterMarkMargin;

    const getBarXRelativeToBarsArea = index => barsMarginLeft + (index * (barWidth + barMargin));

    function renderDefs() {
      return (
        <defs>
          <clipPath id="barsAreaClipPath">
            <rect x={0} y={0} width={barsAreaWidth} height={barsAreaHeight} />
          </clipPath>
        </defs>
      );
    }
    function renderBackground() {
      return <rect width="100%" height="100%" fill={colorToString(backgroundColor)} />;
    }
    function renderTitle() {
      return (
        <g transform={`translate(${titleRectX},${titleRectY})`}>
          <text fontFamily={textFontFamily} fontSize={textSize} fill={colorToString(textColor)} textAnchor="middle" dominantBaseline="central" x={titleRectWidth / 2} y={titleRectHeight / 2}>{title}</text>
        </g>
      );
    }
    function renderXAxis() {
      // <line x1={0} y1={0} x2={xAxisRectWidth} y2={0} strokeWidth="1" stroke={colorToString(lineColor)} />
      return (
      <g transform={`translate(${xAxisRectX},${xAxisRectY})`}>
        <text fontFamily={textFontFamily} fontSize={textSize} fill={colorToString(textColor)} textAnchor="middle" x={xAxisRectWidth / 2} y={xAxisRectHeight - xAxisLabelMarginBottom}>{xAxisLabel}</text>
        {valueLabels.map((label, index) => (
          <text
            fontFamily={textFontFamily}
            fontSize={textSize}
            fill={colorToString(textColor)}
            x={getBarXRelativeToBarsArea(index) + (barWidth / 2)}
            y={xAxisValueLabelMarginTop}
            textAnchor="middle"
            dominantBaseline="hanging">
            {label}
          </text>
        ))}
      </g>
      );
    }
    function renderYAxis() {
      let valueForLabel = yAxisMin;
      let labels = [];
      let labelLines = [];

      if(yAxisValueLabelInterval > 0) {
        while(valueForLabel <= yAxisMax) {
          const y = yAxisRectHeight - valueToHeight(valueForLabel);

          labels.push(
            <text
              fontFamily={textFontFamily}
              fontSize={textSize}
              fill={colorToString(textColor)}
              x={yAxisRectX + yAxisRectWidth - yAxisLabelMarginRight}
              y={y}
              textAnchor="end"
              dominantBaseline="central">
              {valueForLabel}
            </text>
          );

          labelLines.push(
            <line x1={yAxisRectWidth - yAxisLabelLineWidth} y1={y} x2={yAxisRectWidth + barsAreaWidth} y2={y} strokeWidth="1" stroke={colorToString(lineColor)} />
          );

          valueForLabel += yAxisValueLabelInterval;
        }
      }
      
      return (
      <g transform={`translate(${0},${yAxisRectY})`}>
        <line x1={yAxisRectWidth} y1={yAxisRectX} x2={yAxisRectWidth} y2={yAxisRectHeight} strokeWidth="1" stroke={colorToString(lineColor)} />
        {labelLines}
        {labels}
        <text fontFamily={textFontFamily} fontSize={textSize} fill={colorToString(textColor)} textAnchor="middle" dominantBaseline="hanging" transform={`translate(${yAxisLabelMarginLeft},${yAxisRectHeight / 2}) rotate(-90)`}>{yAxisLabel}</text>
      </g>
      );
    }
    function renderBarsArea() {
      return (
        <g transform={`translate(${barsAreaX}, ${barsAreaY})`} clipPath="url(#barsAreaClipPath)">
          {values.map((value, index) => {
            const barHeight = valueToHeight(value);
            const x = getBarXRelativeToBarsArea(index);
            const y = barsAreaHeight - barHeight;

            return (
              <g transform={`translate(${x},${y})`}>
                <rect width={barWidth} height={barHeight} style={{fill: colorToString(barFillColor)}} />
                <text fontFamily={textFontFamily} fontSize={textSize} fill={colorToString(barValueTextColor)} x={barWidth / 2} y={barValueLabelMarginTop} textAnchor="middle" dominantBaseline="hanging">{value}</text>
              </g>
            );
          })}
        </g>
      );
    }
    function renderWaterMark() {
      return <text fontFamily="sans-serif" fontSize="30px" fontWeight="bold" fill="#000" opacity="0.25" strokeWidth="1" stroke="#FFF" textAnchor="end" x={waterMarkX} y={waterMarkY}>witspur.com</text>;
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
        {renderDefs()}
        {renderBackground()}
        {renderWaterMark()}
        {renderTitle()}
        {renderXAxis()}
        {renderYAxis()}
        {renderBarsArea()}
      </svg>
    );
  }
}
BarChart.userProps = [
  {
    name: "values",
    type: CustomPropTypes.Array(CustomPropTypes.Number),
    defaultValue: [1, 2, 3, 4, 5],
    validate: (values, props) => (values.length > 0) && (values.length === props.valueLabels.length)
  },
  {
    name: "valueLabels",
    type: CustomPropTypes.Array(CustomPropTypes.String),
    defaultValue: ["a", "b", "c", "d", "e"],
    validate: (valueLabels, props) => (valueLabels.length > 0) && (valueLabels.length === props.values.length)
  },
  {
    name: "title",
    type: CustomPropTypes.String,
    defaultValue: "Bar Chart",
    validate: null
  },
  {
    name: "xAxisLabel",
    type: CustomPropTypes.String,
    defaultValue: "X Axis",
    validate: null
  },
  {
    name: "yAxisLabel",
    type: CustomPropTypes.String,
    defaultValue: "Y Axis",
    validate: null
  },
  {
    name: "yAxisValueLabelInterval",
    type: CustomPropTypes.Number,
    defaultValue: 1,
    validate: yAxisValueLabelInterval => yAxisValueLabelInterval > 0
  },
  {
    name: "yAxisMin",
    type: CustomPropTypes.Number,
    defaultValue: 0,
    validate: (yAxisMin, props) => yAxisMin <= props.yAxisMax
  },
  {
    name: "yAxisMax",
    type: CustomPropTypes.Number,
    defaultValue: 10,
    validate: (yAxisMax, props) => yAxisMax >= props.yAxisMin
  },
  {
    name: "width",
    type: CustomPropTypes.Number,
    defaultValue: 640,
    validate: width => width > 0
  },
  {
    name: "height",
    type: CustomPropTypes.Number,
    defaultValue: 480,
    validate: height => height > 0
  },
  {
    name: "backgroundColor",
    type: CustomPropTypes.Color,
    defaultValue: "#FFF",
    validate: null
  },
  {
    name: "lineColor",
    type: CustomPropTypes.Color,
    defaultValue: "#000",
    validate: null
  },
  {
    name: "textFontFamily",
    type: CustomPropTypes.String,
    defaultValue: "sans-serif",
    validate: null
  },
  {
    name: "textSize",
    type: CustomPropTypes.Number,
    defaultValue: 16,
    validate: null
  },
  {
    name: "textColor",
    type: CustomPropTypes.Color,
    defaultValue: "#000",
    validate: null
  },
  {
    name: "barFillColor",
    type: CustomPropTypes.Color,
    defaultValue: "steelblue",
    validate: null
  },
  {
    name: "barValueTextColor",
    type: CustomPropTypes.Color,
    defaultValue: "#FFF",
    validate: null
  },
  {
    name: "barWidth",
    type: CustomPropTypes.Number,
    defaultValue: 40,
    validate: barWidth => barWidth > 0
  },
  {
    name: "barMargin",
    type: CustomPropTypes.Number,
    defaultValue: 10,
    validate: barMargin => barMargin >= 0
  }
];

function runInTmpCanvas(fn, canvasWidth, canvasHeight) {
  if(!fn) { return; }

  // Add an invisible canvas to <body>.
  var tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvasWidth;
  tmpCanvas.height = canvasHeight;
  tmpCanvas.style.display = "none";
  document.getElementsByTagName("body")[0].appendChild(tmpCanvas);

  // Run the passed-in function.
  fn(tmpCanvas, tmpCanvas.getContext("2d"));

  // Remove the temporary canvas.
  tmpCanvas.parentNode.removeChild(tmpCanvas);
}
function getSvgDataUri(svgString) {
  const encodedSvgDocument = btoa(svgString);
  return `data:image/svg+xml;base64,${encodedSvgDocument}`;
}
function exportSvgToFile(svgString) {
  openNewTab(getSvgDataUri(svgString));
}
function exportSvgToRasterImage(svgString, imageWidth, imageHeight, imageFormat) {
  runInTmpCanvas((canvas, context) => {
    var image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      openNewTab(canvas.toDataURL(`image/${imageFormat}`));
    };
    image.src = getSvgDataUri(svgString);
  }, imageWidth, imageHeight);
}

export class BarChartEditor extends React.Component {
  constructor(props) {
    super(props);
    
    this.barChartSvgNode = null;
    this.canvasNode = null;

    this.state = {
      componentProps: userPropsToInitialState(BarChart.userProps)
    };
  }

  barChartRefCallback(mountedBarChartComponent) {
    this.barChartSvgNode = ReactDOM.findDOMNode(mountedBarChartComponent);
  }
  canvasRefCallback(canvasNode) {
    this.canvasNode = canvasNode;
  }
  exportToSvg() {
    exportSvgToFile(this.barChartSvgNode.outerHTML);
  }
  exportToRasterImage(imageFormat) {
    exportSvgToRasterImage(this.barChartSvgNode.outerHTML, this.state.componentProps.width, this.state.componentProps.height, imageFormat);
  }
  
  onComponentPropChange(propName, newValue) {
    var componentPropsDelta = {};
    componentPropsDelta[propName] = newValue;

    this.setState({componentProps: Object.assign(this.state.componentProps, componentPropsDelta)});
  }
  onComponentPropsJSONChange(event) {
    try {
      const newComponentProps = JSON.parse(event.target.value);

      this.setState({componentProps: newComponentProps});
    } catch(e) {

    }
  }
  renderPropEditor(userProp) {
    const isThisPropValid = isPropValid(this.state.componentProps, userProp);

    return (
      <tr style={{border: isThisPropValid ? "" : "1px solid red"}}>
        <td style={{textAlign: "right", verticalAlign: "top", paddingRight: "1em"}}>{camelCaseToWords(userProp.name).map(capitalizeWord).join(" ")}</td>
        <td>{renderPropInput(userProp.type, this.state.componentProps[userProp.name], newValue => this.onComponentPropChange(userProp.name, newValue))}</td>
      </tr>
    );
  }
  renderPropEditors() {
    return (
      <table style={{borderCollapse: "collapse"}}>
        <tbody>
          {BarChart.userProps.map(this.renderPropEditor.bind(this))}
        </tbody>
      </table>
    );
  }
  render() {
    return (
      <div>
        <div style={{boxSizing: "border-box", backgroundColor: "#313131", color: "#FFF", width: `${this.props.sideBarWidth}px`, height: "100%", overflowY: "auto", position: "fixed", left: 0, top: 0}}>
          <div>
            <div>
              <h4>Export (popup may be blocked)</h4>
              <button onClick={this.exportToSvg.bind(this)}>Export To SVG</button>
              <button onClick={this.exportToRasterImage.bind(this, "png")}>Export To PNG</button>
              <button onClick={this.exportToRasterImage.bind(this, "jpeg")}>Export To JPEG</button>
            </div>
            {this.renderPropEditors()}
            <textarea value={JSON.stringify(this.state.componentProps)} onChange={this.onComponentPropsJSONChange.bind(this)} />
          </div>
        </div>
        <div style={{paddingLeft: `${this.props.sideBarWidth}px`}}>
          <div style={{padding: "1em"}}>
            {arePropsValid(this.state.componentProps, BarChart.userProps) ? React.createElement(BarChart, Object.assign(this.state.componentProps, {ref: this.barChartRefCallback.bind(this)})) : <span>Invalid props.</span>}
          </div>
        </div>
      </div>
    );
  }
}