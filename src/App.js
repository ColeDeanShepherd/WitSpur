import 'normalize.css';
import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';

import * as Utils from './Utils.js';
import {BarChartEditor} from './BarChart.js';

// TODO: make values CSV field

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="header">
          <div className="logo">
            witspur.com
          </div>
        </div>
        <BarChartEditor sideBarWidth={500} />
      </div>
    );
  }
}

export default App;
