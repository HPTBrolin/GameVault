
import React, {useEffect} from 'react'
export default function Modal({open, onClose, title, children, footer}:{open:boolean, onClose:()=>void, title:string, children:React.ReactNode, footer?:React.ReactNode}){
  useEffect(()=>{ document.body.style.overflow = open ? 'hidden' : ''; return ()=>{document.body.style.overflow=''} },[open])
  if(!open) return null
  return <div className="gv-modal">
    <div className="gv-modal__backdrop" onClick={onClose}/>
    <div className="gv-modal__panel" role="dialog" aria-modal="true" aria-label={title}>
      <header className="gv-modal__header"><h3>{title}</h3><button className="icon" onClick={onClose} aria-label="Fechar">✕</button></header>
      <div className="gv-modal__content">{children}</div>
      {footer && <footer className="gv-modal__footer">{footer}</footer>}
    </div>
  </div>
}
