const bcrypt = require('bcrypt')
const express = require('express')
require('express-async-errors')
const usersRouter = express.Router()
const User = require('../models/user')
const logger = require('../utils/logger')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate(
    'blogs',
    {'title': 1, 'author': 1, 'url': 1, 'likes': 1, 'id': 1}
    )

  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "Password must be atleast 3 characters"
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const result = await user.save()

  response.status(201).json(result)
})

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && /E11000 duplicate key error collection/.test(error.message)) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
usersRouter.use(errorHandler)

module.exports = usersRouter