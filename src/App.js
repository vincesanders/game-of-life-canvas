import React from 'react';
import CanvasBoard from './components/CanvasBoard';
import Controls from './components/Controls';

class App extends React.Component {
  constructor(props) {
    super(props)
    
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
    }
    
    //method bindings
    this.handleToggleOnOff = this.handleToggleOnOff.bind(this)
    this.handleClearBoard = this.handleClearBoard.bind(this)
    this.handleNewBoard = this.handleNewBoard.bind(this)
    this.handleSerialize = this.handleSerialize.bind(this)
    this.handleDeserialize = this.handleDeserialize.bind(this)
    this.handleToggleSize = this.handleToggleSize.bind(this)
    this.handleCellClickEvent = this.handleCellClickEvent.bind(this)
    this.generateTurn = this.generateTurn.bind(this)
    this.runGenerations = this.runGenerations.bind(this)
  }
  
  runGenerations() {
     // if gridIsOn set up interval loop
    if (this.state.gridIsOn){
      window.gridInterval = window.setInterval(runTurn, this.props.data.speed)
    }
    // binding value of this to variable
    const that = this
    
    function runTurn () {
      // checks to see if grid has been to set to off and shuts down if so

      if (!that.state.gridIsOn) {window.clearInterval(window.gridInterval); return }
      
      // increments generation value
      const nextGen = that.state.generation + 1
      that.setState({
        generation: nextGen
        }, function() {
          // calls for next generation of the grid
          this.generateTurn()
      })
    }
  }
  
  handleToggleOnOff(){
    if (!this.state.gridIsOn && this.state.grid.some(cell => cell != 0)) { 
      this.setState(
        { gridIsOn: true }, function(){
          this.runGenerations()
      }) 
    } else { 
      this.setState(
        { gridIsOn: false }, function(){
          window.clearInterval(window.gridInterval)
      }) 
    }
  }

  handleCellClickEvent(index){
    var currentGrid = this.state.grid.slice()
    if (currentGrid[index] == 0) {
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
      var clearBoard = this.state.grid.map(cell => cell = 0)
      this.setState({
        grid: clearBoard,
        generation: 0,
        gridIsOn: false,
        changeBuffer: []
      })
  }
  
  handleNewBoard() {
    var randomBoard = this.state.grid.map(cell => Math.floor(Math.random() * this.state.randomLive) == 0 ? 1 : 0) 

    this.setState({
      grid: randomBoard,
      generation: 0,
      gridIsOn: false,
      changeBuffer: []
    })
  }
  
  handleSerialize() {
    var base64 = this.props.data.base64
    var gridStr = this.state.grid.join('')
    var gridChunks = gridStr.match(/[01]{1,6}/g) || []
    
    // gameboard divides perfectly by 6 so no need to adjust overflow. if board size changed, this will need to be handled
    
    // serialization into base64
    var mapped = gridChunks.map(c => {
      var total = 0;
      for (var i = 0; i < 6; i++) {
        if (c[i] == '1') {
          total += Math.pow(2, i)
        }
      }
      return base64[total]
    })

    // compression of empty cells
    var serialized = ''
    var current = ''
    var accumulator = 0
    mapped.forEach((d, i, arr ) => {
      if (i == arr.length - 1 && d == current) {
        accumulator++
      }
      if (d != current || i == arr.length - 1) {
        if (accumulator > 0 && accumulator <=3 ) {
          serialized += current.repeat(accumulator)
        } else if (accumulator > 3) {
          serialized += current + '{' + accumulator + '}'
        }
        current = d
        accumulator = 1
      } else {
        accumulator ++
      }
    })
    // output to localStorage
    window.localStorage.setItem("rs-gol", serialized)
    console.log('serialized', serialized)
  }
  
  handleDeserialize (useDefault) {
    var base64 = this.props.data.base64
    var file
    if (!useDefault) { file = window.localStorage.getItem("rs-gol") }
    else { file  =  this.props.data.testFile }
    var expanded = ''
    var last = ''
    file.split(/[\{\}]/)
        .map(d => /^\d+$/.test(d) ? parseInt(d) : d)
        .forEach((d, i)=> {
            if (typeof d == 'string') {
              last = d.charAt(d.length - 1)
              expanded += d
            } else if (typeof d == 'number') {
              expanded += last.repeat(d - 1)
            }
        })
    // de base64
    var gridFile = expanded.split('')
                          .map(d => {
                            var val = base64.indexOf(d)
                            var bin = []
                            var pows = [32, 16, 8, 4, 2, 1]
                            pows.forEach(pow => {
                              if (val >= pow) {
                                bin.push(1)
                                val -= pow
                              } else {
                                bin.push(0)
                              }
                            })

                            return bin.reverse()
                          })
                          .reduce((a, b) => a.concat(b))
    var cols, rows, largeGrid, cellSize
    
    if (gridFile.length == 12600) {
      cellSize = this.props.data.cellSize
      cols = this.props.data.cols
      rows = this.props.data.rows
      largeGrid = false
    } else {
      cellSize = this.props.data.cellSize / 2
      cols = this.props.data.cols * 2
      rows = this.props.data.rows * 2
      largeGrid = true      
    }
    var _this = this
    this.setState({
      cellSize,
      largeGrid,
      cols,
      rows,
    }, function() {
      _this.setState({
      grid: gridFile,
      generation: 0,
      gridIsOn: false,
      changeBuffer: [],        
      })
    })
  }
  
  handleToggleSize() {
    var nextSize = !this.state.largeGrid
    var cellSize, cols, rows, grid
    if (nextSize == true) {
      cellSize = this.props.data.cellSize / 2
      cols = this.props.data.cols * 2
      rows = this.props.data.rows * 2
    } else {
      cellSize = this.props.data.cellSize
      cols = this.props.data.cols
      rows = this.props.data.rows
    }
    grid = new Array(cols * rows).fill(0)
    this.setState({
      largeGrid: nextSize,
      cellSize,
      cols,
      rows,
      grid
    },  function(){this.handleNewBoard()})
  }
  
  generateTurn() {
    var that = this
    var len = that.state.grid.length  
        
    function getNeighbors(index) {
    // inner function to get array of neighbor cells
      var width = that.state.cols
      var line = Math.floor(index / width) * width
      
      var modHoriz = function (mod) {
        // function returns horizontal wraparound  
        var pos = index + mod
        return pos < 0 ? pos + width : pos % width
      }
      
      var modVert = function (input) {
       // function returns vertical wraparound
        return input < 0 ? input + len : input >= len ? input - len : input
      }
      
      //array generates address of the neighbors of the cell
      var neighbors = [modVert(line + modHoriz(-1)), 
                      modVert(line + modHoriz(1)) ,
                      modVert(line - width + modHoriz(0)),
                      modVert(line + width + modHoriz(0)) ,
                      modVert(line - width + modHoriz(-1)),
                      modVert(line + width + modHoriz(-1)), 
                      modVert(line - width + modHoriz(1)), 
                      modVert(line + width + modHoriz(1))]

      return neighbors
    }

    var nextChangeBuffer = []
    var nextTurn = this.state.grid.slice()
    var staticCellCount = 0

    if (!this.state.changeBuffer.length) {
      // if first generation, the changeBuffer is empty -  so use the unoptimzed algorithm
      this.state.grid.forEach((cell, i) => {
        var liveNeighbors = getNeighbors(i).reduce((acc, n) => acc + this.state.grid[n], 0)
        if ((cell && liveNeighbors == 3) || (cell + liveNeighbors == 3)) {
          nextTurn[i] = 1
        } else {
          nextTurn[i] = 0
        }
        
        if (cell == nextTurn[i]) { 
          staticCellCount++ 
        } else {
          nextChangeBuffer.push(i)
        }
      })
    } else {
      // if changeBuffer not empty ( eg not first generation )
      this.state.changeBuffer.forEach(gridIndex => {
        // first get the neighbors and make a new array that includes the index
        var checkList = [gridIndex].concat(getNeighbors(gridIndex))
        // go through checkList
        checkList.forEach(cellIndex => {
          // check to see that this index hasn't already been checked
          if(nextChangeBuffer.indexOf(cellIndex) == -1) {
            // get cell value from grid at index
            var cell = this.state.grid[cellIndex]
            // sum the neighbors for the cell index
            var liveNeighbors = getNeighbors(cellIndex).reduce((acc, n) => acc + this.state.grid[n], 0)
            // determine living or dead status
            if (cell + liveNeighbors == 3) {
              nextTurn[cellIndex] = 1
            } else if (cell + liveNeighbors != 4) {
              nextTurn[cellIndex] = 0
            }
                    
            if (cell == nextTurn[cellIndex]) { 
              staticCellCount++ 
            } else {
              nextChangeBuffer.push(cellIndex)
            }
          }
        })
      })
    }
    
    // stop the generations if the map is all static cells
    if (staticCellCount == len) {
      this.setState({
        gridIsOn: false
      }, function() {
        window.clearInterval(window.gridInterval)
      })
    }

    // optimization using changeBuffer. we only check cells that changed last turn 
    // and the neighbors
    this.setState({
      grid: nextTurn,
      changeBuffer: nextChangeBuffer
    })
  }

  render() {
    return (
      <div>
        <Controls 
          onClearBoard={this.handleClearBoard}
          onNewBoard={this.handleNewBoard}
          gridIsOn={this.state.gridIsOn}
          largeGrid={this.state.largeGrid}
          onSerialize={this.handleSerialize}
          onDeserialize={this.handleDeserialize}
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
      </div>
    )
  }
}

export default App;
