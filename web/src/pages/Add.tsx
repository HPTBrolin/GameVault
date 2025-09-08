import React from "react";
import { searchProviders, createGame } from "../features/games/api";

export default function Add(){
  const [q,setQ] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading,setLoading] = React.useState(false);
  const [err,setErr] = React.useState<string>("");

  async function doSearch(e: React.FormEvent){
    e.preventDefault();
    setErr(""); setLoading(true);
    try{
      const r = await searchProviders(q);
      setResults(r||[]);
    }catch(e: any){
      setErr(e?.message||"Erro na pesquisa");
    }finally{
      setLoading(false);
    }
  }

  async function add(item: any){
    try{
      await createGame({
        title: item.name || item.title,
        cover_url: item.background_image,
        platform: (item.platforms && item.platforms[0]?.platform?.name) || null,
        release_date: item.released || null,
        slug: item.slug
      });
      alert("Adicionado!");
    }catch(e: any){
      alert("Falhou ao adicionar.");
    }
  }

  return (
    <div>
      <h2>Adicionar</h2>
      <form onSubmit={doSearch} style={{display:"flex", gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar no RAWG…" />
        <button disabled={loading}>{loading?"A pesquisar…":"Pesquisar"}</button>
      </form>
      {err && <div style={{color:"#f66"}}>{err}</div>}
      <div style={{marginTop:12, display:"grid", gap:10}}>
        {results.map((r:any)=>(
          <div key={r.id} style={{display:"flex", gap:10, alignItems:"center", background:"#0b1320", border:"1px solid #1c2a3a", padding:8, borderRadius:8}}>
            <img src={r.background_image} style={{width:72, height:72, objectFit:"cover", borderRadius:6}} />
            <div style={{flex:1}}>
              <div>{r.name}</div>
              <div style={{opacity:.7, fontSize:12}}>{r.released}</div>
            </div>
            <button onClick={()=>add(r)}>Adicionar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
