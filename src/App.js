import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';

import * as Utils from './Utils.js';
import {BarChartEditor} from './BarChart.js';

// TODO: make values CSV field

class App extends Component {
  render() {
    return (
      <div className="App">
        <BarChartEditor sideBarWidth={500} />
      </div>
    );
  }
}

export default App;
