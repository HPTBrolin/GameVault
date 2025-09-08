import React from "react";
import { listGamesPagedByPage, type Game } from "../features/games/api";
import FilterDrawer, { type GameFilters } from "../components/FilterDrawer";
import { useSearchParams, Link } from "react-router-dom";

export default function Library(){
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, parseInt(params.get("page")||"1"));
  const pageSize = 30;
  const [busy, setBusy] = React.useState(false);
  const [items, setItems] = React.useState<Game[]>([]);
  const [total, setTotal] = React.useState(0);
  const [drawer, setDrawer] = React.useState(false);

  const filters: GameFilters = {
    q: params.get("q") || undefined,
    platform: params.get("platform") || undefined,
    status: params.get("status") || undefined,
    sort: (params.get("sort") as any) || "added",
  };

  const load = React.useCallback(async()=>{
    setBusy(true);
    try{
      const data = await listGamesPagedByPage(page, pageSize, filters);
      setItems(data.items || []);
      setTotal(data.total || 0);
    }finally{
      setBusy(false);
    }
  }, [page, filters.q, filters.platform, filters.status, filters.sort]);

  React.useEffect(()=>{ load(); }, [load]);

  const applyFilters = (next: GameFilters)=>{
    const p = new URLSearchParams(params);
    next.q ? p.set("q", next.q) : p.delete("q");
    next.platform ? p.set("platform", next.platform) : p.delete("platform");
    next.status ? p.set("status", next.status) : p.delete("status");
    next.sort ? p.set("sort", next.sort) : p.delete("sort");
    p.set("page","1");
    setParams(p, { replace:true });
    setDrawer(false);
  };

  const clearFilters = ()=>{
    const p = new URLSearchParams();
    p.set("page","1");
    setParams(p, { replace:true });
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="page library">
      <div className="toolbar">
        <div className="left">
          <button className="btn" onClick={()=> setDrawer(true)}>Filtros</button>
        </div>
        <div className="right">
          <Link className="btn primary" to="/add">Adicionar</Link>
        </div>
      </div>

      {busy ? <div className="panel">A carregar…</div> : (
        <div className="grid">
          {items.map(g=> (
            <Link key={g.id || g.slug || g.title} to={`/game/${g.id}`} className="card">
              {g.cover_url ? <img alt={g.title} src={g.cover_url} /> : <div className="ph" />}
              <div className="t">{g.title}</div>
              <div className="s">{g.platform || "—"}</div>
            </Link>
          ))}
          {items.length===0 && <div className="panel">Sem resultados.</div>}
        </div>
      )}

      <div className="pager">
        <button className="btn" disabled={page<=1} onClick={()=> setParams(prev=> { const p = new URLSearchParams(prev); p.set("page", String(page-1)); return p;})}>Anterior</button>
        <div className="info">{page} / {totalPages}</div>
        <button className="btn" disabled={page>=totalPages} onClick={()=> setParams(prev=> { const p = new URLSearchParams(prev); p.set("page", String(page+1)); return p;})}>Próxima</button>
      </div>

      <FilterDrawer open={drawer} value={filters} onApply={applyFilters} onClear={clearFilters} onClose={()=> setDrawer(false)} />

      <style>{`
        .page.library{ padding:16px; color:#e5e7eb;}
        .toolbar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
        .btn{ padding:8px 12px; background:#0b0d11; color:#e5e7eb; border:1px solid #1f2430; border-radius:8px; cursor:pointer;}
        .btn.primary{ background:#3b82f6; color:#fff; border-color:#3b82f6;}
        .grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:12px;}
        .card{ display:block; background:#0f1115; border:1px solid #1f2430; border-radius:12px; padding:10px; text-decoration:none; color:inherit;}
        .card img,.card .ph{ width:100%; aspect-ratio:16/9; object-fit:cover; background:#131722; border-radius:8px; border:1px solid #1a2030;}
        .t{ margin-top:8px; font-weight:600; font-size:14px;}
        .s{ color:#9aa4b2; font-size:12px;}
        .panel{ background:#0f1115; border:1px solid #1f2430; border-radius:12px; padding:14px;}
        .pager{ position:fixed; right:16px; bottom:16px; display:flex; gap:10px; align-items:center; background:#0f1115; border:1px solid #1f2430; padding:8px 10px; border-radius:12px;}
        .info{ color:#9aa4b2; font-size:12px;}
      `}</style>
    </div>
  );
}
