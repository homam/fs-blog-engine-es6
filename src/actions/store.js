import {createStore, combineReducers} from 'redux'
import {indexReducer, newPostReducer, existingPostReducer} from './reducers'

// trace utility
const trace = (what, f) => {
    console.info(what)
    return f()
}


const store = createStore(combineReducers({index: indexReducer, newPost: newPostReducer, editPost: existingPostReducer}))

// thunk for async actions

const _dispatch = store.dispatch
store.dispatch = (action) =>
    typeof action == 'function' ? action(store) : trace(action.type, _ => _dispatch(action))


export default store

