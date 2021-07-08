import React from 'react'

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ course }) => {
  const items = [];
  
  course.parts.forEach((value, index) => {
    items.push(
      <Part name={value.name} exercises={value.exercises} key={index} />
    )
  })

  return (
    <div>
      {items}
    </div>
  )
}

const Total = ({ course }) => {
  var total = 0;

  course.parts.forEach(value => {
    total += value.exercises;
  })

  return (
    <p>Number of exercises {total}</p>
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
      },
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