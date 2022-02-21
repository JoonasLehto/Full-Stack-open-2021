const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

console.log(password)

const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.gnvbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

async function main(name, number) {
  if (name && number) {
    const person = new Person({
      name,
      number
    })

    const result = await person.save()
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  } else {
      const result = await Person.find({})
      console.log("phonebook:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
  }
}


main(name, number)