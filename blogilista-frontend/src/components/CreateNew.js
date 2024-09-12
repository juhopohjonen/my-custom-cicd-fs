import React, { useState } from "react"
import blogService from '../services/blogs'

import { SuccessMessage, FailedMessage } from '../components/messages' 

const CreateNew = ({ setBlogs, blogs, createBlogFunc }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const [successMessage, setSuccessMessage] = useState(null)
    const [failedMessage, setFailedMessage] = useState(null)

    const [newVisible, setNewVisible] = useState(false)

    const showWhenVisible = { display: newVisible ? '' : 'none' }
    const showWhenHidden = { display: newVisible ? 'none' : '' }

    const sendBlog = async (event) => {
        event.preventDefault()

        let createdBlog = null
        
    
        try {
            // createdBlog = await blogService.sendBlogCreation({ title, author, url })    
            const createdBlog = await createBlogFunc({ title, author, url })
            console.log('createdBlog is', createdBlog)

            setSuccessMessage(`A new blog ${title} by ${author} added`)

            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000);

            setBlogs(blogs.concat(createdBlog))

            setNewVisible(false)

        } catch (e) {

            setFailedMessage('Blog creation failed.')

            setTimeout(() => {
                setFailedMessage(null)
            }, 5000);
        }


    }

    return (
        <div>
            <SuccessMessage message={successMessage} />
            <FailedMessage message={failedMessage} />

            <h2>create new</h2>

            <button style={showWhenHidden} onClick={() => setNewVisible(!newVisible)}>new note</button>

            <form onSubmit={sendBlog} style={showWhenVisible}>
                <div>title:<input id="titleinput" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div>author:<input id="authorinput" value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
                <div>url:<input id="urlinput" value={url} onChange={(e) => setUrl(e.target.value)} /></div>

                <input type='submit' id="createButton" value={'create'} />
            </form>
            <button style={showWhenVisible} onClick={() => setNewVisible(false)}>cancel</button>
        </div>
    )
}

export default CreateNew