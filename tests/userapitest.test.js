const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

jest.setTimeout(15000)


describe('user creation filtering test', () => {
    const uncompleteUser = {
        username: 'pekka'
    }

    const tooShortUser = {
        'username': 'jo',
        'password': 'pa',
        'name': 'timo pekkala'
    }

    test('uncomplete user creation', async () => {
        const initialUsers = await User.find({})
        await api.post('/api/users').send(uncompleteUser)    

        const currentUsers = await User.find({})

        expect(initialUsers.length).toEqual(currentUsers.length)
    })
})