import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Overlay from './components/Overlay';
import './index.css';

const data = {
  cols: 180,
  rows: 70,
  speed: 10,
  cellSize: 8,
  randomLive: 10,
  generation: 0,
  game: [],Overlay,
  base64 : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+#'
}
// prime the game array
const game = new Array(data.rows * data.cols).fill(0).map(cell => {
  if (Math.floor(Math.random() * data.randomLive) == 0) {
    cell = 1
  }
  return cell
})

data.game = game

ReactDOM.render(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
);
