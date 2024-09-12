import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateNew from './components/CreateNew'
import { SuccessMessage, FailedMessage } from './components/messages'

const Blogs = ({ blogs, user, logoutFunc, setBlogs }) => {



  const likeBlog = async (blog, likes) => {

    let newBlogLikes = likes + 1


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
      alert('Liking the blog failed!')
    }

  }

  const createBlog = ({ author, title, url }) => {
    const blogCreation = blogService.sendBlogCreation({ author, title, url })
    return blogCreation
  }

  return (
    <div>

      <h2>blogs</h2>
      <p id='loggedInView'>{user.name} logged in<button onClick={logoutFunc}>logout</button></p>
      {blogs.map(blog => <Blog likeFunction={likeBlog} user={user} blogs={blogs} setBlogs={setBlogs} key={blog.id} blog={blog} />)}
    
      <CreateNew 
        setBlogs={setBlogs} 
        blogs={blogs}
        createBlogFunc={createBlog}
      
      />
    </div>
  )
}

const SignIn = ({ setUserState, visibility, toggleVisibility }) => {

  console.log('visibility is ', visibility)

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const [successMessage, setSuccessMessage] = useState(null)
  const [failedMessage, setFailedMessage] = useState(null)


  const changeName = (e) => {
    setUserName(e.target.value)
  }

  const changePass = (e) => {
    setPassword(e.target.value)
  }

  if (!visibility && !window.localStorage.getItem('loggedInUser')) {
    return <button onClick={toggleVisibility}>log in</button>
  }

  const submitLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUserState(user)

      setUserName('')
      setPassword('')
    } catch (e) {
      setFailedMessage('wrong credintials!')
      setTimeout(() => {
        setFailedMessage(null)
      }, 5000)
    }
  }

  return (
    <div id='loginDiv'>

      <SuccessMessage id='success' message={successMessage} />
      <FailedMessage id='failed' message={failedMessage} /> 
      <h2>log in to application</h2>
      <form onSubmit={submitLogin}>
        <div>
          username
          <input id='username' value={username} onChange={changeName} />
        </div>
        <div>
          password
          <input type={'password'} id='pass' value={password} onChange={changePass} />
        </div>

        <input type='submit' id='submit' />
      </form>

      <button onClick={toggleVisibility}>cancel</button>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [loginVisible, setLoginVisible] = useState(true)

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }
  const toggleLoginVisibility = () => setLoginVisible(!loginVisible)

  const [user, setUser] = useState(null)
  const logout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }


  useEffect(() => {
    blogService.getAll().then(blogs => {
      let sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)
      sortedBlogs.reverse()
      setBlogs(sortedBlogs)
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  return (
    <div>
      {user !== null 

      ? <Blogs blogs={blogs} user={user} logoutFunc={logout} setBlogs={setBlogs} />
      : <SignIn setUserState={setUser} visibility={loginVisible} toggleVisibility={toggleLoginVisibility} />}
    </div>
  )
}

export default App
