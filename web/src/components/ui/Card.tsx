
import React from 'react'
import Badge from './Badge'
export default function Card({title, cover, meta, status, actions}:{title:string, cover?:string, meta?:string, status?:string, actions?:React.ReactNode}){
  return <article className="gv-card token-card">
    <div className="cov">{cover ? <img src={cover} alt={title}/> : <div className="ph"/>}</div>
    <div className="tx">
      <h4 title={title}>{title}</h4>
      {meta && <div className="meta">{meta}</div>}
      <div className="row">
        {status && <Badge>{status}</Badge>}
        <div className="flex"/>
        {actions}
      </div>
    </div>
  </article>
}
