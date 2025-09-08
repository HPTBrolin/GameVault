import React, { useEffect, useState } from 'react'

type ToastKind = 'success'|'error'|'info'
type ToastItem = { id:number; title:string; description?:string; kind:ToastKind }

let pushToast: ((t: Omit<ToastItem,'id'|'kind'> & { kind?: ToastKind })=>void) | null = null

export function toast(input: { title:string; description?:string; kind?:ToastKind }){
  pushToast?.(input)
}

export default function ToastHost(){
  const [list, setList] = useState<ToastItem[]>([])

  useEffect(()=>{
    pushToast = (input)=>{
      const t: ToastItem = { id: Date.now()+Math.random(), title: input.title, description: input.description, kind: input.kind || 'info' }
      setList(prev=>[...prev, t])
      setTimeout(()=>{ setList(prev => prev.filter(x => x.id !== t.id)) }, 3400)
    }
    return ()=>{ pushToast = null }
  }, [])

  return (
    <div style={{position:'fixed', left:0, right:0, bottom:16, display:'flex', justifyContent:'center', pointerEvents:'none', zIndex:9999}}>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {list.map(t=> (
          <div key={t.id} className={`toast ${t.kind}`} style={boxStyle(t.kind)}>
            <div style={{fontWeight:600}}>{t.title}</div>
            {t.description && <div className="muted" style={{fontSize:'.9rem'}}>{t.description}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function boxStyle(kind:ToastKind): React.CSSProperties {
  const bg = kind==='success' ? 'rgba(16,185,129,.15)'
    : kind==='error' ? 'rgba(239,68,68,.15)'
    : 'rgba(59,130,246,.15)'
  const border = kind==='success' ? '1px solid rgba(16,185,129,.35)'
    : kind==='error' ? '1px solid rgba(239,68,68,.35)'
    : '1px solid rgba(59,130,246,.35)'
  return {
    background:bg,
    border,
    backdropFilter:'blur(6px)',
    color:'var(--text)',
    padding:'10px 12px',
    minWidth:280,
    maxWidth:420,
    borderRadius:12,
    pointerEvents:'auto',
    boxShadow:'0 10px 30px rgba(0,0,0,.25)'
  }
}
