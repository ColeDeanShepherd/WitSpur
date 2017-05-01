import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * Combines two arrays into an array of pairs.
 * If one array is longer than the other, undefined is paired with the other array's values.
 * @param {Array} a 
 * @param {Array} b 
 * @return {Array} result
 */
function zip(a, b) {
  var result = new Array(Math.max(a.length, b.length));

  for(var i = 0; i < result.length; i++) {
    const elementA = (i < a.length) ? a[i] : undefined;
    const elementB = (i < b.length) ? b[i] : undefined;

    result[i] = [elementA, elementB];
  }

  return result;
}

const BarChart = ({values, title, xAxisLabel, yAxisLabel, width, height}) => {
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

  const yAxisMin = 0;
  const yAxisMax = 5;
  const yAxisLabelLineWidth = 5;
  const yAxisLabelMarginRight = 10;
  const valueToHeight = value => barsAreaHeight * ((value - yAxisMin) / (yAxisMax - yAxisMin));

  const barWidth = 20;
  const barMargin = 10;
  const barsMarginLeft = 5;

  function renderTitle() {
    return (
      <g transform={`translate(${titleRectX},${titleRectY})`}>
        <text textAnchor="middle" alignmentBaseline="central" x={titleRectWidth / 2} y={titleRectHeight / 2}>{title}</text>
      </g>
    );
  }
  function renderXAxis() {
    return (
    <g transform={`translate(${xAxisRectX},${xAxisRectY})`}>
      <line x1={0} y1={0} x2={xAxisRectWidth} y2={0} strokeWidth="1" stroke="black" />
      <text textAnchor="middle" x={xAxisRectWidth / 2} y={xAxisRectHeight - xAxisLabelMarginBottom}>{xAxisLabel}</text>
    </g>
    );
  }
  function renderYAxis() {
    const labelInterval = 1;
    
    var valueForLabel = yAxisMin;
    var labels = [];
    var labelLines = [];

    while(valueForLabel <= yAxisMax) {
      const y = yAxisRectHeight - valueToHeight(valueForLabel);

      labels.push(
        <text
          x={yAxisRectX + yAxisRectWidth - yAxisLabelMarginRight}
          y={y}
          textAnchor="end"
          alignmentBaseline="central">
          {valueForLabel}
        </text>
      );

      labelLines.push(
        <line x1={yAxisRectWidth - yAxisLabelLineWidth} y1={y} x2={yAxisRectWidth} y2={y} strokeWidth="" stroke="black" />
      );

      valueForLabel += labelInterval;
    }
    
    return (
    <g transform={`translate(${0},${yAxisRectY})`}>
      <line x1={yAxisRectWidth} y1={yAxisRectX} x2={yAxisRectWidth} y2={yAxisRectHeight} strokeWidth="1" stroke="black" />
      {labelLines}
      {labels}
      <text textAnchor="middle" alignmentBaseline="hanging" transform={`translate(${yAxisLabelMarginLeft},${yAxisRectHeight / 2}) rotate(-90)`}>{yAxisLabel}</text>
    </g>
    );
  }
  function renderBarsArea() {
    return (
      <g transform={`translate(${barsAreaX}, ${barsAreaY})`}>
        {values.map((value, index) => {
          const barHeight = valueToHeight(value);
          const x = barsMarginLeft + (index * (barWidth + barMargin));
          const y = barsAreaHeight - barHeight;
          const barFillColor = "rgb(0,0,255)";

          return <rect width={barWidth} height={barHeight} style={{fill: barFillColor}} x={x} y={y} />;
        })}
      </g>
    );
  }

  return (
    <svg width={width} height={height}>
      {renderTitle()}
      {renderXAxis()}
      {renderYAxis()}
      {renderBarsArea()}
    </svg>
  );
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      values: [1, 2, 3, 4, 5],
      title: "Bar Chart",
      xAxisLabel: "X Axis",
      yAxisLabel: "Y Axis",
      width: 640,
      height: 480};
  }
  onTitleChange(event) {
    this.setState({title: event.target.value});
  }
  onXAxisLabelChange(event) {
    this.setState({xAxisLabel: event.target.value});
  }
  onYAxisLabelChange(event) {
    this.setState({yAxisLabel: event.target.value});
  }
  onWidthChange(event) {
    this.setState({width: event.target.value});
  }
  onHeightChange(event) {
    this.setState({height: event.target.value});
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        
        <div>
          title: <input type="text" value={this.state.title} onChange={this.onTitleChange.bind(this)} />
          x-axis label: <input type="text" value={this.state.xAxisLabel} onChange={this.onXAxisLabelChange.bind(this)} />
          y-axis label: <input type="text" value={this.state.yAxisLabel} onChange={this.onYAxisLabelChange.bind(this)} />
          width: <input type="number" value={this.state.width} onChange={this.onWidthChange.bind(this)} />
          height: <input type="number" value={this.state.height} onChange={this.onHeightChange.bind(this)} />
        </div>
        <BarChart
          values={this.state.values}
          title={this.state.title}
          xAxisLabel={this.state.xAxisLabel}
          yAxisLabel={this.state.yAxisLabel}
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default App;
