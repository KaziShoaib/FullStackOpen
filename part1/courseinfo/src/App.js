import React from 'react'

const Header = (props) => {
  const {name} = props.course
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

const Content = (props) => {
  const {parts} = props.course
  return (
    <div>
      <Part partName={parts[0].name} noOfExercises={parts[0].exercises} />
      <Part partName={parts[1].name} noOfExercises={parts[1].exercises} />
      <Part partName={parts[2].name} noOfExercises={parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  const {parts} = props.course
  return (
    <p>
      Number of exercises {parts[0].exercises+parts[1].exercises+parts[2].exercises}
    </p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App