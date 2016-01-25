import React from 'react'
import Post from './components/Post'
import store from './store'


export default React.createClass({
  displayName:  'App',

  render() {
    return <div className='app'>
      <div>{this.props.children}</div>
    </div>
  },
  // get-initial-state :: a -> UIState
  getInitialState() { 
    return {}
  },

  // component-did-mount :: a -> Void
  componentDidMount() {

  }
})
