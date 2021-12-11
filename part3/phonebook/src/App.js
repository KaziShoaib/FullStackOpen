import React, {useState, useEffect} from "react"

import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import Notification from "./components/Notification"

import phonebookService from "./services/phonebook"

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterText, setFilterText] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(()=>{
    phonebookService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType}/>
      <Filter filterText={filterText} setFilterText={setFilterText}/>
      <h3>Add a new</h3>
      <PersonForm 
        persons={persons} 
        setPersons={setPersons} 
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} persons={persons} setPersons={setPersons}/>
    </div>
  )
}

export default App;
