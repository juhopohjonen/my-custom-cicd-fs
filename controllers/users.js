const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !name || !password) {
        return response.status(400).json({
            error: 'invalid user: not enough data'
        })
    }

    if (username.legth < 3 || password.length < 3) {
        return response.status(400).json({
            error: 'invalid data: password/username too short'
        })   
    }

    const sameUsernameUser = await User.find({ username: username })

    if (sameUsernameUser.length !== 0) {
        return response.status(400).json({
            error: 'invalid user: user with username already exists.'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    user.populate('blogs')

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})


module.exports = usersRouter