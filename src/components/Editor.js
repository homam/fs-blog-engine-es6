import React from 'react'
import {Link} from 'react-router'
import store from './../actions/store'
import actions from '../actions/actions'
import PostEditor from './PostEditor'
import Dialog from './Dialog'
let {PropTypes} = React

let createComponent = (isNew) => {
  
  let successMessage;

  if (isNew) {
    successMessage = 'New post added.'
  } else {
    successMessage = 'Post updated.'
  }
  
  let component = React.createClass({
    
    render() {

      let self = this
      let {uiState, deletePostStatus} = self.props

      let isError = 'error' == uiState.status

      let messageContent;


      if (isError && !!uiState.errorField) {
        messageContent = 
          <div className='message error'>
            <div>{uiState.message}</div>
              <a 
                href='javascript: void(0)' 
                onClick={_ => self.refs.newpost.refs[uiState.errorField].focus()}
              >Fix it</a>
          </div>
      } else if ('uploaded' == uiState.status) {

        let viewLink = _ => {
          if (isNew) {
            return
              <a 
                href='javascript: void(0)' 
                onClick={_ => window.scrollTo(0, 0)}
              >View it</a>
          } else {
            return <Link to='/'>Back to home</Link>
          }
        }()

        messageContent = 
          <div className='message success'>
              <div>{successMessage}</div>
              {viewLink}
          </div>
      } else {
        messageContent = ''
      }

      let deleteButton = _ => {
        if (!isNew) {
          return <button type='button'
            disabled={'uploading' == uiState.status}
            onClick={_ => store.dispatch({type: 'EDIT_POST_DELETE'})}>Delete
          </button>
        } else {
          return ''
        }
      }()

      let dialog = _ => {
        if('confirm' == deletePostStatus) {
          return  <Dialog
            question='Are you sure you want to delete this post?'
            onNo={_ => store.dispatch({type: 'EDIT_POST_DELETE_NO'})}
            onYes={_ => store.dispatch(actions.deletePost(self.props.post._id))} />
        } else {
          return ''
        }
      }()

      return <div className='editor'>
        
        {dialog}

        <PostEditor ref='newpost' post={self.props.post} onChange={self.props.update} />
        
        <div className='controls'>
          {deleteButton}

          <button type='button'
            disabled={'uploading' == uiState.status}
            onClick={self.props.add}>{isNew ? 'Post' : 'Update'}
          </button>
        </div>

          {messageContent}


        <div>{uiState.status}</div>
      </div>
    }
  })


  
  component.propTypes = {
    uiState: PropTypes.shape({
      status: PropTypes.string.isRequired,
      message: PropTypes.string,
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