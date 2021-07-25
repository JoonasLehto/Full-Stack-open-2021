import React, { useState, useEffect } from 'react'

import personService from './services/persons'

import Notification from './components/notification'

const Filter = ({ options }) => {
  return (
    <div>
      filter shown with: <input
        value={options.value}
        onChange={options.onChange}
        />
    </div>
  )
}

const Button = ({ text, method }) => {
  return (
    <button onClick={method}>{text}</button>
  )
}

const PersonForm = ({ options }) => {
  return (
    <form onSubmit={options.onSubmit}>
        <div>
          name: <input
            value={options.nameInput.value}
            onChange={options.nameInput.onChange}
            />
        </div>
        <div>
          number: <input
            value={options.numberInput.value}
            onChange={options.numberInput.onChange}
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ persons, filter, removeAction }) => {
  const filteredPersons = persons.filter(person => {
    return person.name.toLowerCase().includes(filter.toLowerCase())
  })

  const removeConfirm = toBeRemoved => () => {
    if (window.confirm(`Delete ${toBeRemoved.name}`)) {
      removeAction(toBeRemoved)
    }
  }

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.name}>
          <span style={{ marginRight: "10px" }}>{`${person.name} ${person.number}`}</span>
          <Button text="delete" method={removeConfirm(person)}/>
        </div> 
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const getAllPersons = () => personService.getAllPersons()
    .then(data => {
      setPersons(data)
    })

  useEffect(() => { getAllPersons() }, [])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ filter, setFilter ] = useState('')

  const [ notification, setNotification] = useState({
    message: null,
    isError: false
  })
  var clearMessageTimeout = undefined


  const displayMessage = message => {
    if (clearMessageTimeout) {
      clearTimeout(clearMessageTimeout)
    }
    setNotification(message)
    clearMessageTimeout = setTimeout(() => {
      setNotification({
        message: null,
        isError: false
      })
    }, 5000)
  }

  const handleChange = updateMethod => event => {
    updateMethod(event.target.value)
  }

  const addOrUpdatePerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(element => {
      return element.name === newName
    })

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (existingPerson === undefined) {
      personService.createPerson(newPerson)
        .then(() => {
          displayMessage({
            message: `Added ${newPerson.name}`,
            isError: false
          })
          setNewName('')
          setNewNumber('')
          getAllPersons()
        })
    } else {
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService.updatePerson(existingPerson.id, newPerson)
          .then(() => {
            displayMessage({
              message: `Updated ${newPerson.name}`,
              isError: false
            })
            setNewName('')
            setNewNumber('')
            getAllPersons()
          })
          .catch(error => {
            if (error && error.response && error.response.status === 404) {
              displayMessage({
                message: `Information of ${newPerson.name} has already been removed from server`,
                isError: true
              })
            } else {
              displayMessage({
                message: `Unknown error occurred while deleting ${newPerson.name} from server`,
                isError: true
              })
            }
            getAllPersons()
          })
      }
    }
  }

  const removePerson = person => {
    personService.deletePerson(person.id)
        .then(() => {
          displayMessage({
            message: `Deleted ${person.name}`,
            isError: false
          })
          getAllPersons()
        })
        .catch(error => {
          if (error && error.response && error.response.status === 404) {
            displayMessage({
              message: `Information of ${person.name} has already been removed from server`,
              isError: true
            })
          } else {
            displayMessage({
              message: `Unknown error occurred while deleting ${person.name} from server`,
              isError: true
            })
          }
          getAllPersons()
        })
  }

  const filterOptions = {
    value: filter,
    onChange: handleChange(setFilter)
  }

  const formOptions = {
    onSubmit: addOrUpdatePerson,
    nameInput: {
      value: newName,
      onChange: handleChange(setNewName)
    },
    numberInput: {
      value: newNumber,
      onChange: handleChange(setNewNumber)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} isError={notification.isError} />
      <Filter options={filterOptions} />
      <h3>Add a new</h3>
      <PersonForm options={formOptions} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} removeAction={removePerson} />
    </div>
  )
}

export default App