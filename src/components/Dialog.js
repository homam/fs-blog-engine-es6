import React from 'react'
import {findDOMNode} from 'react-dom'

export default React.createClass({
  displayName: 'Dialog',
  
  render() {
    return <div className='dialog-overlay' onClick={this.props.no}>
      <div className='dialog'>
        <div>{this.props.question}</div>
        <div className='controls'>
          <button ref='no' type='button' className='no' 
            onClick={this.props.onNo}>No</button>
          <button ref='yes' type='button' className='yes' 
            onClick={this.props.onYes}>Yes</button>
        </div>
      </div>
    </div>
  }
})
