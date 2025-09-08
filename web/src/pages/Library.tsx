import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listGamesPagedByPage, type Game } from "../features/games/api";

export default function Library(){
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(()=>parseInt(searchParams.get("page")||"0",10), [searchParams]);
  const limit = useMemo(()=>parseInt(searchParams.get("limit")||"30",10), [searchParams]);
  const [items, setItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let cancelled=false;
    setLoading(true);
    const filters = {
      q: searchParams.get("q") || "",
      platform: searchParams.get("platform") || "",
      status: searchParams.get("status") || ""
    };
    listGamesPagedByPage(page, limit, filters)
      .then(p => {
        if (cancelled) return;
        setItems(p.items || []);
        setTotal(p.total || 0);
      })
      .catch(()=>{
        if (!cancelled) { setItems([]); setTotal(0); }
      })
      .finally(()=>{ if (!cancelled) setLoading(false); });
    return ()=>{ cancelled=true; };
  }, [page, limit, searchParams]);

  const hasPrev = page > 0;
  const hasNext = (page + 1) * limit < total;

  return (
    <div className="page library">
      <div className="toolbar" style={{display:"flex", gap:8, alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", gap:8}}>
          <Link to="/add" className="btn">Add New</Link>
          <button className="btn" onClick={()=> setSearchParams(prev => {
            const n = new URLSearchParams(prev);
            n.set("filters","open");
            return n;
          })}>Filters</button>
        </div>
        <div className="search">
          <input
            placeholder="Pesquisar…"
            defaultValue={searchParams.get("q")||""}
            onKeyDown={e=>{
              if(e.key==="Enter"){
                const v=(e.target as HTMLInputElement).value;
                setSearchParams(prev=>{ const n=new URLSearchParams(prev); if(v) n.set("q",v); else n.delete("q"); n.set("page","0"); return n; });
              }
            }}
          />
        </div>
      </div>

      {loading ? <p>A carregar…</p> : (
        items.length===0 ? <p>Sem jogos.</p> : (
          <div className="grid" style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16}}>
            {items.map(g => (
              <Link key={g.id} to={`/game/${g.id}`} className="card" style={{textDecoration:"none", color:"inherit", background:"#111", borderRadius:12, overflow:"hidden"}}>
                <div className="cover" style={{aspectRatio:"3/4", backgroundSize:"cover", backgroundPosition:"center", backgroundImage:`url(${g.cover_url||""})`}} />
                <div className="meta" style={{padding:"8px 10px"}}>
                  <div className="title" style={{fontWeight:600, whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden"}}>{g.title}</div>
                  <div className="sub" style={{opacity:.7, fontSize:12}}>{g.platform||""}</div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      <div className="pager" style={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap:10, padding:"16px 0"}}>
        <button disabled={!hasPrev} onClick={()=> setSearchParams(sp=>{ const n=new URLSearchParams(sp); n.set("page", String(Math.max(0, page-1))); return n;})}>Anterior</button>
        <span style={{opacity:.75}}>{items.length ? `${page*limit+1}-${page*limit+items.length} de ${total}` : `0 de ${total}`}</span>
        <button disabled={!hasNext} onClick={()=> setSearchParams(sp=>{ const n=new URLSearchParams(sp); n.set("page", String(page+1)); return n;})}>Próxima</button>
      </div>
    </div>
  );
}
