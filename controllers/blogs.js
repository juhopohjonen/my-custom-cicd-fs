
const blogsRouter = require('express').Router()
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')



const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .populate('user')
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', async (request, response) => {

    const token = getTokenFrom(request)

    if (!token) {
      return response.status(401).json({error: 'token missing or invalid' })
    }

    const decodedToken = request.token
    
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token is invalid'})
    }

    const title = request.body.title
    const author = request.body.author
    const url = request.body.url
    const likes = request.body.likes != undefined ? request.body.likes : 0

    const user = await User.findById(decodedToken.id)

    if (title === undefined || url === undefined) {
      response.status(400).end()
    }

    else {

      // fetch user from database + add add id to post

      const userList = await User.find({})
      const blogList = await Blog.find({})

      console.log('userlist fetch successfuill')

      console.log('current user id is', user.id)

      const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: likes,
        creatorId: user.id,
        user: user.id
      })
    
      blog.populate('user')

      blog
        .save()
        .then(result => {
          response.status(201).json(result)
          user.blogs = user.blogs.concat(result._id)
          user.save()
        })
      }

  })

blogsRouter.delete('/:id', async (request, response, next) => {

  const id = request.params.id

  const blog = await Blog.findById(id).populate('user')
  
  if (!blog) {
    return response.status(400).end()
  } else if (!request.user) {
    return response.status(401).end()
  }

  if (blog.user._id.toString() !== request.user._id.toString()) {
    return response.status(401).send('Unauthorized or no priviledge')
  }

  try {
    await Blog.deleteOne({_id: id})
    response.send('ok')
  } catch (e)
  {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

    
  try {
    const newBlog = {
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.json(updatedBlog)
  } catch (e) {
    next(e)
  }




})

module.exports = blogsRouter