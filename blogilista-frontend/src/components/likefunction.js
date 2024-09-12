import blogService from '../services/blogs'

const likeBlog = async (blog, likes) => {

    let newBlogLikes = blog.likes + 1


    let blogObject = {
      user: blog.user,
      likes: newBlogLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }


    try {
        const returnedBlog = await blogService.changeBlog(blogObject)
        console.log('blog likes are', newBlogLikes)
        return newBlogLikes
    } catch (e) {
        console.log('caught async ex', e.message)
    }



}

export default likeBlog