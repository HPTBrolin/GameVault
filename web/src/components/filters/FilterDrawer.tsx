import React from "react";
import { useSearchParams } from "react-router-dom";

type Props = { open: boolean; onClose: ()=>void };

export default function FilterDrawer({ open, onClose }: Props){
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") || "added_at";
  const order = params.get("order") || "desc";

  const apply = ()=>{
    const p = new URLSearchParams(params);
    p.set("sort", sort);
    p.set("order", order);
    p.set("offset","0");
    setParams(p);
    onClose();
  };

  const clearAll = ()=>{
    const p = new URLSearchParams();
    p.set("sort","added_at");
    p.set("order","desc");
    p.set("offset","0");
    setParams(p);
    onClose();
  };

  if(!open) return null;

  return (
    <div className="drawer-mask" onClick={onClose}>
      <aside className="drawer" onClick={e=>e.stopPropagation()}>
        <div className="drawer-header">
          <div>Filtros</div>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="drawer-body">
          <label>Ordenar por</label>
          <select defaultValue={sort} onChange={e=>{ params.set("sort", e.target.value); }}>
            <option value="added_at">Adicionado</option>
            <option value="title">Título</option>
            <option value="platform">Plataforma</option>
          </select>
          <label>Direção</label>
          <select defaultValue={order} onChange={e=>{ params.set("order", e.target.value); }}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <div className="drawer-footer">
          <button className="btn" onClick={clearAll}>Limpar</button>
          <button className="btn grad" onClick={apply}>Aplicar</button>
        </div>
      </aside>
      <style>{`
        .drawer-mask{ position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:50; display:flex; justify-content:flex-end; }
        .drawer{ width:360px; height:100%; background:#0f1722; border-left:1px solid rgba(255,255,255,.08); display:flex; flex-direction:column; }
        .drawer-header, .drawer-footer{ padding:12px; border-bottom:1px solid rgba(255,255,255,.08); display:flex; justify-content:space-between; align-items:center; }
        .drawer-body{ padding:12px; display:grid; gap:10px; }
        select{ background:#0b121b; color:#e8eef7; border:1px solid rgba(255,255,255,.12); padding:8px; border-radius:8px; }
      `}</style>
    </div>
  );
}
