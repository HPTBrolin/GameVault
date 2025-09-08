import React, { useState, useEffect } from 'react'

type Filters = {
  q?: string
  platform?: string
  status?: string
  is_board_game?: boolean | null
}

type Props = {
  open: boolean
  initial: Filters
  onClose: ()=>void
  onApply: (f: Filters)=>void
}

const statuses = ['owned','wishlist','completed','backlog','lent','digital']

export default function FilterModal({open, initial, onClose, onApply}: Props){
  const [q,setQ] = useState(initial.q||'')
  const [platform,setPlatform] = useState(initial.platform||'')
  const [status,setStatus] = useState(initial.status||'')
  const [isBoard,setIsBoard] = useState<null|boolean>(initial.is_board_game ?? null)

  useEffect(()=>{
    if(open){
      setQ(initial.q||'')
      setPlatform(initial.platform||'')
      setStatus(initial.status||'')
      setIsBoard(initial.is_board_game ?? null)
      document.body.style.overflow='hidden'
    } else {
      document.body.style.overflow=''
    }
    return ()=>{ document.body.style.overflow='' }
  }, [open])

  if(!open) return null

  const apply = ()=>{
    const f: Filters = {}
    if(q.trim()) f.q=q.trim()
    if(platform.trim()) f.platform=platform.trim()
    if(status.trim()) f.status=status.trim()
    if(isBoard!==null) f.is_board_game=isBoard
    onApply(f); onClose()
  }
  const clear = ()=>{ setQ(''); setPlatform(''); setStatus(''); setIsBoard(null) }

  return (
    <div className="gv-modal">
      <div className="gv-modal__backdrop" onClick={onClose}/>
      <div className="gv-modal__panel" role="dialog" aria-modal="true" aria-label="Filtros">
        <header className="gv-modal__header">
          <h3>Filtros</h3>
          <button className="icon" onClick={onClose} aria-label="Fechar">✕</button>
        </header>
        <div className="gv-modal__content">
          <label className="field">
            <span>Pesquisa</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: Zelda"/>
          </label>
          <label className="field">
            <span>Plataforma</span>
            <input value={platform} onChange={e=>setPlatform(e.target.value)} placeholder="Ex.: Nintendo Switch"/>
          </label>
          <label className="field">
            <span>Estado</span>
            <select value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="">— qualquer —</option>
              {statuses.map(s=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </label>
          <fieldset className="field">
            <legend>Tipo</legend>
            <div className="segmented">
              <button className={isBoard===null?'on':''} onClick={()=>setIsBoard(null)}>Todos</button>
              <button className={isBoard===false?'on':''} onClick={()=>setIsBoard(false)}>Videojogos</button>
              <button className={isBoard===true?'on':''} onClick={()=>setIsBoard(true)}>Board games</button>
            </div>
          </fieldset>
        </div>
        <footer className="gv-modal__footer">
          <button className="ghost" onClick={clear}>Limpar</button>
          <div className="spacer"/>
          <button className="primary" onClick={apply}>Aplicar</button>
        </footer>
      </div>
    </div>
  )
}
