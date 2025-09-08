// src/pages/ToysList.tsx
import React from "react";
import { Link } from "react-router-dom";
import FilterToolbar from "/src/components/FilterToolbar";
import Paginator from "/src/components/Paginator";
import { useUrlState } from "/src/features/shared/urlState";
import { listToysPaged, ToyItem } from "/src/features/toys/api";

const DEFAULTS = { q:"", sort:"title", order:"asc" as const, offset:0, limit:30 };

export default function ToysList(){
  const [state, setState] = useUrlState(DEFAULTS);
  const [page, setPage] = React.useState<{items:ToyItem[]; total:number}>({ items:[], total:0 });
  const [loading, setLoading] = React.useState(false);

  async function load(){
    setLoading(true);
    try{
      const res = await listToysPaged({ offset: state.offset, limit: state.limit, q: state.q, sort: state.sort, order: state.order as any });
      setPage({ items: res.items, total: res.total });
    } finally{ setLoading(false) }
  }

  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [state.q, state.sort, state.order, state.offset, state.limit]);

  const clearAll = ()=> setState({ q: DEFAULTS.q, sort: DEFAULTS.sort, order: DEFAULTS.order, offset: 0, limit: DEFAULTS.limit });

  return (
    <div className="app" style={{padding:"12px 16px"}}>
      <div className="topbar" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1>Toys‑to‑Life</h1>
        <Link className="btn primary" to="/toys/add">＋ Adicionar</Link>
      </div>
      <FilterToolbar
        q={state.q} onQ={v=>setState({ q:v, offset:0 })}
        sort={state.sort} order={state.order as any}
        onSort={v=>setState({ sort:v, offset:0 })}
        onOrder={v=>setState({ order:v, offset:0 })}
        defaults={{ q: DEFAULTS.q, sort: DEFAULTS.sort, order: DEFAULTS.order }}
        onClearAll={clearAll}
      />
      {loading ? <div>A carregar…</div> : (
        <div className="grid" style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12}}>
          {page.items.map(t=>(
            <Link to={`/toys/${t.id}`} key={t.id} className="card" style={card}>
              <div style={thumb(t.cover_url)} />
              <div style={{padding:"8px 10px"}}>
                <div style={{fontWeight:800}}>{t.title}</div>
                <div style={{opacity:.7, fontSize:12}}>{t.toy_series||"—"} {t.toy_id? `• ${t.toy_id}`:""}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div style={{marginTop:10}}>
        <Paginator
          offset={state.offset}
          limit={state.limit}
          total={page.total}
          onChange={(off)=>setState({ offset: off })}
        />
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  border:"1px solid rgba(148,163,184,.25)", borderRadius:12, overflow:"hidden",
  background:"rgba(15,23,42,.6)"
};

const thumb = (url?: string|null): React.CSSProperties => ({
  height:120, background: url ? `center/cover no-repeat url(${url})` : "linear-gradient(135deg,#06b6d433,#22d3ee33)",
});
