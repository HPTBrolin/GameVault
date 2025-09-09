import { useEffect, useMemo, useState } from "react";
import { listGamesPagedByPage } from "@/features/games/api";
import type { Game, SortKey, SortOrder } from "@/features/games/types";
import { listGamesPagedByPage } from "../features/games/api";

export default function Library() {
  const [items, setItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("added_at");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await listGamesPagedByPage(page, limit, sort, order, q);
        if (!alive) return;
        setItems(res.items);
        setTotal(res.total);
      } catch (err) {
        console.error("Falha a carregar jogos", err);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page, limit, q, sort, order]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total/limit)), [total, limit]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <input
          placeholder="Pesquisar..."
          value={q}
          onChange={(e)=>{ setPage(1); setQ(e.target.value);}}
          style={{ padding: "8px 12px", borderRadius: 8, background: "#121a21", color: "#e6edf3", border: "1px solid #28313a", width: 320 }}
        />
        <select value={sort} onChange={(e)=>{ setPage(1); setSort(e.target.value as SortKey);}}>
          <option value="added_at">Adicionado</option>
          <option value="name">Nome</option>
          <option value="platform">Consola</option>
        </select>
        <select value={order} onChange={(e)=>{ setPage(1); setOrder(e.target.value as SortOrder);}}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <div style={{ marginLeft: "auto" }}>
          <span style={{ opacity: 0.8 }}>{total} itens • página {page} de {pages}</span>
        </div>
      </div>

      {loading && <div>Carregar…</div>}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {items.map((g)=> (
          <div key={String(g.id)} style={{ background:"#11161d", border:"1px solid #26303a", borderRadius:10, overflow:"hidden" }}>
            {g.cover ? <img src={g.cover} alt={g.name} style={{ width:"100%", height:220, objectFit:"cover" }}/> : <div style={{height:220, background:"#081018"}}/>}
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight:600, marginBottom:6 }}>{g.name}</div>
              <div style={{ opacity:0.7, fontSize:12 }}>{g.platform ?? "—"} {g.year ? ` • ${g.year}`:""}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop: 16, gap: 8 }}>
        <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>◀ Anterior</button>
        <button disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages, p+1))}>Próxima ▶</button>
      </div>
    </div>
  );
}
