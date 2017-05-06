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
      textColor,
      barFillColor,
      barValueTextColor,
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

    const barWidth = 40;
    const barsMarginLeft = 5;

    const barValueLabelMarginTop = 5;

    const getBarXRelativeToBarsArea = index => barsMarginLeft + (index * (barWidth + barMargin));

    function renderBackground() {
      return <rect width="100%" height="100%" fill={colorToString(backgroundColor)} />;
    }
    function renderTitle() {
      return (
        <g transform={`translate(${titleRectX},${titleRectY})`}>
          <text fill={colorToString(textColor)} textAnchor="middle" dominantBaseline="central" x={titleRectWidth / 2} y={titleRectHeight / 2}>{title}</text>
        </g>
      );
    }
    function renderXAxis() {
      return (
      <g transform={`translate(${xAxisRectX},${xAxisRectY})`}>
        <text fill={colorToString(textColor)} textAnchor="middle" x={xAxisRectWidth / 2} y={xAxisRectHeight - xAxisLabelMarginBottom}>{xAxisLabel}</text>
        <line x1={0} y1={0} x2={xAxisRectWidth} y2={0} strokeWidth="1" stroke={colorToString(lineColor)} />
        {valueLabels.map((label, index) => (
          <text
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
        <text fill={colorToString(textColor)} textAnchor="middle" dominantBaseline="hanging" transform={`translate(${yAxisLabelMarginLeft},${yAxisRectHeight / 2}) rotate(-90)`}>{yAxisLabel}</text>
      </g>
      );
    }
    function renderBarsArea() {
      return (
        <g transform={`translate(${barsAreaX}, ${barsAreaY})`}>
          {values.map((value, index) => {
            const barHeight = valueToHeight(value);
            const x = getBarXRelativeToBarsArea(index);
            const y = barsAreaHeight - barHeight;

            return (
              <g transform={`translate(${x},${y})`}>
                <rect width={barWidth} height={barHeight} style={{fill: colorToString(barFillColor)}} />
                <text fill={colorToString(barValueTextColor)} x={barWidth / 2} y={barValueLabelMarginTop} textAnchor="middle" dominantBaseline="hanging">{value}</text>
              </g>
            );
          })}
        </g>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
        {renderBackground()}
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
    name: "barMargin",
    type: CustomPropTypes.Number,
    defaultValue: 10,
    validate: barMargin => barMargin >= 0
  }
];

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
  getSvgDataUri() {
    const encodedSvgDocument = btoa(this.barChartSvgNode.outerHTML);
    return `data:image/svg+xml;base64,${encodedSvgDocument}`;
  }
  exportToSvg() {
    openNewTab(this.getSvgDataUri());
  }
  exportToRasterImage(imageFormat) {
    var context = this.canvasNode.getContext("2d");

    var image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      openNewTab(this.canvasNode.toDataURL(`image/${imageFormat}`));
    };
    image.src = this.getSvgDataUri();
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
        <div style={{boxSizing: "border-box", backgroundColor: "#313131", color: "#FFF", height: "100%", overflowY: "auto", position: "fixed", left: 0, top: 0}}>
          <div style={{padding: "1em"}}>
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
        <div style={{padding: "1em"}}>
          {arePropsValid(this.state.componentProps, BarChart.userProps) ? React.createElement(BarChart, Object.assign(this.state.componentProps, {ref: this.barChartRefCallback.bind(this)})) : <span>Invalid props.</span>}
          <br />
          <canvas width={this.state.componentProps.width} height={this.state.componentProps.height} ref={this.canvasRefCallback.bind(this)} style={{display: "none"}} />
        </div>
      </div>
    );
  }
}