import api from './../api'
import {find} from 'prelude-ls'

let loadPosts = function(store) {

    store.dispatch({type: 'LOADING_POSTS'})

    api.all()
    .then(it => store.dispatch({type: 'POSTS_LOADED', posts: it}))
    .catch(it => store.dispatch({type: 'LOADING_ERROR', error: it}))

}


let addPost = (newPost) =>
    function(store) {

        let missingField = find((p => !newPost[p]), ["title", "header", "body"])

        if(!!missingField) {
            store.dispatch({
                type: 'ADDING_UPDATING_POST_ERROR', 
                error: `All fields are mandatory. Please fill the ${missingField} field.`,
                errorField: missingField
            })
        } else {
            store.dispatch({type: 'ADDING_UPDATING_POST'})
            api.add(newPost)
            .then(_ => store.dispatch({type: 'ADDING_UPDATING_POST_ADDED'}))
            .then(_ => store.dispatch(loadPosts))
            .then(_ => store.dispatch({type: 'ADDING_UPDATING_POST_ADDED_AND_LOADED'}))
            .catch(it => store.dispatch({type: 'ADDING_UPDATING_POST_ERROR', error: it.toString(), errorField: null}))
        }
    }

export default {
    loadPosts: loadPosts,
    addPost: addPost
}