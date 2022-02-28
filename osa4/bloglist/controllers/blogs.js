const express = require('express')
require('express-async-errors')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()

  response.status(201).json(result)
})


blogsRouter.put('/:id', async (request, response) => {
  const data = request.body

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: data.likes },
    { runValidators: true })

  if (result) {
    response.sendStatus(204)
  } else {
    response.sendStatus(404)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.deleteOne({ _id: request.params.id })

  if (result.deletedCount === 0) {
    response.sendStatus(404)
  } else {
    response.sendStatus(204)
  }
})

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
blogsRouter.use(errorHandler)

module.exports = blogsRouter