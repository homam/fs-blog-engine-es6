import React from 'react'
import {Link} from 'react-router'
import store from './../actions/store'
import PostEditor from './PostEditor.js'
let {PropTypes} = React

let createComponent = (isNew) => {
  
  let successMessage, action;

  if (isNew) {
    successMessage = 'New post added.'
    action = store.add
  } else {
    successMessage = 'Post updated.'
    action = store.update
  }
  
  let component = React.createClass({
    
    displayName: 'New-Or-Update-Post',
    
    render() {

      let self = this

      let isError = 'error' == self.props.uiState.status

      let messageContent;


      if (isError && !!self.props.uiState.errorField) {
        messageContent = 
          <a 
            href='javascript: void(0)' 
            onClick={_ => self.refs.newpost.refs[self.props.uiState.errorField].focus()}
          >Fix it</a>
      } else {
        messageContent = ''
      }

      return <div className='editor'>
        <PostEditor ref='newpost' post={self.props.post} onChange={self.props.update} />
        <button type='button'
          disabled={'uploading' == self.props.uiState.status}
          onClick={self.props.add}>{isNew ? 'Post' : 'Update'}</button>

        <div className={'message' + isError ? 'error' : 'success'}>
          <div>{self.props.uiState.message}</div>
          {messageContent}
        </div>


        <div>{self.props.uiState.status}</div>
      </div>
    }
  })


  
  component.propTypes = {
    uiState: PropTypes.shape({
      status: PropTypes.string.isRequired,
      message: PropTypes.string,
      error: PropTypes.string,
      errorField: PropTypes.string
    }),
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired
    }),
    update: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired
    
  }

  return component
}

export default {
  ExistingPostEditor: createComponent(false),
  NewPostEditor: createComponent(true)
}