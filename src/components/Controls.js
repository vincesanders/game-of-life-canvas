import React from 'react';
class Controls extends React.Component {
    constructor (props) {
        super(props)
        // method bindings
        this.clearBoard = this.clearBoard.bind(this)
        this.newBoard = this.newBoard.bind(this)
        this.toggleOnOff = this.toggleOnOff.bind(this)
        this.toggleSize = this.toggleSize.bind(this)
        this.serialize = this.serialize.bind(this)
        this.deserialize = this.deserialize.bind(this)
        this.sample = this.sample.bind(this)
    }
    
    clearBoard () {
        if(this.props.gameIsOn) { return }
        this.props.onClearBoard()
    }
    
    newBoard () {
        if(this.props.gameIsOn) { return }
        this.props.onNewBoard()
    }
    
    serialize () {
        if(this.props.gameIsOn) { return }
        this.props.onSerialize()
    }
    
    sample () {
        if(this.props.gameIsOn) { return }
        this.props.onDeserialize(true)
    }
    
    deserialize () {
        if(this.props.gameIsOn) { return }
        this.props.onDeserialize(false)
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
                {this.props.gameIsOn ? "Stop" : "Run"}</button>
            <span className="gen">Generation: {this.props.generation}</span>
            {this.props.gameIsOn ? <span></span> : (
                <span>
                    <button className="btn" onClick={this.clearBoard} >Clear</button>
                    <button className="btn" onClick={this.newBoard} >Soup</button>
                    <button className="btn" onClick={this.toggleSize}>
                        {this.props.largeGame ? "Small" : "Large"}  
                    </button>
                    <button className="btn" onClick={this.serialize}>Save</button>
                    <button className="btn" onClick={this.deserialize}>Load</button>
                    <button className="btn" onClick={this.sample}>Test</button>
                </span>
            )}
            
            </div>
        )
    }
}

export default Controls;