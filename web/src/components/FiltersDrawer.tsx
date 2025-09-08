import React, { useEffect, useState } from "react";
import { rawgPlatforms } from "../features/providers/api";

export type Filters = { q?:string; platform?:string; sort?:string; order?: "asc"|"desc" };
export default function FiltersDrawer({open, onClose, value, onApply}:{open:boolean; onClose:()=>void; value:Filters; onApply:(v:Filters)=>void}){
  const [local, setLocal] = useState<Filters>(value);
  const [platforms, setPlatforms] = useState<string[]>([]);
  useEffect(()=>{ setLocal(value) },[value]);
  useEffect(()=>{ rawgPlatforms().then(setPlatforms); },[]);
  return (
    <div className={open?"drawer open":"drawer"}>
      <header>
        <strong>Filtros</strong>
        <button className="btn" onClick={()=>{ onApply(local); onClose(); }}>Aplicar</button>
      </header>
      <div className="body">
        <label>Pesquisa<input className="input" value={local.q||""} onChange={e=>setLocal({...local,q:e.target.value})} placeholder="título, plataforma, etc."/></label>
        <label>Plataforma<select className="select" value={local.platform||""} onChange={e=>setLocal({...local,platform:e.target.value||undefined})}>
          <option value="">Todas</option>{platforms.map(p=><option key={p} value={p}>{p}</option>)}
        </select></label>
        <label>Ordenação<select className="select" value={local.sort||"added_at"} onChange={e=>setLocal({...local,sort:e.target.value||undefined})}>
          <option value="added_at">Adicionado</option>
          <option value="release_date">Lançamento</option>
          <option value="title">Título</option>
        </select></label>
        <label>Ordem<select className="select" value={local.order||"desc"} onChange={e=>setLocal({...local,order:(e.target.value as any)})}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select></label>
        <button onClick={()=>setLocal({})} className="btn" style={{background:"#1b2433"}}>Limpar</button>
      </div>
    </div>
  );
}
