import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

/*
User-defined component
======================
* Prop info
  * name (string)
  * type
  * default value
* react component code
*/

const CustomPropTypes = {
  Number: "Number",
  String: "String",
  Array: elementType => ({ name: "Array", elementType: elementType })
};

/**
 * Combines two arrays into an array of pairs.
 * If one array is longer than the other, undefined is paired with the other array's values.
 * @param {Array} a 
 * @param {Array} b 
 * @return {Array} result
 */
function zip(a, b) {
  let result = new Array(Math.max(a.length, b.length));

  for(let i = 0; i < result.length; i++) {
    const elementA = (i < a.length) ? a[i] : undefined;
    const elementB = (i < b.length) ? b[i] : undefined;

    result[i] = [elementA, elementB];
  }

  return result;
}

function parseTSV(str) {
  const lines = str.split(/\r?\n/);
  const nonEmptyLines = lines.filter(line => line.length > 0);

  return nonEmptyLines.map(line => {
    return line.split("\t");
  });
}

function renderPropInput(prop) {
  if(prop.type === CustomPropTypes.String) {
    return <input type="text" />;
  } else if(prop.type === CustomPropTypes.Number) {
    return <input type="number" />;
  } else if(typeof prop.type === "object") {
    return null;
  } else {
    return null;
  }
}

function renderPropEditors(userProps) {
  return userProps.map(prop => (
    <div>
      {prop.name}
      {renderPropInput(prop)}
    </div>
  ));
}

const BarChart = ({values, valueLabels, title, xAxisLabel, yAxisLabel, yAxisValueLabelInterval, yAxisMin, yAxisMax, width, height}) => {
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

  const barWidth = 20;
  const barMargin = 10;
  const barFillColor = "rgb(0,0,255)";
  const barsMarginLeft = 5;

  const barValueLabelMarginTop = 5;

  const getBarXRelativeToBarsArea = index => barsMarginLeft + (index * (barWidth + barMargin));

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
      <text textAnchor="middle" x={xAxisRectWidth / 2} y={xAxisRectHeight - xAxisLabelMarginBottom}>{xAxisLabel}</text>
      <line x1={0} y1={0} x2={xAxisRectWidth} y2={0} strokeWidth="1" stroke="black" />
      {valueLabels.map((label, index) => (
        <text
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

        valueForLabel += yAxisValueLabelInterval;
      }
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
          const x = getBarXRelativeToBarsArea(index);
          const y = barsAreaHeight - barHeight;

          return (
            <g transform={`translate(${x},${y})`}>
              <rect width={barWidth} height={barHeight} style={{fill: barFillColor}} />
              <text x={barWidth / 2} y={barValueLabelMarginTop} textAnchor="middle" alignmentBaseline="hanging">{value}</text>
            </g>
          );
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
// TODO: .isRequired
BarChart.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  valueLabels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  yAxisValueLabelInterval: PropTypes.number,
  yAxisMin: PropTypes.number,
  yAxisMax: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};
BarChart.userProps = [
  {name: "values", type: CustomPropTypes.Array(PropTypes.Number)},
  {name: "valueLabels", type: CustomPropTypes.Array(PropTypes.String)},
  {name: "title", type: CustomPropTypes.String},
  {name: "xAxisLabel", type: CustomPropTypes.String},
  {name: "yAxisLabel", type: CustomPropTypes.String},
  {name: "yAxisValueLabelInterval", type: CustomPropTypes.Number},
  {name: "yAxisMin", type: CustomPropTypes.Number},
  {name: "yAxisMax", type: CustomPropTypes.Number},
  {name: "width", type: CustomPropTypes.Number},
  {name: "height", type: CustomPropTypes.Number}
];

class App extends Component {
  constructor() {
    super();

    const valuesText = "a\t1\nb\t2\nc\t3\nd\t4\ne\t5\n";
    const data = this.parseBarChartData(valuesText);

    this.state = {
      values: data.values,
      valueLabels: data.valueLabels,
      valuesText: valuesText,
      title: "Bar Chart",
      xAxisLabel: "X Axis",
      yAxisLabel: "Y Axis",
      yAxisValueLabelInterval: 1,
      yAxisMin: 0,
      yAxisMax: 5,
      width: 640,
      height: 480
    };
  }

  parseBarChartData(text) {
    const records = parseTSV(text);

    const valueLabels = records.map(record => record[0]);

    const valueStrings = records.map(record => record[1]);
    const values = valueStrings.map(function(valueString) {
      return parseFloat(valueString.trim());
    });

    return {
      valueLabels: valueLabels,
      values: values
    };
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
  onYAxisValueLabelIntervalChange(event) {
    this.setState({yAxisValueLabelInterval: parseFloat(event.target.value)});
  }
  onYAxisMinChange(event) {
    this.setState({yAxisMin: parseFloat(event.target.value)});
  }
  onYAxisMaxChange(event) {
    this.setState({yAxisMax: parseFloat(event.target.value)});
  }
  onValuesTextChange(event) {
    const data = this.parseBarChartData(event.target.value);

    this.setState({
      valuesText: event.target.value,
      values: data.values,
      valueLabels: data.valueLabels
    });
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
        <div style={{position: "relative"}}>
          <div style={{width: 300, height: "100%", backgroundColor: "gray", position: "absolute", left: 0, top: 0}}>
            title: <input type="text" value={this.state.title} onChange={this.onTitleChange.bind(this)} /><br />
            x-axis label: <input type="text" value={this.state.xAxisLabel} onChange={this.onXAxisLabelChange.bind(this)} /><br />
            y-axis label: <input type="text" value={this.state.yAxisLabel} onChange={this.onYAxisLabelChange.bind(this)} /><br />
            y-axis value label interval: <input type="text" value={this.state.yAxisValueLabelInterval} onChange={this.onYAxisValueLabelIntervalChange.bind(this)} /><br />
            y-axis min: <input type="text" value={this.state.yAxisMin} onChange={this.onYAxisMinChange.bind(this)} /><br />
            y-axis max: <input type="text" value={this.state.yAxisMax} onChange={this.onYAxisMaxChange.bind(this)} /><br />
            values: <textarea value={this.state.valuesText} onChange={this.onValuesTextChange.bind(this)} /><br />
            width: <input type="number" value={this.state.width} onChange={this.onWidthChange.bind(this)} /><br />
            height: <input type="number" value={this.state.height} onChange={this.onHeightChange.bind(this)} />
            <hr />
            {renderPropEditors(BarChart.userProps)}
          </div>
          <BarChart
            values={this.state.values}
            valueLabels={this.state.valueLabels}
            title={this.state.title}
            xAxisLabel={this.state.xAxisLabel}
            yAxisLabel={this.state.yAxisLabel}
            yAxisValueLabelInterval={this.state.yAxisValueLabelInterval}
            yAxisMin={this.state.yAxisMin}
            yAxisMax={this.state.yAxisMax}
            width={this.state.width}
            height={this.state.height}
          />
        </div>
      </div>
    );
  }
}

export default App;
