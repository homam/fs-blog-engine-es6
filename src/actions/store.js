import {EventEmitter} from 'events'
import merge from 'merge'
import {createStore, combineReducers} from 'redux'
import api from './../api' // todo: remove
import {find} from 'prelude-ls'

let freshNewPostUI = _ => ({
    status: 'none', // none | uploading | uploaded | error
    message: null, // :: String
    errorField: null // :: String
})

let initialState = _ =>
    ({
        posts: [],
        indexUI: {
            status: 'none' // none | loading | loaded
        },
        newPost: {
            title: '',
            header: '',
            body: ''
        },
        newPostUI: freshNewPostUI(),
        editorPost: null,
        editorFetchError: null,
        deletePostStatus: 'none' // none | confirm | deleting | deleted | restored
    })

let reducer = function(state = initialState(), action) {
    
    console.info("action", action.type, action)

    switch(action.type) {
        case 'LOADING_POSTS':
            state.indexUI.status = 'loading'
            return state

        case 'POSTS_LOADED':
            state.indexUI.status = 'loaded'
            state.posts = action.posts
            return state


        case 'ADDING_UPDATING_POST':
            state.newPostUI.status = 'uploading'    
            return state

        case 'ADDING_UPDATING_POST_ERROR':
            state.newPostUI = {
                status: 'error',
                message: action.error,
                errorField: action.errorField
            }
            return state

        case 'ADDING_UPDATING_POST_ADDED':
            state.newPostUI = {
                status: 'uploaded',
                error: null,
                errorField: null
            }
            state.newPost = {
                title: '',
                header: '',
                body: ''
            }
            return state

        case 'GET_POST_LOADING':
            state.editorPost = null
            state.editorFetchError = null
            state.newPostUI = freshNewPostUI()
            return state

        case 'GET_POST_ERROR':
            state.editorFetchError = action.error
            return state

        case 'GET_POST_LOADED': 
            state.editorPost = action.post
            return state

        case 'EDIT_POST_UPDATE':
            state.editorPost = merge(state.editorPost, action.partial)
            return state

        case 'EDIT_POST_DELETE':
            state.deletePostStatus = 'confirm'
            return state

        case 'EDIT_POST_DELETE_YES':
            state.deletePostStatus = 'deleting'
            return state

        case 'EDIT_POST_DELETED':
            state.deletePostStatus = 'deleted'
            return state

        case 'EDIT_POST_RESTORED':
            state.deletePostStatus = 'none'
            return state

        case 'EDIT_POST_DELETE_NO':
            state.deletePostStatus = 'none'
            return state

        case 'NEWPOST.UPDATE':
            state.newPost = merge(state.newPost, action.partial)
            return state

        default:
            return state
    }
}

let store = createStore(reducer)
let _dispatch = store.dispatch
store.dispatch = (action) =>
    typeof action == 'function' ? action(store) : _dispatch(action)

export default store


// dispatch a change in state
let dispatch = function(change) {
    state = merge(state, change)
    Store.emit('change', state)
}

// helper function, equivalent to LiveScript's: {"#p": v}
let dynObj = function(p, v) {
    return (function() { var ref$ = {}; ref$[p] = v; return ref$})()
}

// dispatch a change in state specified by @obj@
let dispatchp = function(obj, p, change) {
    let v = merge(obj[p], change)
    dispatch(dynObj(p, v))
}

// dispatch a change in state
let dispatchps = function(p, change) {
    dispatchp(state, p, change)
}

let a = function () {

    let Store = merge(EventEmitter.prototype, {
        state: state,

        getState: function() {
            return state
        },

        all: function() {
            
            api.all().then(it => dispatch({posts: it}))
        },
        newPostUpdated: (partial) => {
            // state = merge(state, {newPost: merge(state.newPost, partial)})
            dispatchps('newPost', partial)
        },
        add: function() {
            
            // clear the state
            dispatch(dispatchps('newPostUI', {status: 'uploading', errorField: null, message: null}))

            // validate the input
            let missingField = find((p => !state.newPost[p]), ["title", "header", "body"])

            if(!!missingField) {
                dispatch(dispatchps('newPostUI', {
                    status: 'error',
                    errorField: missingField,
                    message: `All fields are mandatory. Please fill the ${missingField} field.`
                }))
            } else {
                
                // validation succeeded, upload the post

                api.add(state.newPost)
                .then(it => {
                    Store.all()
                    state =  merge(state, {newPostUI: merge(state.newPostUI, {status: 'uploaded'})})
                    Store.emit('change', state)  
                })
                .catch(it => {
                    dispatch(dispatchps('newPostUI', {status: 'error', message: it}))
                })
            }
        }
    })


}