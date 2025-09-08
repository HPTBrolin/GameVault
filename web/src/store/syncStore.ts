type State = {
  syncing: boolean
  queued: number
}

const KEY = 'gv_outbox_count'

function readCount(): number {
  const n = parseInt(localStorage.getItem(KEY) || '0', 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}
function writeCount(n:number){
  localStorage.setItem(KEY, String(Math.max(0, n|0)))
}

const listeners = new Set<()=>void>()
const state: State = {
  syncing: false,
  queued: readCount()
}

export function getState(){ return state }
export function subscribe(fn: ()=>void){ listeners.add(fn); return ()=>listeners.delete(fn) }
function emit(){ listeners.forEach(fn=>fn()) }

export function incQueue(n=1){
  state.queued = readCount() + (n|0)
  writeCount(state.queued)
  emit()
}
export function clearQueue(){
  state.queued = 0; writeCount(0); emit()
}
export function setSyncing(v:boolean){
  if(state.syncing !== v){ state.syncing = v; emit() }
}

if(typeof window !== 'undefined'){
  window.addEventListener('gv:queued', ()=> incQueue(1))
  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('message', (event:any)=>{
      const data = event?.data || {}
      if(data?.type === 'gv:sync-start'){
        setSyncing(true)
      }else if(data?.type === 'gv:sync-complete'){
        setSyncing(false)
        if(typeof data.processed === 'number'){
          const next = Math.max(0, readCount() - data.processed)
          state.queued = next; writeCount(next); emit()
        }else{
          clearQueue()
        }
      }
    })
  }
}
