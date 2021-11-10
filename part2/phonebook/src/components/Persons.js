import React from "react"

import phonebookService from "../services/phonebook"

const Person = ({person, removePerson}) => {
  return (
    <p>
      {person.name} {person.number} 
      <button onClick={removePerson}>Delete</button>
    </p>
  )
}

const Persons = ({personsToShow, persons, setPersons}) => {
  
  const handleDelete = ({name, id}) => {   
    
    if(window.confirm(`Want to delete ${name}?`)){
      phonebookService
        .remove(id)
        .then(returnedObject => {
          console.log(returnedObject)
          setPersons(persons.filter(person => person.id !== id))
        })
    }    
  }

  return (
    <div>
      {personsToShow.map(person => 
        <Person 
          key={person.name} 
          person={person} 
          removePerson={() => handleDelete(person) }
        />
      )}
    </div>
  )
}

export default Persons