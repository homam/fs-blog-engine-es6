import React from 'react'
import api from './../api'
import Post from '../components/Post'
import {NewPostEditor} from '../components/Editor'

import store from '../actions/store'

let IndexRoute = React.createClass({
  displayName: 'Index',

  render() {
    let {posts} = this.state
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
        <NewPostEditor />
      </div>
    </div>
  },
  // get-initial-state :: a -> UIState
  getInitialState() { 
    return {
      posts: []
    }
  },

  // component-did-mount :: a -> Void
  componentWillMount() {
    // get all the posts
    let self = this
    store.on('change', ({posts}) => {
      self.setState({posts: posts})
    })
    store.all()
    // api.all().then(it => self.setState({posts: it}))
    //this.props.api.all()
  }
})

// let {PropTypes} = React
// IndexRoute.propTypes = {
//   posts: PropTypes.array.isRequired,
//   isFetchingPosts: PropTypes.bool.isRequired,
//   // dispatch: PropTypes.func.isRequired
// }


export default IndexRoute