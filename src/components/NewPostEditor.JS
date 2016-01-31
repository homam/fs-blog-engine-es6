import React from 'react'
import {Link} from 'react-router'
import PostEditor from './PostEditor'
let {PropTypes} = React


export default React.createClass({
    render() {

        let self = this
        let {uiState, post, add, update} = self.props

        let isError = 'error' == uiState.status
        let isUploaded = 'uploaded' == uiState.status

        let messageContent;

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
                  <div>New post added.</div>
                  <a 
                    href='javascript: void(0)' 
                    onClick={_ => window.scrollTo(0, 0)}
                  >View it</a>
              </div>

        } else {
            
            messageContent = ''

        }


        return <div className='editor'>
                
            <PostEditor ref='newpost' post={post} onChange={update} />
            
            <div className='controls'>
                <button type='button'
                    disabled={'uploading' == uiState.status}
                    onClick={add}>Post
                </button>
            </div>

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
            title: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired
        }),
        update: PropTypes.func.isRequired,
        add: PropTypes.func.isRequired
    }
});