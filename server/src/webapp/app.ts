import Koa from 'koa'
// import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import https from 'https'
import http from 'http'
import { Server } from 'socket.io'
import fs from 'fs'

import accessLog from './accessLog'
import errorLog from './errorLog'
import log from './log'
import serve from 'koa-static'

const app = new Koa()

app.use(cors())
// app.use(accessLog)
app.use(errorHandler)
// app.use(bodyParser())

app
.use(serve('../client/build'))

app.on('error', errorLog)

let server
if (process.env.LOCAL) {
  server = http.createServer(app.callback())
} else {
  const options = {
    key: fs.readFileSync('/rootfs/etc/letsencrypt/live/poulton.fun/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/rootfs/etc/letsencrypt/live/poulton.fun/fullchain.pem', 'utf8')
  }
  server = https.createServer(options, app.callback())
}
const io = new Server(server);
const port = process.env.PORT ?? 4043

server.listen(port, () => {
  log.debug('Application started')
  log.debug(`└── Listening on port: ${port}`)
})

async function errorHandler (ctx: Koa.Context, next: () => Promise<unknown>) {
  try {
    await next()
  } catch (error: unknown) {
    ctx.status = 500
    ctx.response.body = (error as Error).message
    ctx.app.emit('error', error, ctx)
  }
}

export { app, io }
