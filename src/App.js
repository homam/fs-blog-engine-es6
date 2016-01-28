import React from 'react'
import Post from './components/Post'
import store from './actions/store'
require('./app.styl')

export default React.createClass({

  render() {
    return <div className='app'>
      {this.props.children}
    </div>
  },

  // getInitialState :: a -> UIState
  getInitialState() { 
    return {}
  },

  // unsubscribe function
  unsubscribe: (_ => void 8),

  // componentWillMount :: a -> Void
  componentWillMount() {
    // get all the posts
    let self = this
    self.unsubscribe = store.subscribe(_ =>
      self.setState(store.getState())
    )
  },

  // componentWillUnmount :: a -> Void
  componentWillUnmount() {
    this.unsubscribe()
  }
})
