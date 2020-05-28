import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Overlay from './components/Overlay';
import './index.css';
import createGrid from './utils/createGrid';

const data = {
  cols: 180,
  rows: 70,
  speed: 10,
  cellSize: 8,
  randomLive: 10,
  generation: 0,
  grid: [],
  Overlay
}

data.grid = createGrid(data.rows, data.cols, data.randomLive);

ReactDOM.render(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
);
