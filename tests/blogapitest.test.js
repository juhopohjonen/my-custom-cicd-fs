const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let testUser = null
let testUserJwt = null

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
]

beforeAll(async () => {
  // create a test user

  const passwordHash = bcrypt.hashSync('testpass', 12)

  testUser = new User({
    username: 'testuser',
    name: 'testname',
    passwordHash
  })

  await testUser.save()

  const userForToken = {
    username: testUser.username,
    id: testUser._id
  }

  testUserJwt = jwt.sign(userForToken, process.env.SECRET)
})

beforeEach(async () => {

    await Blog.deleteMany({})

    for (var i = 0; i < initialBlogs.length; i++) {
        let blogObject = new Blog({ ...initialBlogs[i], user: testUser._id })
        await blogObject.save()
    }
})

test('fetch initial blogs', async () => {
    const response = await api.get('/api/blogs', {
      
    })
    .expect('Content-Type', /application\/json/)
    
    expect(response.body.length).toEqual(initialBlogs.length)
})

test('make sure that id is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})


describe('post test', () => {
    const newTestPost = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }

    const partialPost = {
      likes: 5,
      author: "Pekka Timo"
    }
    
    test('will posting succeed', async () => {
        await 
          api.post('/api/blogs')
          .send(newTestPost)
          .set('Authorization', `Bearer ${testUserJwt}`)

        

        const response = await api.get('/api/blogs')
        expect(response.body.length).toEqual(initialBlogs.length + 1)


    })

    test('no title and url', async () => {
      await api.post('/api/blogs')
        .send(partialPost)
        .set('Authorization', `Bearer ${testUserJwt}`)
        .expect(400)
    })
})


describe('like handling', () => {
  const testPostWithoutLike = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  }

  test('new post without a like property', async () => {
    await api.post('/api/blogs')
      .send(testPostWithoutLike)
      .set('Authorization', `Bearer ${testUserJwt}`)


    const response = await api.get('/api/blogs')


    const responseBlog = response.body.find(blog => blog.title === testPostWithoutLike.title)

    expect(responseBlog.likes).toEqual(0)
  })
})


test('remove a post with id', async () => {


  let blogRefercence = `/api/blogs/${initialBlogs[0]._id.toString()}`

  

  await api.delete(blogRefercence).set('Authorization', `Bearer ${testUserJwt}`)
  const response = await api.get('/api/blogs')

  var doesExist = false

  for (var i = 0; i < response.body.length; i++) {
    let blog = response.body[i]

    if (blog.url == initialBlogs[0].url) {
      doesExist = true
      break
    }
  }

  expect(doesExist).toEqual(false)
})


describe('put test', () => {
  let query = {
    'likes': 10000
  }

  let apiUrl = `/api/blogs/${initialBlogs[0]._id.toString()}`

  test('is it possible to change like amount', async () => {
    try {
      await api.put(apiUrl).send(query)
    } catch (e) {
      next(e)
    }


    const response = await api.get('/api/blogs')
    const targetBlog = response.body[0]
    
    expect(targetBlog.likes).toEqual(query.likes)

  })
})


afterAll (() => {
    mongoose.connection.close()
})