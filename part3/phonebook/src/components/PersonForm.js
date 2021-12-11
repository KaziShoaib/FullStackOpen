import React, {useState} from "react"

import phonebookService from "../services/phonebook"

const PersonForm = ({persons, setPersons, setMessage, setMessageType}) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const clearField = () => {
    setNewName('')
    setNewNumber('')
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    
    if(persons.map(person=>person.name).includes(newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const _id = persons.filter(person => person.name === newName)[0].id
        const editedPerson = {
          id: _id,
          name: newName,
          number : newNumber
        }
        phonebookService
          .update(editedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          })
          .catch(error => {
            console.log(error)
            setMessageType('error')
            setMessage(`Information of ${newName} has been removed from server`)
            setPersons(persons.filter(person => person.id !== _id))
            clearField()
          })
      }
      
    }
    else { 
      const newPerson = {
        name: newName,
        number: newNumber
      }     
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessageType('success')
          setMessage(`${newName} added`)
          clearField() 
        })
           
    }
  }

  return (
    <form onSubmit={handleSubmit}>
    <div>name: <input value={newName} onChange={handleNameChange}/></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
    <div><button type="submit">add</button></div>

    </form>
  )
}

export default PersonForm