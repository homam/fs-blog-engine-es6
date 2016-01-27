import React from 'react'
import api from './../api'
import Post from '../components/Post'
import {NewPostEditor} from '../components/Editor'

import store from '../actions/store'
import actions from '../actions/actions'


console.log('actions', actions)

let IndexRoute = React.createClass({
  displayName: 'Index',

  render() {
    let {posts, newPost, newPostUI} = this.state
    let content;
    if (posts.length == 0) {
      content = 
        <div>
          <h2 className='welcome'>Welcome to your fresh empty blog!</h2>
        </div>
    } else {
      content = 
        <div>
          {posts.map(post => 
            <div key={post._id}>
              <Post post={post} />
            </div>
          )}
        </div>
    }
    return <div>
      {content}
      
      <div>
        <NewPostEditor 
          uiState={newPostUI} 
          post={newPost} 
          update={(partial) => store.dispatch({type: 'NEWPOST.UPDATE', partial: partial})} 
          add={_ => store.dispatch(actions.addPost(newPost))} />
      </div>
    </div>
  },

  fromStoreState() {
    let {posts, newPost, newPostUI} = store.getState()
    return {posts: posts, newPost: newPost, newPostUI: newPostUI}
  },

  // get-initial-state :: a -> UIState
  getInitialState() { 
    return this.fromStoreState()
  },

  // unsubscribe function
  unsubscribe: (_ => void 8),

  // component-did-mount :: a -> Void
  componentWillMount() {
    // get all the posts
    let self = this
    self.unsubscribe = store.subscribe(_ => {

      console.log('store changed', store.getState())

      // retain scroll position

      let beforeHeight = document.body.scrollHeight
      self.setState(store.getState())
      let afterHeight = document.body.scrollHeight
      window.scrollTo(window.scrollX, window.scrollY + (afterHeight - beforeHeight))
    }
    )
    store.dispatch(actions.loadPosts)
  },

  // component-will-unmount :: a -> Void
  componentWillUnmount() {
    this.unsubscribe()
  }
})

// let {PropTypes} = React
// IndexRoute.propTypes = {
//   posts: PropTypes.array.isRequired,
//   isFetchingPosts: PropTypes.bool.isRequired,
//   // dispatch: PropTypes.func.isRequired
// }


export default IndexRoute