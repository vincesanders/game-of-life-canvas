class CanvasBoard extends React.Component {
    constructor(props) {
        super(props)
        this.ctx = {}
        this.drawCells = this.drawCells.bind(this)
    }
    
    componentDidMount(){
        var canvas = document.getElementById('canvas-board')
        var ctx = canvas.getContext('2d')
        this.ctx = ctx
        this.drawCells()
    }
    
    shouldComponentUpdate(nextProps, nextState){
    
        if (nextProps.gameIsOn != this.props.gameIsOn) { return true }
        if (nextProps.changeList.length != this.props.changeList.length) { return true }
        if (nextProps.changeList && 
            nextProps.changeList.some((c, i) => c != this.props.changeList[i])) { 
            return true 
        }
        if (nextProps.game.length &&
            nextProps.game.every(c => c == 0) ) {
            return true 
        }
        if(!nextProps.game.length &&
            !this.props.game.length) { 
            return false 
        }
        if (nextProps.game.length !=
            this.props.game.length ||
            nextProps.game.some((c, i) => this.props.game[i] != c)) {
            return true
        }
        return false
    }
    
    componentWillUpdate(nextProps) {
        this.drawCells(nextProps)   
    }
    
    drawCells(props=this.props){
        var game = props.game
        var changeList = props.changeList
        if(!game.length) { return }
        var liveCell = '#EB891A'
        var deadCell = '#030201'
        var ctx = this.ctx
        var size = this.props.cellSize
        var _this = this

        const fillCell = (index, fill) => {
            // cell filling function
            var c = (index % _this.props.cols) * size
            var r = ((index - (index % _this.props.cols)) / _this.props.cols) * size
            ctx.fillStyle = fill
            ctx.fillRect(c, r, size, size) 
        }
        
        if (!changeList.length){
            // if reading from .game because first turn
            game.forEach((cell, i) => {
                if (cell == 1) {
                fillCell(i, liveCell)
                } else if (cell == 0){
                fillCell(i, deadCell)
                }
            })
        } else {
            // if reading from changelist
            changeList.forEach(i => {
            if (game[i] == 1) { 
                fillCell(i, liveCell)
                } else if (game[i] == 0) { 
                fillCell(i, deadCell)
                }
            })
        }
    }
    
    render() {
        var size = this.props.cellSize
        var width = this.props.cols * size
        var height = this.props.rows * size
        
        return (
            <div id="canvas-container">
            <canvas 
                id="canvas-board" 
                width={width} 
                height={height}>       
            </canvas>
            <Overlay 
                largeGame={this.props.largeGame}
                cellSize={this.props.cellSize}
                gameIsOn={this.props.gameIsOn}
                rows={this.props.rows}
                onCellClickEvent={this.props.onCellClickEvent}
                cols={this.props.cols}/>
            </div>
            
        )
    }
}

export default CanvasBoard;