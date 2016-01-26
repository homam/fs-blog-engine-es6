import React from 'react'
import api from './../api'
import Post from '../components/Post'
import {NewPostEditor} from '../components/Editor'

import store from '../actions/store'

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
          update={store.newPostUpdated} 
          add={store.add} />
      </div>
    </div>
  },

  fromStoreState() {
    let {posts, newPost, newPostUI} = store.state
    return {posts: posts, newPost: newPost, newPostUI: newPostUI}
  },

  // get-initial-state :: a -> UIState
  getInitialState() { 
    return this.fromStoreState()
  },

  // component-did-mount :: a -> Void
  componentWillMount() {

    // bind this to store
    let self = this
    store.on('change', _ => self.setState(self.fromStoreState()))

    // get all the posts
    store.all()
  }
})

// let {PropTypes} = React
// IndexRoute.propTypes = {
//   posts: PropTypes.array.isRequired,
//   isFetchingPosts: PropTypes.bool.isRequired,
//   // dispatch: PropTypes.func.isRequired
// }


export default IndexRoute