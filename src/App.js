import logo from './logo.svg';
import './App.css';
import Chart from './Chart'
import { Component } from 'react';

class App extends Component {

  render() {
    var margin = [80, 80, 80, 80]; 
    var width = 1000 - margin[1] - margin[3]; 
    var height = 400 - margin[0] - margin[2]; 

    return (
      <div className="App">
        <Chart margin={margin} width={width} height={height} ></Chart>
      </div>
    );
  }

}

export default App;
