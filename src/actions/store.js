import {EventEmitter} from 'events'
import merge from 'merge'
import dispatcher from './dispatcher'
import api from './../api'
import {find} from 'prelude-ls'

var state = {
    posts: [],
    newPost: {
        title: '',
        header: '',
        body: ''
    },
    newPostUI: {
        status: 'none', // none | uploading | uploaded | error
        error: null, // :: String
        errorField: null // :: String
    }
}

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


let Store = merge(EventEmitter.prototype, {
    state: state,

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

export default Store

