import React from 'react'
import Post from '../components/Post'
import NewPostEditor from '../components/NewPostEditor'
import store from '../actions/store'
import actions from '../actions/actions'

export default React.createClass({

    render() {
        
        let {posts, status, error} = this.state.index
        let {newPost, newPostUI} = this.state.newPost
        
        let content;

        if('error' == status){
            content = 
                <div className='error'>
                    Loading posts failed:
                    <div>
                        {error}
                    </div>
                </div>
        } else if (posts.length == 0 && 'loaded' == status) {
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
        return <div className={(`index ${status} ${posts.length > 0 ? 'somePosts': 'noPosts'}`)}>

            {content}
          
            // pure component

            <NewPostEditor 
              uiState={newPostUI} 
              post={newPost} 
              update={(partial) => store.dispatch({type: 'UPDATE_NEWPOST', partial: partial})} 
              add={_ => store.dispatch(actions.addPost(newPost))} />
        </div>
    },

    fromStoreState() {
        let {posts, newPost, newPostUI} = store.getState()
        return {posts: posts, newPost: newPost, newPostUI: newPostUI}
    },

    // getInitialState :: a -> UIState
    getInitialState() { 
        return this.fromStoreState()
    },

    // unsubscribe function
    unsubscribe: (_ => void 8),

    // web socket 
    socket: null,

    // ccomponentWillMount :: a -> Void
    componentWillMount() {
        // get all the posts
        let self = this

        self.unsubscribe = store.subscribe(_ => {

            console.log('store changed', store.getState())

            // retain scroll position

            let beforeHeight = document.body.scrollHeight
            self.setState(store.getState())

            if (beforeHeight > window.innerHeight) {
                let afterHeight = document.body.scrollHeight
                window.scrollTo(window.scrollX, window.scrollY + (afterHeight - beforeHeight))
            }
        })

        // load posts initially
        store.dispatch(actions.loadPosts)

        // listen to a web socket for automatically receiving any change
        self.socket = require('socket.io-client')('wss://fs-blog-engine.herokuapp.com', {
            forceNew: true
        }).on('all-posts', posts => 
            store.dispatch({type: 'POSTS_PUSHED', posts: posts})
        )
    },

    // componentWillUnmount :: a -> Void
    componentWillUnmount() {

        // unsubscribe from store
        this.unsubscribe()

        // disconnect from web socket
        this.socket.destroy()
    }
})
