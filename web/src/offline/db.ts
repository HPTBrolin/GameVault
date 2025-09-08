import Dexie, { Table } from 'dexie'

export interface OutboxItem {
  id?: number
  type: 'createGame'
  payload: any
  createdAt: number
}

export interface CachePage {
  key: string
  items: any[]
  total: number
  savedAt: number
}

class GVDB extends Dexie {
  outbox!: Table<OutboxItem, number>
  cache!: Table<CachePage, string>
  constructor(){
    super('gamevault')
    this.version(1).stores({
      outbox: '++id, type, createdAt',
      cache: 'key'
    })
  }
}

export const db = new GVDB()
