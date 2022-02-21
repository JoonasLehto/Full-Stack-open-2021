import React, { useState, useEffect } from 'react'

const App = () => {
  const t = [{v: 1}, {v: 2}, {v: 3}]

  const val = t.map(o => {o.v}).reduce((s, o) => s + o, 0) 
  return ( <div> {val} </div> )
}

export default App