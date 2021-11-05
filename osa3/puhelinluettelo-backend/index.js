const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.static('build'))
app.use(cors())

morgan.token('body', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

// Validate and parse parameters from query
const parameterValidation = {
    isInteger: property => (req, res, next) => {
        const value = parseInt(req.params[property])
        if (Object.is(NaN, value)) {
            return res.sendStatus(400)
        } else {
            res.locals[property] = value
            next()
        }
    }
}

const generateId = () => {
    const min = 0
    const max = Math.pow(2,32)
    
    // getRandomInt using a code from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
    
    return getRandomInt(min, max)
}

const parseAndValidateContact = contact => {
    var validContact = {}
    if (!contact.name) { // Name containing only whitespaces is okay
        return {
            isValid: false,
            error: 'name is required'
        }
    } else {
        validContact.name = contact.name
    }
    if (!contact.number) { // Number is a string so any except empty string or null is fine
        return {
            isValid: false,
            error: 'number is required'
        }
    } else {
        validContact.number = contact.number
    }
    return {
        isValid: true,
        error: undefined,
        contact: validContact
    }
}

app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const contact = req.body
    const validationResult = parseAndValidateContact(contact)
    if (validationResult.isValid) {
        const person = persons.find(person => person.number === contact.number)
        if (person) {
            res.status(400)
            res.json({
                error: 'name must be unique'
            })
        } else {
            const newId = generateId()
            persons.push({
                ...validationResult.contact,
                id: newId
            })
            res.sendStatus(201)
        }
    } else {
        res.status(400)
        res.json({
            error: validationResult.error
        })
    }
})

app.get('/api/persons/:id', parameterValidation.isInteger('id'), (req, res)=> {
    const person = persons.find(person => person.id === res.locals['id'])
    if (person) {
        res.json(person)
    } else {
        res.sendStatus(404)
    }
})

app.delete('/api/persons/:id', parameterValidation.isInteger('id'), (req, res) => {
    const index = persons.findIndex(person => person.id === res.locals['id'])
    console.log(index)
    if (index != -1) {
        persons.splice(index, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.get('/info', (req, res) => {
    const date = new Date()
    const response = "<div>Phonebook has info for " + persons.length + " people</div>"
        + "<br>"
        + "<div>" + date.toString() + "</div>"
    res.send(response)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})