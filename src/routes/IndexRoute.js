import React from 'react'
import store from './../store'
import Post from '../components/Post'


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
      
      <div>{(posts.length)}</div>
    </div>
  },
  // get-initial-state :: a -> UIState
  getInitialState() { 
    return {
      posts: []
    }
  },

  // component-did-mount :: a -> Void
  componentDidMount() {
    // get all the posts
    let self = this
    store.all().then(it => self.setState({posts: it}))
  }
})

let {PropTypes} = React
IndexRoute.propTypes = {
  posts: PropTypes.array.isRequired,
  isFetchingPosts: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}


export default IndexRoute