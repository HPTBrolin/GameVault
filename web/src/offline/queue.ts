import axios from 'axios'
import { db } from './db'

export function apiBase(){
  return (localStorage.getItem('API_URL') || (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000').replace(/\/$/,'')
}

export async function enqueueCreateGame(payload:any){
  await db.outbox.add({ type: 'createGame', payload, createdAt: Date.now() })
}

export async function flushOutbox(){
  const base = apiBase()
  const items = await db.outbox.orderBy('createdAt').toArray()
  for(const it of items){
    try{
      if(it.type === 'createGame'){
        await axios.post(`${base}/games`, it.payload)
      }
      await db.outbox.delete(it.id!)
    }catch(e){
      if(!navigator.onLine) break
      break
    }
  }
}

export function initOutboxAutoFlush(){
  window.addEventListener('online', ()=>{ flushOutbox() })
  setTimeout(()=>{ flushOutbox() }, 0)
}

// Cache de páginas
function keyFromParams(params:any){ return 'games:'+JSON.stringify(params||{}) }
export async function savePageCache(params:any, page:{items:any[]; total:number}){
  await db.cache.put({ key: keyFromParams(params), items: page.items||[], total: page.total||0, savedAt: Date.now() })
}
export async function getPageCache(params:any){
  return db.cache.get(keyFromParams(params))
}
