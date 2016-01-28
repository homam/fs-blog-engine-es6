import React from 'react'
import {Link} from 'react-router'
import api from './../api'
import Post from '../components/Post'
import {ExistingPostEditor} from '../components/Editor'
import store from '../actions/store'
import actions from '../actions/actions'

export default React.createClass({
    render() {
        let content;
        let {editorPost, editorFetchError, newPostUI, deletePostStatus} = this.state
        
        if (!!editorPost) {
            content = 
                <ExistingPostEditor 
                    deletePostStatus={deletePostStatus}
                    uiState={newPostUI} 
                    post={editorPost} 
                    update={(partial) => store.dispatch({type: 'EDIT_POST_UPDATE', partial: partial})} 
                    add={_ => store.dispatch(actions.updatePost(editorPost))} />
        } else if (!!editorFetchError) {
            content = 
                <div>
                    Error loading the post: '{editorFetchError}'
                    <p>
                        <Link to='/'>Back to home</Link>
                    </p>
                </div>
        } else {
            content = 
                <div>
                    Loading ...
                </div>
        }

        return <div>
            {content}
            
        </div>
    
    },

    // unsubscribe function
    unsubscribe: (_ => void 8),

    // component-did-mount :: a -> Void
    componentWillMount() {
        // get all the posts
        let self = this
        self.unsubscribe = store.subscribe(_ => {
            self.setState(store.getState())
        })
        store.dispatch(actions.loadPost(parseInt(this.props.params.postId)))
    },

    // component-will-unmount :: a -> Void
    componentWillUnmount() {
      this.unsubscribe()
    }
})

// <ExistingPostEditor uiState={newPostUI} 
//   post={newPost} 
//   update={(partial) => store.dispatch({type: 'NEWPOST.UPDATE', partial: partial})} 
//   add={_ => store.dispatch(actions.addPost(newPost))} />