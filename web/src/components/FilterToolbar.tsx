// src/components/FilterToolbar.tsx
import React from "react";

type Order = "asc"|"desc";
type Defaults = { q?:string; sort?:string; order?:Order };

type Props = {
  q: string;
  onQ(v: string): void;
  sort: string;
  order: Order;
  onSort(v: string): void;
  onOrder(v: Order): void;
  right?: React.ReactNode;
  defaults?: Defaults;            // novos: para detetar filtros ativos
  onClearAll?: ()=>void;          // opcional: limpar tudo
  showChips?: boolean;            // default true
};

export default function FilterToolbar({
  q, onQ, sort, order, onSort, onOrder, right,
  defaults, onClearAll, showChips = true
}: Props){
  const defs: Defaults = { q:"", sort:"title", order:"asc", ...(defaults||{}) };
  const hasQ = (q||"") !== (defs.q||"");
  const hasSort = (sort||"") !== (defs.sort||"title");
  const hasOrder = (order||"asc") !== (defs.order||"asc");
  const active = hasQ || hasSort || hasOrder;

  const chipWrap: React.CSSProperties = { display:"flex", gap:6, flexWrap:"wrap" };
  const chip: React.CSSProperties = {
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"4px 8px", borderRadius:999, fontSize:12, fontWeight:700,
    background:"rgba(99,102,241,.18)", color:"#e5e7eb", border:"1px solid rgba(148,163,184,.25)",
  };
  const closeBtn: React.CSSProperties = { border:"none", background:"transparent", color:"#cbd5e1", cursor:"pointer" };

  return (
    <div className="toolbar" style={wrap}>
      <input
        style={input}
        placeholder="Pesquisar…"
        value={q}
        onChange={e=>onQ(e.target.value)}
      />
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <select style={select} value={sort} onChange={e=>onSort(e.target.value)}>
          <option value="title">Título</option>
          <option value="platform">Plataforma</option>
          <option value="added_at">Adicionado</option>
        </select>
        <select style={select} value={order} onChange={e=>onOrder(e.target.value as Order)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        {right}
      </div>

      {showChips && (
        <div style={{display:"flex", justifyContent:"space-between", marginTop:8, width:"100%"}}>
          <div style={chipWrap}>
            {hasQ && (
              <span style={chip}>q: “{q}”
                <button style={closeBtn} onClick={()=>onQ(defs.q||"")}>✕</button>
              </span>
            )}
            {hasSort && (
              <span style={chip}>sort: {sort}
                <button style={closeBtn} onClick={()=>onSort(defs.sort||"title")}>✕</button>
              </span>
            )}
            {hasOrder && (
              <span style={chip}>order: {order}
                <button style={closeBtn} onClick={()=>onOrder(defs.order||"asc")}>✕</button>
              </span>
            )}
          </div>
          {active && (
            <button className="btn" onClick={onClearAll} style={{whiteSpace:"nowrap"}}>
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = {
  display:"flex", flexDirection:"column", gap:8,
  padding:"8px", background:"rgba(15,23,42,.65)",
  border:"1px solid rgba(148,163,184,.25)", borderRadius:12, margin:"8px 0"
};
const input: React.CSSProperties = {
  flex:1, padding:"8px 10px", borderRadius:10,
  border:"1px solid rgba(148,163,184,.25)", background:"#0b1220", color:"#e5e7eb"
};
const select: React.CSSProperties = {
  padding:"8px 10px", borderRadius:10,
  border:"1px solid rgba(148,163,184,.25)", background:"#0b1220", color:"#e5e7eb"
};
