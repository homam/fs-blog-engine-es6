import api from './../api'
import {find} from 'prelude-ls'

let loadPosts = function(store) {
    store.dispatch({type: 'LOADING_POSTS'})
    api.all()
    .then(it => store.dispatch({type: 'POSTS_LOADED', posts: it}))
    .catch(it => store.dispatch({type: 'LOADING_ERROR', error: it}))

}

// helper 
let addOrUpdatePost = (adding) => (post) => function(store) {

    let missingField = find((p => !post[p]), ["title", "header", "body"])

    let action = adding ? api.add : api.update

    if(!!missingField) {
        store.dispatch({
            type: 'ADDING_UPDATING_POST_ERROR', 
            error: `All fields are mandatory. Please fill the ${missingField} field.`,
            errorField: missingField
        })
    } else {
        store.dispatch({type: 'ADDING_UPDATING_POST'})
        action(post)
        .then(_ => store.dispatch({type: 'ADDING_UPDATING_POST_ADDED'}))
        .then(_ => store.dispatch(loadPosts))
        .then(_ => store.dispatch({type: 'ADDING_UPDATING_POST_ADDED_AND_LOADED'}))
        .catch(it => store.dispatch({type: 'ADDING_UPDATING_POST_ERROR', error: it.toString(), errorField: null}))
    }
}

let addPost = addOrUpdatePost(true)

let updatePost = addOrUpdatePost(false)

let loadPost = (postId) => function(store) {
    store.dispatch({type: 'GET_POST_LOADING'})
    api.get(postId)
    .then(post => store.dispatch({type: 'GET_POST_LOADED', post: post}))   
    .catch(it => store.dispatch({type: 'GET_POST_ERROR', error: it.toString()}))
}

let deletePost = (postId) => function(store) {
    store.dispatch({type: 'EDIT_POST_DELETE_YES'})
    api.remove(postId)
    .then(post => store.dispatch({type: 'EDIT_POST_DELETED', post: post}))   
    .catch(it => store.dispatch({type: 'EDIT_POST_DELETE_ERROR', error: it.toString()}))
}

export default {
    loadPosts: loadPosts,
    loadPost: loadPost,
    addPost: addPost,
    updatePost: updatePost,
    deletePost: deletePost
}