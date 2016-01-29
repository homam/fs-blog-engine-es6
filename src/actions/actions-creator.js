import {find} from 'prelude-ls'

// dependency injection, @api@ can be mocked or replaced

export default function(api) {

    const loadPosts = function(store) {
        store.dispatch({type: 'LOADING_POSTS'})
        api.all()
        .then(it => store.dispatch({type: 'POSTS_LOADED', posts: it}))
        .catch(it => store.dispatch({type: 'LOADING_ERROR', error: it}))

    }

    // helper 
    const addOrUpdatePost = (adding) => (post) => function(store) {

        const missingField = find((p => !post[p]), ["title", "header", "body"])

        const action = adding ? api.add : api.update

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

    const addPost = addOrUpdatePost(true)

    const updatePost = addOrUpdatePost(false)

    const loadPost = (postId) => function(store) {
        store.dispatch({type: 'GET_POST_LOADING'})
        api.get(postId)
        .then(post => store.dispatch({type: 'GET_POST_LOADED', post: post}))   
        .catch(it => store.dispatch({type: 'GET_POST_ERROR', error: it.toString()}))
    }

    const deletePost = (postId) => function(store) {
        store.dispatch({type: 'EDIT_POST_DELETE_YES'})
        api.remove(postId)
        .then(post => store.dispatch({type: 'EDIT_POST_DELETED', post: post}))   
        .catch(it => store.dispatch({type: 'EDIT_POST_DELETE_ERROR', error: it.toString()}))
    }

    const restorePost = (post) => function(store) {
        store.dispatch({type: 'EDIT_POST_RESTORE'})
        api.restore(post)
        .then(post => store.dispatch({type: 'EDIT_POST_RESTORED', post: post}))   
        .catch(it => store.dispatch({type: 'EDIT_POST_RESTORE_ERROR', error: it.toString()}))
    }

    return {
        loadPosts: loadPosts,
        loadPost: loadPost,
        addPost: addPost,
        updatePost: updatePost,
        deletePost: deletePost,
        restorePost: restorePost
    }
}