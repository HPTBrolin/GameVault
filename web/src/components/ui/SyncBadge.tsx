import React, { useEffect, useState } from 'react'
import { getState, subscribe } from '../../store/syncStore'

export default function SyncBadge(){
  const snap = getState()
  const [syncing, setSyncing] = useState(snap.syncing)
  const [queued, setQueued] = useState(snap.queued)

  useEffect(()=>{
    return subscribe(()=>{
      const s = getState()
      setSyncing(s.syncing)
      setQueued(s.queued)
    })
  }, [])

  const visible = syncing || queued > 0
  if(!visible) return null

  return (
    <div style={container}>
      <div style={pill}>
        {syncing ? <span>🔄 Sync em curso…</span> : null}
        {!syncing && queued > 0 ? <span>⏳ {queued} alteração{queued>1?'es':''} por sincronizar</span> : null}
      </div>
    </div>
  )
}

const container: React.CSSProperties = {
  position:'fixed',
  left:16,
  bottom:16,
  zIndex: 9998
}
const pill: React.CSSProperties = {
  background:'rgba(15,23,42,.85)',
  color:'#e5e7eb',
  border:'1px solid rgba(148,163,184,.3)',
  padding:'8px 12px',
  borderRadius: 999,
  fontWeight:600,
  boxShadow:'0 10px 30px rgba(0,0,0,.35)',
  backdropFilter:'blur(6px)'
}
