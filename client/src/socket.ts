import io from 'socket.io-client'

const port = 4043

const socket = io(`wss://poulton.fun:${port}`, {
  transports: ['websocket']
})
socket.on('connect', (...args) => {
  console.log('connect', ...args)
})

socket.on('disconnect', () => {
  console.log('disconnect')
})

export default socket
