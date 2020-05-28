import React from 'react';
class Controls extends React.Component {
    constructor (props) {
        super(props)
        // method bindings
        this.clearBoard = this.clearBoard.bind(this)
        this.newBoard = this.newBoard.bind(this)
        this.toggleOnOff = this.toggleOnOff.bind(this)
        this.toggleSize = this.toggleSize.bind(this)
        this.encodeSeed = this.encodeSeed.bind(this)
        this.decodeSeed = this.decodeSeed.bind(this)
        this.sample = this.sample.bind(this)
    }
    
    clearBoard () {
        if(this.props.gridIsOn) { return }
        this.props.onClearBoard()
    }
    
    newBoard () {
        if(this.props.gridIsOn) { return }
        this.props.onNewBoard()
    }
    
    encodeSeed () {
        if(this.props.gridIsOn) { return }
        this.props.onEncodeSeed()
    }
    
    sample () {
        if(this.props.gridIsOn) { return }
        this.props.onDecodeSeed(true)
    }
    
    decodeSeed () {
        if(this.props.gridIsOn) { return }
        this.props.onDecodeSeed(false)
    }
    
    toggleOnOff (e) {
        e.preventDefault()
        this.props.onToggleOnOff()
    }
    
    toggleSize() {
        this.props.onToggleSize()
    }
    
    render() {
        return (
            <div id="control-panel">
            <button className="btn" onClick={this.toggleOnOff}>
                {this.props.gridIsOn ? "Stop" : "Start"}</button>
            <span className="gen">Generation: {this.props.generation}</span>
            {this.props.gridIsOn ? <span></span> : (
                <span>
                    <button className="btn" onClick={this.clearBoard} >Clear</button>
                    <button className="btn" id='randomize-btn' onClick={this.newBoard} >Randomize</button>
                    <button className="btn" onClick={this.toggleSize}>
                        {this.props.largeGrid ? "Small" : "Large"}  
                    </button>
                    <button className="btn" onClick={this.encodeSeed}>Save</button>
                    <button className="btn" onClick={this.decodeSeed}>Load</button>
                    <button className="btn" onClick={this.sample}>Test</button>
                </span>
            )}
            
            </div>
        )
    }
}

export default Controls;