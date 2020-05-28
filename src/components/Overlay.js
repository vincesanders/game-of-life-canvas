import React from 'react';
class Overlay extends React.Component {
    constructor(props) {
        super(props)
        this.olCtx = null;
        this.drawOverlay = this.drawOverlay.bind(this)
    }
    
    componentDidMount(){
        var overlayCanvas = document.getElementById('canvas-overlay')

        // set background
        var overlayCtx = overlayCanvas.getContext('2d')
        this.olCtx = overlayCtx

        var _this = this 

        overlayCanvas.addEventListener('click', function(e){
            if (_this.props.gridIsOn) { return }
            var ex = e.clientX - overlayCanvas.offsetLeft
            var ey = e.clientY - overlayCanvas.offsetTop
            
            var cellX = Math.floor(ex / _this.props.cellSize)
            var cellY = Math.floor(ey / _this.props.cellSize)
    
            var gridIndex = cellY * _this.props.cols + cellX
            _this.props.onCellClickEvent(gridIndex)
        })
        this.drawOverlay()
    }
    
    shouldComponentUpdate(nextProps) {
        return true
        return nextProps.largeGrid != this.props.largeGrid
    }
    
    componentDidUpdate(){
        this.olCtx.clearRect(0,0,this.props.cols * this.props.cellSize, this.props.rows * this.props.cellSize)
        this.drawOverlay()
    }

    drawOverlay() {
        // draws the grid
        var cols = this.props.cols
        var rows = this.props.rows
        var cellSize = this.props.cellSize
        var ctx = this.olCtx
        var lineCol = '#111112'
        
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath()
            ctx.moveTo((i * cellSize) , 0)
            ctx.lineTo((i * cellSize) , rows * cellSize)
            ctx.closePath()
            ctx.strokeStyle = lineCol
            ctx.stroke()
        }

        for (let i = 0; i <= rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, (i * cellSize) )
            ctx.lineTo(cols * cellSize, (i * cellSize) )
            ctx.closePath()
            ctx.strokeStyle = lineCol
            ctx.stroke()
        }    
    }
    
    render() {
        var size = this.props.cellSize
        var width = this.props.cols * size
        var height = this.props.rows * size
        return( 
            <canvas id="canvas-overlay" width={width} height={height} />       
        )
    }
}

export default Overlay;