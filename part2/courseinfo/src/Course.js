import React from "react"

const Header = ({name}) => {
  return (
    <h1>{name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.partName} {props.noOfExercises}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} partName={part.name} noOfExercises={part.exercises}/>)}
    </div>
  )
}

const Total = ({parts}) => {
  const total = parts.map(part => part.exercises).reduce((a, b) => a + b)
  return (
    
    <p>
      <b>total of {total} exercises</b>
    </p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course