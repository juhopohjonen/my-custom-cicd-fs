const buildController = require('express').Router()
const Build = require('../models/build')
const build = require('../models/build')

const BUILD_AUTHENTICATION_KEY = process.env.BUILD_AUTHENTICATION_KEY
if (!BUILD_AUTHENTICATION_KEY) {
    throw new Error('No build auth key!')
}

buildController.get('/', async (req, res) => {
    const builds = await build.find({})
    return res.send(builds)
})

buildController.post('/', async (req, res) => {
    const { commitId, githubUsername, status } = req.body

    let token = null

    try {
        token = req.headers.authorization.split(' ')[1]
    } catch (e) {
        console.error('error in build authentication header', e)
        return res.status(401).end()
    }

    if (!token || token !== BUILD_AUTHENTICATION_KEY) {
        return res.status(401).end()
    }

    const newBuild = new Build({
        commitId,
        githubUsername,
        status
    })

    await newBuild.save()

    return res.send(newBuild)
    
})

module.exports = buildController