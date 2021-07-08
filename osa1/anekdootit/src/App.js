import React, { useState } from 'react'

const Button = ({ text, method }) => {
  return (
    <button onClick={method}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(anecdotes.map(() => 0))
  const [mostVotes, setMostVotes] = useState({ index: 0, value: 0 })

  const voteSelected = () => {
    const newVotes = { ...votes }
    newVotes[selected] += 1
    setVotes(newVotes)
    if (newVotes[selected] > mostVotes.value) {
      setMostVotes({
        index: selected, value: newVotes[selected]
      })
    }
  }

  const selectRandom = () => {
    return setSelected(
      Math.floor(Math.random() * anecdotes.length)
      )
  }

  return (
    <div>
      <section>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>has {votes[selected]} votes</p>
        <div>
          <Button text="vote" method={voteSelected}></Button>
          <Button text="next anecdote" method={selectRandom}></Button>
        </div>
      </section>
      <section>
        <h2>Anecdote with most votes</h2>
        <p>{anecdotes[mostVotes.index]}</p>
        <p>has {votes[mostVotes.index]} votes</p>
      </section>
    </div>
  )
}

export default App