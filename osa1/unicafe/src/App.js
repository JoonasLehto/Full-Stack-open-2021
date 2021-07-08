import React, { useState } from 'react'

const Button = ({ text, method }) => {
  return (
    <button onClick={method}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <h3>No feedback given</h3>
      </div>
    )
  } else {
    const average = (good - bad) / all
    const positiveString = (good / all * 100) + " %"
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}></StatisticLine>
          <StatisticLine text="neutral" value={neutral}></StatisticLine>
          <StatisticLine text="bad" value={bad}></StatisticLine>
          <StatisticLine text="all" value={all}></StatisticLine>
          <StatisticLine text="average" value={average}></StatisticLine>
          <StatisticLine text="positive" value={positiveString}></StatisticLine>
        </tbody>
      </table>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text="good" method={() => setGood(good + 1)}></Button>
        <Button text="neutral"  method={() => setNeutral(neutral + 1)}></Button>
        <Button text="bad"  method={() => setBad(bad + 1)}></Button>
      </div>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App