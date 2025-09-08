import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Toolbar(){
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const [q, setQ] = useState(sp.get("q") || "");

  useEffect(() => { const t = setTimeout(()=>{ 
    const next = new URLSearchParams(sp); q ? next.set("q", q) : next.delete("q"); setSp(next,{replace:true});
  }, 350); return ()=>clearTimeout(t); }, [q]);

  const sort = sp.get("sort") || "added_at";
  const order = sp.get("order") || "desc";

  function setSort(v: string){ const next = new URLSearchParams(sp); next.set("sort", v); setSp(next); }
  function setOrder(v: string){ const next = new URLSearchParams(sp); next.set("order", v); setSp(next); }

  return (
    <div className="toolbar">
      <div className="left">
        <input placeholder="Pesquisar..." value={q} onChange={e=>setQ(e.target.value)} />
        <Link to="/add" className="btn">+ Adicionar</Link>
        <Link to="/calendar" className="btn">Calendário</Link>
        <Link to="/settings" className="btn">Definições</Link>
      </div>
      <div className="right">
        <span className="label">Ordenar</span>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="added_at">Adicionado</option>
          <option value="title">Nome</option>
          <option value="platform">Plataforma</option>
          <option value="release_date">Lançamento</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="btn" onClick={()=>document.dispatchEvent(new CustomEvent("open-filters"))}>Filtros</button>
      </div>
    </div>
  );
}
