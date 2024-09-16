const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const buildController = require('./controllers/builds')

const app = express()
mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('connected to mongodb')
})
.catch((error) => {
    logger.error('error connection to mongodb', error.message)
})

const tokenExtractor = (request, response, next) => {
    
    var token = null

    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }
    
    const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null
    request.token = decodedToken
    

    next()
}

const userExtractor = async (request, response, next) => {
    const user = request.token !== null ? await User.findById(request.token.id) : null
    request.user = user    

    next()
}

app.use(express.static('dist'))


app.use(cors())
app.use(express.json())

app.use('/api/builds', buildController)

app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
	const testRouter = require('./controllers/tests')
	app.use('/api/testing', testRouter)
}

module.exports = app
