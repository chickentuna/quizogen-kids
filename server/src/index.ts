import { Socket } from 'socket.io'
import { io } from './webapp/app'
import log from './webapp/log'

async function main() {
  io.on('connection', async (socket: Socket) => {
    log.debug('user connected', { ip: socket.handshake.address })
    
    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
    
    })

    
    
  })
  
}




main()


