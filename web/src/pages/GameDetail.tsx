import React from "react";
import { useParams } from "react-router-dom";
import { getGame } from "../features/games/api";

export default function GameDetail(){
  const { id } = useParams();
  const [item, setItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    let alive = true;
    (async ()=>{
      try{
        if (id){
          const g = await getGame(id);
          if (alive) setItem(g);
        }
      }finally{
        if (alive) setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  }, [id]);

  if (loading) return <div>A carregar…</div>;
  if (!item) return <div>Jogo não encontrado.</div>;

  return (
    <div style={{display:"grid", gridTemplateColumns:"320px 1fr", gap:20}}>
      {item.cover_url && <img src={item.cover_url} style={{width:"100%", borderRadius:12}} />}
      <div>
        <h2 style={{marginTop:0}}>{item.title}</h2>
        <div style={{opacity:.8}}>{item.platform || "—"} {item.release_date ? `• ${new Date(item.release_date).toISOString().slice(0,10)}` : ""}</div>
        {item.slug && <div style={{opacity:.6, marginTop:8}}>slug: {item.slug}</div>}
      </div>
    </div>
  );
}
