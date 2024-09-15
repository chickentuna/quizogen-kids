import chalk from 'chalk'
import { Context } from 'koa'

import log from './log'

const STATUS_COLORS: Record<string, string> = {
  error: 'redBright',
  warn: 'yellowBright',
  info: 'greenBright'
}

async function accessLog (ctx: Context, next: () => Promise<unknown>) {
  const start = Date.now()
  try {
    await next()
  } catch {}
  const end = Date.now()
  const duration = end - start

  let logLevel: string
  if (ctx.status >= 500) {
    logLevel = 'error'
  } else if (ctx.status >= 400) {
    logLevel = 'warn'
  } else {
    logLevel = 'debug'
  }

  // const statusColor = STATUS_COLORS[logLevel]
  // log.log(logLevel, chalk`{greenBright ${ctx.method}} {blueBright ${ctx.originalUrl}} {${statusColor} ${ctx.status}} {gray ${duration}ms}`)
  log.log(logLevel, `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${duration}ms`)
}

export default accessLog
