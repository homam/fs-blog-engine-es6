import merge from 'merge'

const freshNewPostUI = _ => ({
    status: 'none', // none | uploading | uploaded | error
    message: null, // :: String
    errorField: null // :: String
})

const initialIndexState = _ => ({
    posts: [], // :: [Post]
    status: 'none', // none | loading | loaded | error
    error: null // :: String
})

const indexReducer = function(state = initialIndexState(), action) {

    // here I'm not using immutable data structures.

    switch(action.type) {

        case 'LOADING_POSTS':
            return merge({}, state, {status: 'loading'})

        case 'POSTS_LOADED':
            return merge({}, state, {status: 'loaded', posts: action.posts})

        case 'LOADING_ERROR':
            state.status = 'error'
            state.error = action.error
            return state

        // from web socket
        case 'POSTS_PUSHED':
            state.posts = action.posts
            return state

        default:
            return state
    }
}


const initialNewPostState = _ => ({
    newPost: { // :: [PartialPost]
        title: '',
        header: '',
        body: ''
    },
    newPostUI: freshNewPostUI()
})


const newPostReducer = function(state = initialNewPostState(), action) {

    switch(action.type){

        case 'ADDING_UPDATING_POST':
            return merge({}, state, {
                newPostUI: merge({}, state.newPostUI, {status: 'uploading'})
            })

        case 'ADDING_UPDATING_POST_ERROR':
            state.newPostUI = {
                status: 'error',
                message: action.error,
                errorField: action.errorField
            }
            return state

        case 'ADDING_UPDATING_POST_ADDED':
            return merge({}, state,  {
                newPostUI: merge({}, state.newPostUI, {
                    status: 'uploaded',
                    error: null,
                    errorField: null
                }),
                newPost: {
                    title: '',
                    header: '',
                    body: ''
                    }
                }
            )

        case 'UPDATE_NEWPOST':
            state.newPost = merge(state.newPost, action.partial)
            return state

        default:
            return state
    }
}


const existingPostState = _ => ({
    post: null,
    fetchError: null,
    deleteStatus: 'none', // none | confirm | deleting | deleted | restored
    newPostUI: freshNewPostUI()
})

const existingPostReducer = function(state = existingPostState(), action) {

    // this reducer has a similar funcitonality (is a subset of) newPostReducer
    // in this demo, using similar state objects I just call newPostReducer 

    state = newPostReducer(state, action)

    switch(action.type) {

        case 'GET_POST_LOADING':
            state.post = null
            state.fetchError = null
            state.newPostUI = freshNewPostUI()
            return state

        case 'GET_POST_ERROR':
            state.fetchError = action.error
            return state

        case 'GET_POST_LOADED': 
            state.post = action.post
            return state

        case 'EDIT_POST_UPDATE':
            state.post = merge(state.post, action.partial)
            return state

        case 'EDIT_POST_DELETE':
            state.newPostUI = freshNewPostUI()
            state.deleteStatus = 'confirm'
            return state

        case 'EDIT_POST_DELETE_YES':
            state.deleteStatus = 'deleting'
            return state

        case 'EDIT_POST_DELETED':
            state.deleteStatus = 'deleted'
            return state

        case 'EDIT_POST_DELETE_ERROR':
            state.newPostUI.status = 'error'
            state.newPostUI.message = action.error

        case 'EDIT_POST_RESTORED':
            state.deleteStatus = 'none'
            return state

        case 'EDIT_POST_DELETE_NO':
            state.deleteStatus = 'none'
            return state

        default:
            return state
    }
}

export default {
    indexReducer: indexReducer,
    newPostReducer: newPostReducer,
    existingPostReducer: existingPostReducer
}