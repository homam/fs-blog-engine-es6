import expect from 'expect'
import assert from 'assert'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import store from 'src/actions/store'
import App from 'src/App'

// here I'm showcasing a general way of testing redux actions and store state transitions
// many tests are to be written


// utility function that record every state transition in the store
// for every test case
// condition :: (State, [State]) => Boolean
// indicates when to run the test cases
const recordStates = (condition) => new Promise((resolve, reject) => {
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
            setTimeout( _ => resolve(posts), 10)
        ),
        add_: _ => new Promise((resolve) => 
            setTimeout( _ => resolve(posts), 10)
        ),
        add: (post) => new Promise((resolve) =>
            setTimeout(_ => {
                post._id = new Date().valueOf()
                resolve(post)
            }, 10)
        )
    }
}()

// async action creators using the mock api

const actions = require('src/actions/actions-creator')(mockApi)

describe('Index route', _ => {
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
        assert(2 == states.length, 'Expected 2 state transitions for actions.loadPosts')
        assert.deepEqual(["loading", "loaded"], states.map(s => s.index.status), 
            'Expected loading and loaded state transitions for actions.loadPosts()')
    }))
})

describe('Adding a new Post', _ => {
    specify('add a post', () => new Promise((resolve) =>
    {
        recordStates(({newPost:{newPostUI}, index}) => newPostUI.status == 'uploaded' && index.status == 'loaded').then(resolve)
        store.dispatch(actions.addPost({title: 'title', header: 'header', body: 'body'}))
    }).then(states => {
        assert.deepEqual(["uploading", "uploaded"], states.map(s => s.newPost.newPostUI.status), 
            'Expected uploading and uploaded state transitions')
    }))
})