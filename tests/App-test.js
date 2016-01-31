import expect from 'expect'
import assert from 'assert'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {last} from 'prelude-ls'
import clone from 'clone'
import store from 'src/actions/store'
import actionsCreator from 'src/actions/actions-creator'
import App from 'src/App'

const trace = (what, f) => {
    console.log(what)
    return f()
}

// here I'm showcasing a general way of testing redux actions and store state transitions
// many tests are to be written


// utility function that record every state transition in the store
// for every test case
// condition :: (State, [State]) => Boolean
// indicates when to run the test cases
const recordStates = (condition) => new Promise(resolve => {
    let states = [] 

    let unsub = store.subscribe(_ => {

        const state = store.getState()      
        const {posts, status, error} = state    

        states.push(state)

        if(condition(state, states)) {
            unsub()
            resolve(states)
        }

    })
})

// mock api for testing

const mockApi = _ => {

    let posts = []

    return {
        all: _ => new Promise((resolve) => 
            setTimeout( _ => resolve(clone(posts)), 10)
        ),
        add: (post) => new Promise(resolve =>
            setTimeout(_ => {
                posts.push(post)
                post._id = new Date().valueOf()
                resolve(post)
            }, 10)
        ),
        get: (postId) => new Promise(resolve =>
            setTimeout(_ => {
                resolve(posts[0])
            }, 10)
        )
    }
}

// async action creators using the mock api

let actions = null
const reset = (callback) => {

    // reset the mock api before each test

    actions = actionsCreator(mockApi())
    callback()
}

describe('Index route', _ => {

    beforeEach(reset)

    specify('initial state', () => new Promise((resolve, reject) => {
        let {posts, status, error} = store.getState().index
        assert(posts.length == 0, 'posts must be an empty array')
        resolve()
    }))

    specify('fetch posts', () => new Promise((resolve) =>
    {
        // this test finishes when currrent index.status is 'loaded'
        recordStates(({index:{status}}) => 'loaded' == status).then(resolve)
        store.dispatch(actions.loadPosts)
    }).then(states => {
        assert.deepEqual(["loading", "loaded"], states.map(s => s.index.status), 
            'Expected loading and loaded state transitions for actions.loadPosts()')
    }))
})

describe('Adding and retrieving new Post', _ => {

    before(reset)

    specify('add a post', () => new Promise(resolve =>
    {
        // adding a post ends when the post appears in the state.index.posts
        recordStates(state => state.index.posts.length == 1).then(resolve)
        store.dispatch(actions.addPost({title: 'title', header: 'header', body: 'body'}))
    }).then(states => {
        assert.deepEqual(
              [['uploading', 'loaded'], ['uploaded', 'loaded'], ['uploaded', 'loading'], ['uploaded', 'loading'], ['uploaded', 'loaded']]
            , states.map(s => [s.newPost.newPostUI.status, s.index.status])
            , `Expected uploading and uploaded state transitions for these actions:
                'ADDING_UPDATING_POST'
                'ADDING_UPDATING_POST_ADDED'
                'LOADING_POSTS'
                'ADDING_UPDATING_POST_ADDED_AND_LOADED'
                'POSTS_LOADED'`
        )
    }))

    specify('getting a post', () => new Promise(resolve =>
    {
        recordStates(state => 'loaded' == state.index.status).then(states => {
            // final state is when the state.editPost.post is set
            recordStates(state => !!state.editPost.post).then(resolve)
            store.dispatch(actions.loadPost())
        })
        store.dispatch(actions.loadPosts)
    }).then(states => {
        const postIdToBeEdited = states[0].index.posts[0]._id
        const postIdActuallyBeingEdited = last(states).editPost.post._id
        assert(postIdToBeEdited == postIdActuallyBeingEdited, 'Correct post must be loaded')
      
    }))
})