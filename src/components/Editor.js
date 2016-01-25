import React from 'react'
import {Link} from 'react-router'
import store from './../actions/store'
import PostEditor from './PostEditor.js'


let createComponent = (isNew) => {
  
  let successMessage, action;

  if (isNew) {
    successMessage = 'New post added.'
    action = store.add
  } else {
    successMessage = 'Post updated.'
    action = store.update
  }
  
  return React.createClass({
    
    displayName: 'New-Or-Update-Post',
    
    render() {

      let isError = 'error' == store.state.newPostUI.status

      let messageContent;

      let self = this

      if (isError && !!store.state.newPostUI.errorField) {
        messageContent = 
          <a 
            href='javascript: void(0)' 
            onClick={_ => self.refs.newpost.refs[store.state.newPostUI.errorField].focus()}
          >Fix it</a>
      } else {
        messageContent = ''
      }

      return <div className='editor'>
        <PostEditor ref='newpost' post={store.state.newPost} onChange={(partial) => store.newPostUpdated(partial)} />
        <button type='button'
          disabled={'uploading' == store.state.newPostUI.status}
          onClick={store.add}>{isNew ? 'Post' : 'Update'}</button>

        <div className={'message' + isError ? 'error' : 'success'}>
          <div>{store.state.newPostUI.message}</div>
          {messageContent}
        </div>


        <div>{store.state.newPostUI.status}</div>
      </div>
    }
  })
}

export default {
  ExistingPostEditor: createComponent(false),
  NewPostEditor: createComponent(true)
}