import './App.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import io from './socket'
import ReactTimeAgo from 'react-time-ago'


async function wait (millis:number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, millis)
  })
}


function App () {

  return (
    <div className='App'>
      <header className='App-header'>
        
      </header>
    </div>
  )
}

export default App
