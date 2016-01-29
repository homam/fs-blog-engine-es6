import React from 'react'
import {Link} from 'react-router'
import Post from '../components/Post'
import ExistingPostEditor from '../components/ExistingPostEditor'
import store from '../actions/store'
import actions from '../actions/actions'

export default React.createClass({
    render() {

        let content;
        let {post, fetchError, newPostUI, deleteStatus} = this.state
        
        if (!!post) {
            content = 
                
                <ExistingPostEditor 
                    deleteStatus={deleteStatus}
                    uiState={newPostUI} 
                    post={post} 
                    update={(partial) => store.dispatch({type: 'EDIT_POST_UPDATE', partial: partial})} 
                    add={_ => store.dispatch(actions.updatePost(post))} 
                    removeConfirm={_ => store.dispatch({type: 'EDIT_POST_DELETE'})}
                    removeCancel={_ => store.dispatch({type: 'EDIT_POST_DELETE_NO'})}
                    remove={_ => store.dispatch(actions.deletePost(post._id))} 
                    restore={_ => store.dispatch(actions.restorePost(post))} />

        } else if (!!fetchError) {
            content = 
                <div>
                    Error loading the post: '{fetchError}'
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
            self.setState(store.getState().editPost)
        })
        store.dispatch(actions.loadPost(parseInt(this.props.params.postId)))
    },

    // component-will-unmount :: a -> Void
    componentWillUnmount() {
      this.unsubscribe()
    }
})