import React from 'react';
class Overlay extends React.Component {
    constructor(props) {
        super(props)
        this.olCtx = null;
        this.drawOverlay = this.drawOverlay.bind(this);
    }
    
    componentDidMount(){
        const overlayCanvas = document.getElementById('canvas-overlay');

        // set background
        const overlayCtx = overlayCanvas.getContext('2d');
        this.olCtx = overlayCtx;

        const that = this;

        overlayCanvas.addEventListener('click', e => {
            if (that.props.gridIsOn) {
                return;
            }
            const ex = e.clientX - overlayCanvas.offsetLeft;
            const ey = e.clientY - overlayCanvas.offsetTop;
            
            const cellX = Math.floor(ex / that.props.cellSize);
            const cellY = Math.floor(ey / that.props.cellSize);
    
            const gridIndex = cellY * that.props.cols + cellX;
            that.props.onCellClickEvent(gridIndex);
        })
        this.drawOverlay();
    }
    
    shouldComponentUpdate(nextProps) {
        return true
        // return nextProps.largeGrid !== this.props.largeGrid
    }
    
    componentDidUpdate(){
        this.olCtx.clearRect(0,0,this.props.cols * this.props.cellSize, this.props.rows * this.props.cellSize);
        this.drawOverlay();
    }

    drawOverlay() {
        // draws the grid
        const cols = this.props.cols;
        const rows = this.props.rows;
        const cellSize = this.props.cellSize;
        const ctx = this.olCtx;
        const lineCol = '#111112';
        
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo((i * cellSize) , 0);
            ctx.lineTo((i * cellSize) , rows * cellSize);
            ctx.closePath();
            ctx.strokeStyle = lineCol;
            ctx.stroke();
        }

        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (i * cellSize) );
            ctx.lineTo(cols * cellSize, (i * cellSize) );
            ctx.closePath();
            ctx.strokeStyle = lineCol;
            ctx.stroke();
        }    
    }
    
    render() {
        const size = this.props.cellSize;
        const width = this.props.cols * size;
        const height = this.props.rows * size;
        const margins = {
            color: 'red'
        }
        return( 
            <canvas id="canvas-overlay" width={width} height={height} style={margins} />    
        )
    }
}

export default Overlay;