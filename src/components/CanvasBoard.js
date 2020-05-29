import React from 'react';
import Overlay from './Overlay';
class CanvasBoard extends React.Component {
    constructor(props) {
        super(props)
        this.ctx = {}
        this.drawCells = this.drawCells.bind(this)
    }
    
    componentDidMount(){
        var canvas = document.getElementById('canvas-board');
        var ctx = canvas.getContext('2d');
        this.ctx = ctx;
        this.drawCells();
    }
    //only update when necessary - OPTIMIZED
    shouldComponentUpdate(nextProps, nextState) {
        //moved drawCells here to handle deprecation of componentWillUpdate.
        if (nextProps.gridIsOn !== this.props.gridIsOn) { 
            this.drawCells(nextProps);
            return true; 
        }
        if (nextProps.changeBuffer.length !== this.props.changeBuffer.length) { 
            this.drawCells(nextProps);
            return true; 
        }
        if (nextProps.changeBuffer && nextProps.changeBuffer.some((c, i) => c !== this.props.changeBuffer[i])) {
            this.drawCells(nextProps); 
            return true;
        }
        if (nextProps.grid.length && nextProps.grid.every(c => c === 0) ) {
            this.drawCells(nextProps);
            return true;
        }
        if(!nextProps.grid.length && !this.props.grid.length) { 
            return false;
        }
        if (nextProps.grid.length !== this.props.grid.length || nextProps.grid.some((c, i) => this.props.grid[i] !== c)) {
            this.drawCells(nextProps);
            return true;
        }
        return false;
    }
    
    drawCells(props=this.props) {
        const grid = props.grid;
        const changeBuffer = props.changeBuffer;
        if (!grid.length) { 
            return;
        }
        const liveCell = '#adf5bb';
        const deadCell = '#2c3a31';
        const ctx = this.ctx;
        const size = this.props.cellSize;
        const that = this;

        const fillCell = (index, fill) => {
            // cell filling function
            const c = (index % that.props.cols) * size;
            const r = ((index - (index % that.props.cols)) / that.props.cols) * size;
            ctx.fillStyle = fill;
            ctx.fillRect(c, r, size, size);
        }
        
        if (!changeBuffer.length){
            // if reading from .grid because first turn
            grid.forEach((cell, i) => {
                if (cell === 1) {
                    fillCell(i, liveCell);
                } else if (cell === 0){
                    fillCell(i, deadCell);
                }
            });
        } else {
            // if reading from changeBuffer
            changeBuffer.forEach(i => {
            if (grid[i] === 1) { 
                    fillCell(i, liveCell);
                } else if (grid[i] === 0) { 
                    fillCell(i, deadCell);
                }
            });
        }
    }
    
    render() {
        const size = this.props.cellSize;
        const width = this.props.cols * size;
        const height = this.props.rows * size;
        
        return (
            <div id="canvas-container">
            <canvas 
                id="canvas-board" 
                width={width} 
                height={height}>       
            </canvas>
            <Overlay 
                largeGrid={this.props.largeGrid}
                cellSize={this.props.cellSize}
                gridIsOn={this.props.gridIsOn}
                rows={this.props.rows}
                onCellClickEvent={this.props.onCellClickEvent}
                cols={this.props.cols}/>
            </div>
            
        )
    }
}

export default CanvasBoard;