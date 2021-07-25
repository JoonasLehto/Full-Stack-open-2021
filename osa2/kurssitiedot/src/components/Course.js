import React from 'react'

const Course = ({ course }) =>  {
    return (
    <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
    )
}

const Header = ({ name }) => {
    return (
        <h1>{name}</h1>
    )
}

const Part = ({ name, exercises }) => {
    return (
        <p>
        {name} {exercises}
        </p>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
        {parts.map(value => (
            <Part name={value.name} exercises={value.exercises} key={value.id} />
        ))}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((s, p) =>  s + p.exercises, 0)

    return (
        <p>Number of exercises {total}</p>
    )
}

export default Course