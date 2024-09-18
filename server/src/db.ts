import * as fs from 'fs'
import log from './webapp/log'

const dbFilePath = (process.env.LOCAL || process.env.OS === 'Windows_NT') ? './db.json' : '/saves/db.json'
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any

class Accessor<T> {
  node:T

  constructor (node) {
    this.node = node
  }

  private get<V> (key: string, defaulter:() => V): Accessor<V> {
    if (this.node[key] === undefined) {
      this.node[key] = defaulter()
    }
    return new Accessor(this.node[key])
  }

  getObj (key:string): Accessor<object> {
    return this.get<object>(key, () => ({}))
  }

  getArray<V> (key:string): Accessor<V[]> {
    return this.get<V[]>(key, () => [])
  }

  get value ():T {
    return this.node
  }
}

function get () {
  return new Accessor<object>(db)
}

export function reload () {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '{}')
  }
  db = JSON.parse(fs.readFileSync(dbFilePath).toString())
  log.debug('Image DB loaded')
}

function save () {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2))
}

reload()
