
import React from 'react'
import Icon from './Icon'
type Props = { page:number, limit:number, total:number, onPage:(p:number)=>void, onLimit?:(l:number)=>void }
export default function Pagination({page, limit, total, onPage, onLimit}:Props){
  const maxPage = Math.max(1, Math.ceil((total||0)/Math.max(1,limit)))
  const start = total ? (page-1)*limit+1 : 0
  const end = Math.min(page*limit, total||0)
  return <div className="gv-pager token-card">
    <div className="info">{total?`${start}–${end} de ${total}`:'—'}</div>
    <div className="ctrl">
      <button disabled={page<=1} onClick={()=>onPage(1)} title="Primeira"><Icon name="chevrons-left"/></button>
      <button disabled={page<=1} onClick={()=>onPage(page-1)} title="Anterior"><Icon name="chevron-left"/></button>
      <span className="pg">Página {page} / {maxPage}</span>
      <button disabled={page>=maxPage} onClick={()=>onPage(page+1)} title="Seguinte"><Icon name="chevron-right"/></button>
      <button disabled={page>=maxPage} onClick={()=>onPage(maxPage)} title="Última"><Icon name="chevrons-right"/></button>
      <select value={limit} onChange={e=>onLimit && onLimit(parseInt(e.target.value))} title="Itens por página">
        {[12,24,30,48,60,96].map(v=><option key={v} value={v}>{v}/página</option>)}
      </select>
    </div>
  </div>
}
