import {createStore, combineReducers} from 'redux'
import {indexReducer, newPostReducer, existingPostReducer} from './reducers'

let store = createStore(combineReducers({index: indexReducer, newPost: newPostReducer, editPost: existingPostReducer}))

// thunk for async actions

let _dispatch = store.dispatch
store.dispatch = (action) =>
    typeof action == 'function' ? action(store) : _dispatch(action)


export default store

