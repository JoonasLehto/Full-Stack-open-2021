const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

// Middleware //

app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())

morgan.token('body', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

// Endpoints //

app.get('/info', async (req, res) => {
  const date = new Date()
  const result = await Person.find({})
  const response = '<div>Phonebook has info for ' + result.length + ' people</div>'
    + '<br>'
    + '<div>' + date.toString() + '</div>'
  res.send(response)
})

app.get('/api/persons', async (req, res) => {
  const result = await Person.find({})

  res.json(result)
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const data = req.body
    const existingPerson = await Person.findOne({ name: data.name })

    if (existingPerson) {
      res.status(400)
      res.json({
        error: 'name must be unique'
      })
    } else {
      const newPerson = new Person({
        name: data.name,
        number: data.number
      })

      const result = await newPerson.save()

      res.status(201).json(result)
    }
  } catch(error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await Person.findById(req.params.id)

    if (result) {
      res.json(result)
    } else {
      res.sendStatus(404)
    }
  } catch(error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const data = req.body

    const result = await Person.findByIdAndUpdate(
      req.params.id,
      { number: data.number },
      { runValidators: true })

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch(error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await Person.deleteOne({ _id: req.params.id })

    if (result.deletedCount === 0) {
      res.sendStatus(404)
    } else {
      res.sendStatus(204)
    }
  } catch(error) {
    next(error)
  }
})

// Error handling //

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// Start server //

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})