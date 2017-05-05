import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {colorToString} from './Utils.js';
import {CustomPropTypes, validateProps} from './ComponentEditor.js';

export const BarChart = props => {
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
  } = props;

  if(!validateProps(BarChart.userProps, props)) {
      return null;
  }

  const titleRectWidth = width;
  const titleRectHeight = 30;
  const titleRectX = 0;
  const titleRectY = 0;

  const xAxisRectWidth = width;
  const xAxisRectHeight = 40;
  const yAxisRectWidth = 50;
  const yAxisRectHeight = height - titleRectHeight - xAxisRectHeight;

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
        <text fill={colorToString(textColor)} textAnchor="middle" alignmentBaseline="central" x={titleRectWidth / 2} y={titleRectHeight / 2}>{title}</text>
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
          alignmentBaseline="hanging">
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
            alignmentBaseline="central">
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
      <text fill={colorToString(textColor)} textAnchor="middle" alignmentBaseline="hanging" transform={`translate(${yAxisLabelMarginLeft},${yAxisRectHeight / 2}) rotate(-90)`}>{yAxisLabel}</text>
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
              <text fill={colorToString(barValueTextColor)} x={barWidth / 2} y={barValueLabelMarginTop} textAnchor="middle" alignmentBaseline="hanging">{value}</text>
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <svg width={width} height={height}>
      {renderBackground()}
      {renderTitle()}
      {renderXAxis()}
      {renderYAxis()}
      {renderBarsArea()}
    </svg>
  );
};

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