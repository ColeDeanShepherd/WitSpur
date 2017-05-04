import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';

import * as Utils from './Utils.js';
import {BarChart} from './BarChart.js';
import {ComponentEditor} from './ComponentEditor.js';

// TODO: make values CSV field

class App extends Component {
  render() {
    return (
      <div className="App">
        <ComponentEditor component={BarChart} />
      </div>
    );
  }
}

export default App;
