import { useState } from "react"
import React from "react"
import blogLogin from '../services/blogs'

const Blog = ({blog, blogs, setBlogs, user, likeFunction}) => {

  const [showAll, setShowAll] = useState(false)
  const toggleShow = () => setShowAll(!showAll)

  const [blogLikes, setBlogLikes] = useState(blog.likes)
  
  const [display, setDisplay] = useState(true)

  const blogStyle = {
    border: 'solid',
    borderWidth: 0.1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    display: display ? '' : 'none',

    color: 'black'
  }

  if (!showAll) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleShow}>view</button>
      </div>
    )
  }


  const removeBlog = async blog => {
    let confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
  
    if (!confirmation) { 
      return
    }
  
    try {
      blogLogin.removeBlog(blog)
      setDisplay(false)
    } catch (e) {
      alert('blog remove failed.')
      console.log(e.message)
    }
  }

  const likeBlog = async blog => {

    let newBlogLikes = blogLikes + 1


    let blogObject = {
      user: blog.user,
      likes: newBlogLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }


    try {
      const returnedBlog = await blogLogin.changeBlog(blogObject)

    } catch (e) {
      alert('Liking the blog failed!')
    }

  }

  console.log('blog', blog)

  const username = user.username

  return (
    <div style={blogStyle} className='togglableContent'>
      {blog.title} <button onClick={toggleShow}>hide</button>
      <br />
      {blog.url}
      <br />
      <div>likes</div> {blogLikes}<button className="likeBlog" onClick={async (event) => {
        const likes = await likeFunction(blog, blogLikes)
        setBlogLikes(likes)
      }}>like</button>
      <br />
      {blog.author}
      <br />
      {!blog.user ? null : blog.user.username === username && <button onClick={() => removeBlog(blog)}>remove</button>}
      
    </div>
  )

}

export default Blog