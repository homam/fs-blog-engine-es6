import React from 'react'
import {findDOMNode} from 'react-dom'

export default React.createClass({
  displayName: 'PostEditor',
  
  render() {
    let post = !!this.props.post ? this.props.post : {title: '', headr: '', body: ''}
    let self = this
    let onChange = (obj) => self.props.onChange(obj)
    return <div>
      <div>
        <input ref='title' className='title' placeholder='Title'
          value={post.title}
          onChange={(event) => onChange({title: event.target.value})}
        />
      </div>
      <div>
        <textarea ref='header' className='header' placeholder='Header'
          value={post.header}
          onChange={(event) => onChange({header: event.target.value})}
        />
      </div>
      <div>
        <textarea ref='body' className='body' placeholder='Body'
          value={post.body}
          onChange={(event) => onChange({body: event.target.value})}
        />
      </div>
    </div>
  }
})
