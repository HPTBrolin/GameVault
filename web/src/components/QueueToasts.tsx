import React, { useEffect } from 'react'
import { toast } from './ui/Toast'

export default function QueueToasts(){
  useEffect(()=>{
    const onQueued = (e: Event)=>{
      const anyE = e as CustomEvent<any>
      const title = anyE.detail?.title || 'Item'
      toast({ kind:'info', title:'Guardado offline', description:`“${title}” será sincronizado quando voltares a estar online.` })
    }
    const onOnline = ()=> toast({ kind:'success', title:'Ligação restabelecida', description:'A sincronizar as alterações pendentes…' })
    window.addEventListener('gv:queued', onQueued as EventListener)
    window.addEventListener('online', onOnline)
    return ()=>{
      window.removeEventListener('gv:queued', onQueued as EventListener)
      window.removeEventListener('online', onOnline)
    }
  },[])
  return null
}
