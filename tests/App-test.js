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

      const state = store.getState().index      
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
            setTimeout( _ => resolve(posts), 100)
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
        recordStates(({status}) => 'loaded' == status).then(resolve)
        store.dispatch(actions.loadPosts)
    }).then(state => {
        assert(2 == state.length, 'Expected state transitions for actions.loadPosts')
    }))
})