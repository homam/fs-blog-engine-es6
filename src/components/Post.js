import React from 'react'
import {Link} from 'react-router'
import moment from 'moment'
import ReactMarkdown from 'react-markdown'

export default React.createClass({
    render() {
        let {post} = this.props
        return <article className='post'>
            <h2 className='title'>{post.title}</h2>
                <Link className='edit' to={'/edit/' + post._id}>Edit</Link>
            <div>
                <span>{moment(post._dateCreated).from()}</span>
            </div>
            <section className='header'>
                <ReactMarkdown source={post.header} softBreak='br' />
            </section>
            <section className='body'>
                <ReactMarkdown source={post.body} softBreak='br' />
            </section>
        </article>
    }
})
