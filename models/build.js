const mongoose = require('mongoose')

const buildSchema = mongoose.Schema({
    commitId: String,
    githubUsername: String,
    status: String
})

buildSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Build = mongoose.model('Build', buildSchema)

module.exports = Build