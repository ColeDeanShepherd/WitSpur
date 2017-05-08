import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
  colorToString,
  camelCaseToWords,
  capitalizeWord,
  openNewTab,
  exportSvgToFile,
  exportSvgToRasterImage
} from './Utils.js';
import {
  VisualPropTypes,
  areVisualPropsValid,
  getDefaultVisualProps,
  isVisualPropValid,
  renderVisualPropInput,
  defaultMapVisualPropsToProps
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
      textStyle,
      barFillColor,
      barValueTextStyle,
      barWidth,
      barMargin
    } = this.props;

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

    const textFontFamily = "sans-serif";

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
          <text fontFamily={textFontFamily} fontSize={textStyle.size} fontWeight={!textStyle.isBold ? "normal" : "bold"} fontStyle={!textStyle.isItalic ? "normal" : "italic"} fill={colorToString(textStyle.color)} textAnchor="middle" dominantBaseline="central" x={titleRectWidth / 2} y={titleRectHeight / 2}>{title}</text>
        </g>
      );
    }
    function renderXAxis() {
      // <line x1={0} y1={0} x2={xAxisRectWidth} y2={0} strokeWidth="1" stroke={colorToString(lineColor)} />
      return (
      <g transform={`translate(${xAxisRectX},${xAxisRectY})`}>
        <text fontFamily={textFontFamily} fontSize={textStyle.size} fontWeight={!textStyle.isBold ? "normal" : "bold"} fontStyle={!textStyle.isItalic ? "normal" : "italic"} fill={colorToString(textStyle.color)} textAnchor="middle" x={xAxisRectWidth / 2} y={xAxisRectHeight - xAxisLabelMarginBottom}>{xAxisLabel}</text>
        {valueLabels.map((label, index) => (
          <text
            fontFamily={textFontFamily}
            fontSize={textStyle.size}
            fontWeight={!textStyle.isBold ? "normal" : "bold"}
            fontStyle={!textStyle.isItalic ? "normal" : "italic"}
            fill={colorToString(textStyle.color)}
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
              fontSize={textStyle.size}
              fontWeight={!textStyle.isBold ? "normal" : "bold"}
              fontStyle={!textStyle.isItalic ? "normal" : "italic"}
              fill={colorToString(textStyle.color)}
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
        <text fontFamily={textFontFamily} fontSize={textStyle.size} fontWeight={!textStyle.isBold ? "normal" : "bold"} fontStyle={!textStyle.isItalic ? "normal" : "italic"} fill={colorToString(textStyle.color)} textAnchor="middle" dominantBaseline="hanging" transform={`translate(${yAxisLabelMarginLeft},${yAxisRectHeight / 2}) rotate(-90)`}>{yAxisLabel}</text>
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
                <text
                  fontFamily={textFontFamily}
                  fontSize={barValueTextStyle.size}
                  fontWeight={!barValueTextStyle.isBold ? "normal" : "bold"}
                  fontStyle={!barValueTextStyle.isItalic ? "normal" : "italic"}
                  fill={colorToString(barValueTextStyle.color)}
                  x={barWidth / 2}
                  y={barValueLabelMarginTop}
                  textAnchor="middle"
                  dominantBaseline="hanging">
                  {value}
                </text>
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
BarChart.visualPropDefs = [
  {
    name: "values",
    type: VisualPropTypes.Array(VisualPropTypes.Number),
    defaultValue: [1, 2, 3, 4, 5],
    validate: (values, props) => (values.length > 0) && (values.length === props.valueLabels.length)
  },
  {
    name: "valueLabels",
    type: VisualPropTypes.Array(VisualPropTypes.String),
    defaultValue: ["a", "b", "c", "d", "e"],
    validate: (valueLabels, props) => (valueLabels.length > 0) && (valueLabels.length === props.values.length)
  },
  {
    name: "title",
    type: VisualPropTypes.String,
    defaultValue: "Bar Chart",
    validate: null
  },
  {
    name: "xAxisLabel",
    type: VisualPropTypes.String,
    defaultValue: "X Axis",
    validate: null
  },
  {
    name: "Y Axis",
    type: VisualPropTypes.Group,
    children: [
      {
        name: "yAxisLabel",
        type: VisualPropTypes.String,
        defaultValue: "Y Axis",
        validate: null
      },
      {
        name: "yAxisValueLabelInterval",
        type: VisualPropTypes.Number,
        defaultValue: 1,
        validate: yAxisValueLabelInterval => yAxisValueLabelInterval > 0
      },
      {
        name: "yAxisMin",
        type: VisualPropTypes.Number,
        defaultValue: 0,
        validate: (yAxisMin, props) => yAxisMin <= props.yAxisMax
      },
      {
        name: "yAxisMax",
        type: VisualPropTypes.Number,
        defaultValue: 10,
        validate: (yAxisMax, props) => yAxisMax >= props.yAxisMin
      }
    ]
  },
  {
    name: "width",
    type: VisualPropTypes.Number,
    defaultValue: 640,
    validate: width => width > 0
  },
  {
    name: "height",
    type: VisualPropTypes.Number,
    defaultValue: 480,
    validate: height => height > 0
  },
  {
    name: "backgroundColor",
    type: VisualPropTypes.Color,
    defaultValue: "#FFF",
    validate: null
  },
  {
    name: "lineColor",
    type: VisualPropTypes.Color,
    defaultValue: "#000",
    validate: null
  },
  {
    name: "textStyle",
    type: VisualPropTypes.TextStyle,
    validate: null
  },
  {
    name: "Bars",
    type: VisualPropTypes.Group,
    children: [
      {
        name: "barFillColor",
        type: VisualPropTypes.Color,
        defaultValue: "steelblue",
        validate: null
      },
      {
        name: "barValueTextStyle",
        type: VisualPropTypes.TextStyle,
        validate: null
      },
      {
        name: "barWidth",
        type: VisualPropTypes.Number,
        defaultValue: 40,
        validate: barWidth => barWidth > 0
      },
      {
        name: "barMargin",
        type: VisualPropTypes.Number,
        defaultValue: 10,
        validate: barMargin => barMargin >= 0
      }
    ]
  },
];
BarChart.mapVisualPropsToProps = function (visualPropDefs, visualProps) {
  return defaultMapVisualPropsToProps(visualPropDefs, visualProps);
};

export class BarChartEditor extends React.Component {
  constructor(props) {
    super(props);
    
    this.barChartSvgNode = null;
    this.canvasNode = null;

    this.state = {
      visualProps: getDefaultVisualProps(BarChart.visualPropDefs),
      isGroupExpandedArray: []
    };
  }

  isGroupExpanded(visualPropDef) {
    const isGroupExpandedObject = this.state.isGroupExpandedArray.find(obj => obj.visualPropDef === visualPropDef);

    return isGroupExpandedObject && isGroupExpandedObject.isExpanded;
  }
  toggleGroupExpanded(visualPropDef) {
    const isGroupExpandedObjectIndex = this.state.isGroupExpandedArray.findIndex(obj => obj.visualPropDef === visualPropDef);

    if(isGroupExpandedObjectIndex < 0) {
      // Add an object for the group.
      let isGroupExpandedObject = {visualPropDef: visualPropDef, isExpanded: true};
      this.setState({isGroupExpandedArray: [...this.state.isGroupExpandedArray, isGroupExpandedObject]});
    } else {
      // Toggle the existing group's isExpanded.
      let isGroupExpandedObject = this.state.isGroupExpandedArray[isGroupExpandedObjectIndex];

      this.setState({
        isGroupExpandedArray: [
          ...this.state.isGroupExpandedArray.slice(0, isGroupExpandedObjectIndex),
          {visualPropDef: visualPropDef, isExpanded: !isGroupExpandedObject.isExpanded},
          ...this.state.isGroupExpandedArray.slice(isGroupExpandedObjectIndex + 1)
        ]
      });
    }
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
    exportSvgToRasterImage(this.barChartSvgNode.outerHTML, this.state.visualProps.width, this.state.visualProps.height, imageFormat);
  }
  
  onVisualPropChange(propName, newValue) {
    var visualPropsDelta = {};
    visualPropsDelta[propName] = newValue;

    this.setState({visualProps: Object.assign(this.state.visualProps, visualPropsDelta)});
  }

  // TODO: do more validation
  onVisualPropsJSONChange(event) {
    try {
      const newVisualProps = JSON.parse(event.target.value);

      this.setState({visualProps: newVisualProps});
    } catch(e) {}
  }
  renderPropEditor(visualPropDef) {
    if(visualPropDef.type !== VisualPropTypes.Group) {
      const isThisPropValid = isVisualPropValid(this.state.visualProps, visualPropDef);

      return (
        <tr style={{border: isThisPropValid ? "" : "1px solid red"}}>
          <td style={{textAlign: "right", verticalAlign: "top", paddingRight: "1em"}}>{camelCaseToWords(visualPropDef.name).map(capitalizeWord).join(" ")}</td>
          <td>{renderVisualPropInput(visualPropDef.type, this.state.visualProps[visualPropDef.name], newValue => this.onVisualPropChange(visualPropDef.name, newValue))}</td>
        </tr>
      );
    } else {
      return [
        (<tr>
          <td colSpan="2" style={{textAlign: "left"}}>
            <span>{visualPropDef.name}</span>
            <button onClick={this.toggleGroupExpanded.bind(this, visualPropDef)}>{!this.isGroupExpanded(visualPropDef) ? "+" : "-"}</button>
          </td>
        </tr>),
        this.isGroupExpanded(visualPropDef) ? visualPropDef.children.map(childPropDef => this.renderPropEditor(childPropDef)) : null
      ];
    }
  }
  renderPropEditors(visualPropDefs) {
    return (
      <table style={{borderCollapse: "collapse"}}>
        <tbody>
          {visualPropDefs.map(this.renderPropEditor.bind(this))}
        </tbody>
      </table>
    );
  }
  render() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        <div className="editor-sidebar card" style={{width: `${this.props.sideBarWidth}px`}}>
          <div className="editor-sidebar-content">
            <h4>Export (popup may be blocked)</h4>
            <div style={{marginBottom: "2em"}}>
              <button onClick={this.exportToSvg.bind(this)} style={{marginRight: "1em"}}>Export To SVG</button>
              <button onClick={this.exportToRasterImage.bind(this, "png")} style={{marginRight: "1em"}}>Export To PNG</button>
              <button onClick={this.exportToRasterImage.bind(this, "jpeg")}>Export To JPEG</button>
            </div>
            {this.renderPropEditors(BarChart.visualPropDefs)}
            <textarea value={JSON.stringify(this.state.visualProps, null, "  ")} onChange={this.onVisualPropsJSONChange.bind(this)} style={{width: "100%", height: "300px"}} />
          </div>
        </div>
        <div style={{flexGrow: 1}}>
          <div style={{padding: "1em", textAlign: "center"}}>
            <div className="card" style={{display: "inline-block"}}>
              {areVisualPropsValid(this.state.visualProps, BarChart.visualPropDefs) ? React.createElement(BarChart, Object.assign(BarChart.mapVisualPropsToProps(BarChart.visualPropDefs, this.state.visualProps), {ref: this.barChartRefCallback.bind(this)})) : <span>Invalid props.</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}