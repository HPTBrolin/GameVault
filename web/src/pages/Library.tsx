
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import FilterPanel from "../components/FilterPanel";
import { listGames, type Game, type GameFilters } from "../features/games/api";

const ALL_PLATFORMS = ["PS5","PS4","Xbox Series","Xbox One","Switch","PC","Steam","GOG","Epic","Web","Mobile"];

export default function Library(){
  const [filters,setFilters] = useState<GameFilters>({ sort:"added" });
  const [drawer,setDrawer] = useState(false);
  const [page,setPage] = useState(1);
  const [items,setItems] = useState<Game[]>([]);
  const [total,setTotal] = useState(0);
  const pageSize = 30;
  const hasMore = items.length < total;

  useEffect(()=>{
    let ignore=false;
    (async ()=>{
      const pageResp = await listGames(0,pageSize,filters);
      if(ignore) return;
      setItems(pageResp.items);
      setTotal(pageResp.total);
      setPage(1);
    })();
    return ()=>{ ignore=true; };
  },[filters.sort, filters.platform, filters.status, filters.q]);

  async function loadMore(){
    const next = await listGames(items.length, pageSize, filters);
    setItems(prev=>[...prev, ...next.items]);
    setTotal(next.total);
    setPage(p=>p+1);
  }

  return (
    <Layout>
      <div className="toolbar">
        <button className="btn" onClick={()=>setDrawer(true)}>Filtros</button>
        <div className="spacer"/>
        <div className="meta">{items.length} / {total}</div>
      </div>

      {items.length===0 ? (
        <div className="empty">Sem jogos para mostrar.</div>
      ):(
        <div className="grid">
          {items.map(g=>(
            <a key={g.id} className="card" href={`/game/${g.id}`}>
              <div className="cover" style={{backgroundImage:`url(${g.cover_url||''})`}}/>
              <div className="title">{g.title}</div>
              <div className="sub">{g.platform||""}</div>
            </a>
          ))}
        </div>
      )}

      <div className="pager">
        <div className="grow"/>
        {hasMore && <button className="btn" onClick={loadMore}>Carregar mais</button>}
      </div>

      <FilterPanel open={drawer} onClose={()=>setDrawer(false)} filters={filters} onChange={setFilters} platforms={ALL_PLATFORMS}/>
    </Layout>
  );
}
