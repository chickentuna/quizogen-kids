import './App.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import io from './socket'
import ReactTimeAgo from 'react-time-ago'

async function wait (millis:number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, millis)
  })
}

const options = [
  'waifu',
  'whyfu',
  'wifu',
  'wifoo',
  'wife-u'
]

function App () {
  return (
    <div className='App'>

      <div className='img-container'>
        <img className='img' src='https://poulton.fun/placewaifu' />
      </div>
      <div className='words-container'>
        {options.map((option, idx) => (
          <div key={idx} className='option-container'>
            <button className='button-33' role='button'>{option}</button>
          </div>
        ))}
      </div>

      <div className='cat'>
        <div className='ear ear--left' />
        <div className='ear ear--right' />
        <div className='face'>
          <div className='eye eye--left'>
            <div className='eye-pupil' />
          </div>
          <div className='eye eye--right'>
            <div className='eye-pupil' />
          </div>
          <div className='muzzle' />
        </div>
      </div>

    </div>
  )
}

export default App
