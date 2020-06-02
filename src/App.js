import React from 'react';
import CanvasBoard from './components/CanvasBoard';
import Controls from './components/Controls';
import Rules from './components/Rules';
import createGrid from './utils/createGrid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomLive: this.props.data.randomLive,
      restart: false,
      grid: this.props.data.grid,
      changeBuffer: [],
      generation: 0,
      gridIsOn: false,
      largeGrid: false,
      cellSize: this.props.data.cellSize,
      cols: this.props.data.cols,
      rows: this.props.data.rows
    };
    
    //method bindings
    this.handleToggleOnOff = this.handleToggleOnOff.bind(this);
    this.handleClearBoard = this.handleClearBoard.bind(this);
    this.handleNewBoard = this.handleNewBoard.bind(this);
    this.handleEncodeSeed = this.handleEncodeSeed.bind(this);
    this.decodeSeed = this.decodeSeed.bind(this);
    this.handleToggleSize = this.handleToggleSize.bind(this);
    this.handleCellClickEvent = this.handleCellClickEvent.bind(this);
    this.generateTurn = this.generateTurn.bind(this);
    this.runGenerations = this.runGenerations.bind(this);
  }
  
  runGenerations() {
     // if gridIsOn set up interval loop
    if (this.state.gridIsOn){
      window.gridInterval = window.setInterval(runTurn, this.props.data.speed);
    }
    // binding value of this to variable so it can still be used in runTurn
    const that = this;
    function runTurn () {
      // checks to see if grid has been to set to off and shuts down if so
      if (!that.state.gridIsOn) {window.clearInterval(window.gridInterval); return; }
      // increments generation value
      const nextGen = that.state.generation + 1;
      that.setState({
        generation: nextGen
        }, function() {
          // calls for next generation of the grid
          this.generateTurn();
      });
    }
  }
  
  handleToggleOnOff(){
    if (!this.state.gridIsOn && this.state.grid.some(cell => cell !== 0)) { 
      this.setState(
        { gridIsOn: true }, () => {
          this.runGenerations();
      });
    } else { 
      this.setState(
        { gridIsOn: false }, () => {
          window.clearInterval(window.gridInterval);
      });
    }
  }

  handleCellClickEvent(index){
    const currentGrid = [...this.state.grid]
    if (currentGrid[index] === 0) {
      currentGrid[index] = 1
    } else {
      currentGrid[index] = 0
    }
    
    this.setState({
      grid: currentGrid,
      changeBuffer: []
    })
  }
  
  handleClearBoard () {
      const clearBoard = this.state.grid.map(cell => 0);
      this.setState({
        grid: clearBoard,
        generation: 0,
        gridIsOn: false,
        changeBuffer: []
      });
  }
  
  handleNewBoard() {
    let randomBoard;
    if (this.state.largeGrid) { //to avoid dropped frames, large grids start with less living cells
      randomBoard = createGrid(this.state.rows, this.state.cols, this.state.randomLive, 1);
    } else {
      randomBoard = createGrid(this.state.rows, this.state.cols, this.state.randomLive);
    }
    this.setState({
      grid: randomBoard,
      generation: 0,
      gridIsOn: false,
      changeBuffer: []
    });
  }
  
  handleEncodeSeed() {
    let encoded = '';
    // output to localStorage
    window.localStorage.setItem("user-seed", encoded);
    console.log('encoded', encoded);
  }

  //convert rle string to grid
  decodeSeed(seedFile) {
    const rleSeed = seedFile;
    //create an empty grid
    const newGrid = this.state.grid.map(cell => 0);
    let firstIndex = 0; //points to insertion point of the grid
    let rleStrIndex = 0; //point to read position of seed string
    let repeats = '';
    // //bob$2bo$3o!
    for (let k = 0; k < rleSeed.size.y; k++) {
      //jump to next row
      firstIndex = k * this.state.cols + this.state.cols / 2 - Math.floor(rleSeed.size.x / 2);
      //while loop is broken by $ in seed string
      while (true) { //row by row
        if (rleSeed.seed[rleStrIndex] === 'b') {
          newGrid[firstIndex] = 0;
          firstIndex++;
        } else if (rleSeed.seed[rleStrIndex] === 'o') {
          newGrid[firstIndex] = 1;
          firstIndex++;
        } else if (!isNaN(rleSeed.seed[rleStrIndex])) { //if it's a number
          let next = rleSeed.seed[rleStrIndex]; //2
          repeats = '';
          let currentIndex = 0
          while (!isNaN(next)) {
            repeats += next; //repeats is a string at this point
            currentIndex++
            next = rleSeed.seed[rleStrIndex + currentIndex];
          }
          //make repeats a number
          repeats = parseInt(repeats); //2
          if (rleSeed.seed[rleStrIndex + currentIndex] === 'b') {
            for (let j = 0; j < repeats; j++) {
              newGrid[firstIndex] = 0;
              firstIndex++
            }
            repeats = '';
            rleStrIndex++;
          } else if (rleSeed.seed[rleStrIndex + currentIndex] === 'o') {
            for (let j = 0; j < repeats; j++) {
              newGrid[firstIndex] = 1;
              firstIndex++
            }
            repeats = '';
            rleStrIndex++;
          } else if (rleSeed.seed[rleStrIndex + currentIndex] === '$') {
            for (let j = 0; j < repeats - 1; j++) { //after a break 1 line will automatically be added
              //jump to new line for every repeat
              k++;
            }
          }
          rleStrIndex += currentIndex - 1;
        } else if (rleSeed.seed[rleStrIndex] === '$') { //end of a line
          rleStrIndex++;
          break;
        } else if (rleSeed.seed[rleStrIndex] === '!') { //end of file
          break; //skip increment of rleStrIndex
        }
        rleStrIndex++;
      }
      if (rleSeed.seed[rleStrIndex] === '!') {
        break;
      }
    }
    const that = this;
    this.setState({ //future funtionality - adjust size of canvas based on seed
      // cellSize,
      // largeGrid,
      // cols,
      // rows,
    }, () => {
      that.setState({
      grid: newGrid,
      generation: 0,
      gridIsOn: false,
      changeBuffer: [],        
      })
    });
  }
  
  handleToggleSize() {
    const nextSize = !this.state.largeGrid;
    let cellSize, cols, rows, grid;
    if (nextSize === true) {
      cellSize = this.props.data.cellSize / 2;
      cols = this.props.data.cols * 2;
      rows = this.props.data.rows * 2;
    } else {
      cellSize = this.props.data.cellSize;
      cols = this.props.data.cols;
      rows = this.props.data.rows;
    }
    grid = new Array(cols * rows).fill(0);
    this.setState({
      largeGrid: nextSize,
      cellSize,
      cols,
      rows,
      grid
    }, () => {this.handleNewBoard()});
  }
  
  generateTurn() {
    const that = this;
    const len = that.state.grid.length;
        
    function getNeighbors(index) {
    // inner function to get array of neighbor cells
      const width = that.state.cols;
      const line = Math.floor(index / width) * width;
      
      const modHoriz = mod => {
        // function returns horizontal wraparound  
        const pos = index + mod;
        return pos < 0 ? pos + width : pos % width;
      }
      
      const modVert = input => {
       // function returns vertical wraparound
        return input < 0 ? input + len : input >= len ? input - len : input;
      }
      
      //array generates address of the neighbors of the cell
      const neighbors = [
        modVert(line + modHoriz(-1)), 
        modVert(line + modHoriz(1)) ,
        modVert(line - width + modHoriz(0)),
        modVert(line + width + modHoriz(0)) ,
        modVert(line - width + modHoriz(-1)),
        modVert(line + width + modHoriz(-1)), 
        modVert(line - width + modHoriz(1)), 
        modVert(line + width + modHoriz(1))
      ];
      return neighbors;
    }

    const nextChangeBuffer = []
    const nextTurn = this.state.grid.slice()
    let staticCellCount = 0

    if (!this.state.changeBuffer.length) {
      // if first generation, the changeBuffer is empty -  so use the unoptimzed algorithm
      this.state.grid.forEach((cell, i) => {
        const liveNeighbors = getNeighbors(i).reduce((sum, n) => sum + this.state.grid[n], 0);
        if ((cell && liveNeighbors === 3) || (cell + liveNeighbors === 3)) {
          nextTurn[i] = 1;
        } else {
          nextTurn[i] = 0;
        }
        
        if (cell === nextTurn[i]) { 
          staticCellCount++;
        } else {
          nextChangeBuffer.push(i);
        }
      })
    } else {
      // if changeBuffer not empty ( eg not first generation )
      this.state.changeBuffer.forEach(gridIndex => {
        // first get the neighbors and make a new array that includes the index
        const checkList = [gridIndex].concat(getNeighbors(gridIndex));
        // go through checkList
        checkList.forEach(cellIndex => {
          // check to see that this index hasn't already been checked
          if(nextChangeBuffer.indexOf(cellIndex) === -1) {
            // get cell value from grid at index
            const cell = this.state.grid[cellIndex];
            // sum the neighbors for the cell index
            const liveNeighbors = getNeighbors(cellIndex).reduce((sum, n) => sum + this.state.grid[n], 0);
            // determine living or dead status
            if (cell + liveNeighbors === 3) {
              nextTurn[cellIndex] = 1;
            } else if (cell + liveNeighbors !== 4) {
              nextTurn[cellIndex] = 0;
            }

            if (cell === nextTurn[cellIndex]) { 
              staticCellCount++;
            } else {
              nextChangeBuffer.push(cellIndex);
            }
          }
        });
      });
    }
    
    // stop the generations if the map is all static cells
    if (staticCellCount === len) {
      this.setState({
        gridIsOn: false
      }, () => {
        window.clearInterval(window.gridInterval);
      });
    }

    // optimization using changeBuffer. we only check cells that changed last turn 
    // and the neighbors
    this.setState({
      grid: nextTurn,
      changeBuffer: nextChangeBuffer
    });
  }

  render() {
    return (
      <div id='app-container'>
        <h1>The Game of Life</h1>
        <Controls 
          onClearBoard={this.handleClearBoard}
          onNewBoard={this.handleNewBoard}
          gridIsOn={this.state.gridIsOn}
          largeGrid={this.state.largeGrid}
          onEncodeSeed={this.handleEncodeSeed}
          onDecodeSeed={this.decodeSeed}
          onToggleOnOff={this.handleToggleOnOff} 
          onToggleSize={this.handleToggleSize}
          generation={this.state.generation}/>
        <CanvasBoard 
          largeGrid={this.state.largeGrid}
          changeBuffer = {this.state.changeBuffer}
          grid={this.state.grid}
          gridIsOn={this.state.gridIsOn}
          cols={this.state.cols} 
          rows={this.state.rows} 
          cellSize={this.state.cellSize}
          onCellClickEvent={this.handleCellClickEvent} />
          <Rules />
      </div>
    );
  }
}

export default App;
