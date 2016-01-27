import React from 'react'
import Post from './components/Post'
import store from './actions/store'
require('./app.styl')

export default React.createClass({
  displayName:  'App',

  render() {
    return <div className='app'>
      {this.props.children}
    </div>
  },
  // get-initial-state :: a -> UIState
  getInitialState() { 
    return {}
  },


  // unsubscribe function
  unsubscribe: (_ => void 8),

  // component-did-mount :: a -> Void
  componentWillMount() {
    // get all the posts
    let self = this
    self.unsubscribe = store.subscribe(_ =>
      self.setState(store.getState())
    )
  },

  // component-will-unmount :: a -> Void
  componentWillUnmount() {
    this.unsubscribe()
  }
})
