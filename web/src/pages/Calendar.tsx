import React from "react";
import { get as apiGet } from "../lib/http";

type Release = {
  id: string;
  title: string;
  date: string; // ISO
  cover?: string;
  platforms?: string[];
};

function formatDate(d:string){
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit"});
}

export default function CalendarPage(){
  const [items, setItems] = React.useState<Release[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState<string>("");

  React.useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        // Try backend first
        const data = await apiGet<any>("/releases/upcoming?days=60&limit=20");
        if(Array.isArray(data)){
          setItems(data);
        }else if(data?.items){
          setItems(data.items);
        }else{
          throw new Error("bad-shape");
        }
      }catch(_){
        // Fallback: directly from RAWG
        try{
          const s = await apiGet<any>("/settings"); // to get RAWG key if available
          const key = s?.RAWG_API_KEY;
          const today = new Date();
          const future = new Date();
          future.setDate(today.getDate()+60);
          const toISO = (d:Date)=> d.toISOString().slice(0,10);
          const params = new URLSearchParams({
            dates: `${toISO(today)},${toISO(future)}`,
            ordering: "released",
            page_size: "20",
          });
          if(key) params.set("key", key);
          const url = `https://api.rawg.io/api/games?${params.toString()}`;
          const res = await fetch(url);
          if(!res.ok) throw new Error("rawg-failed");
          const json = await res.json();
          const mapped: Release[] = (json.results||[]).map((g:any)=> ({
            id: String(g.id),
            title: g.name,
            date: g.released || g.updated || new Date().toISOString(),
            cover: g.background_image,
            platforms: (g.platforms||[]).map((p:any)=> p?.platform?.name).filter(Boolean),
          }));
          setItems(mapped);
        }catch(e:any){
          setMsg("Sem lançamentos próximos.");
        }
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  return (
    <div className="page calendar">
      <h2>Lançamentos Próximos</h2>
      {loading && <div className="panel">A carregar…</div>}
      {!loading && items.length===0 && <div className="panel">{msg || "Sem lançamentos próximos."}</div>}
      {!loading && items.length>0 && (
        <ul className="list">
          {items.map(r=> (
            <li key={r.id} className="card">
              {r.cover && <img src={r.cover} alt={r.title} />}
              <div className="meta">
                <div className="title">{r.title}</div>
                <div className="sub">{formatDate(r.date)} · {(r.platforms||[]).join(", ")}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .page.calendar{ padding:16px; color:#e5e7eb;}
        h2{ margin:6px 0 12px; font-size:18px;}
        .panel{ background:#0f1115; border:1px solid #1f2430; border-radius:12px; padding:14px;}
        .list{ list-style:none; margin:0; padding:0; display:grid; gap:12px;}
        .card{ display:flex; gap:12px; align-items:center; background:#0f1115; border:1px solid #1f2430; border-radius:12px; padding:10px;}
        .card img{ width:96px; height:54px; object-fit:cover; border-radius:8px; border:1px solid #1a2030;}
        .title{ font-weight:600;}
        .sub{ color:#9aa4b2; font-size:12px;}
      `}</style>
    </div>
  );
}
