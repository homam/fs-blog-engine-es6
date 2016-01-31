import React from 'react'
import {Link} from 'react-router'
import PostEditor from './PostEditor'
import Dialog from './Dialog'
let {PropTypes} = React


export default React.createClass({
    render() {

        let self = this
        let {uiState, deleteStatus, post, add, update, remove, removeConfirm, removeCancel, restore} = self.props

        let isError = 'error' == uiState.status
        let isUploaded = 'uploaded' == uiState.status
        let isDeleted = 'deleted' == deleteStatus

        let messageContent, dialog, controls;

        if (isError) {
           
            let fixLink;

            if(!!uiState.errorField) {
                fixLink = <a 
                    href='javascript: void(0)' 
                    onClick={_ => self.refs.newpost.refs[uiState.errorField].focus()}
                >Fix it</a>
            } else {
                fixLink = ''
            }

            messageContent = 
              <div className='message error'>
                <div>{uiState.message}</div>
                  {fixLink}
              </div>
              
        } else if (isUploaded) {

            messageContent = 
              <div className='message success'>
                <div>Post updated.</div>
                <Link to='/'>Back to home</Link>
              </div>

        } else if(isDeleted) {

            messageContent = 
              <div className='message success'>
                <div>Post deleted.</div>
                <a 
                  href='javascript: void(0)' 
                  onClick={restore}
                >Restore it</a>
              </div>

        } else {
            messageContent = ''
        }

        if('confirm' == deleteStatus) {

            dialog = <Dialog
                question='Are you sure you want to delete this post?'
                onNo={removeCancel}
                onYes={remove} />

        } else {
            dialog = ''
        }


        if(!isDeleted) {

            let disabled = 'deleting' == deleteStatus || 'uploading' == uiState.status

            controls = 
                <div className='controls'>
                    <button type='button'
                        disabled={disabled}
                        onClick={removeConfirm}>Delete
                    </button>
                    <button type='button'
                        disabled={disabled}
                        onClick={add}>Update
                    </button>
                </div>

        } else {
            controls = ''
        }


        return <div className='editor'>
            
            {dialog}    

            <PostEditor ref='newpost' post={post} onChange={update} />
            
            {controls}

            {messageContent}

        </div>
    },

    propTypes: {
        uiState: PropTypes.shape({
            status: PropTypes.string.isRequired,
            message: PropTypes.string,
            errorField: PropTypes.string
        }),
        post: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired
        }),
        update: PropTypes.func.isRequired,
        add: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        removeConfirm: PropTypes.func.isRequired,
        removeCancel: PropTypes.func.isRequired,
        restore: PropTypes.func.isRequired,
        deleteStatus: PropTypes.string.isRequired
    }
});