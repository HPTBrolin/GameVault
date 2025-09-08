
import React, { useState } from "react";
import Layout from "../components/Layout";
import { searchProviders, createGame, type CreateGamePayload } from "../features/games/api";

const PLATFORMS = ["PS5","PS4","Xbox Series","Xbox One","Switch","PC","Steam","GOG","Epic","Web","Mobile"];

export default function Add(){
  const [q,setQ] = useState("");
  const [results,setResults] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|undefined>();

  async function doSearch(e?:React.FormEvent){
    e?.preventDefault();
    setLoading(true); setError(undefined);
    try{
      const r = await searchProviders(q);
      setResults(r);
    }catch(err:any){
      setError("Falhou a pesquisa");
    }finally{
      setLoading(false);
    }
  }

  async function addFrom(r:any){
    const payload: CreateGamePayload = {
      title: r.title,
      platform: r.platforms?.[0] || "",
      cover_url: r.cover_url || "",
      status: "owned",
      slug: r.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
    };
    await createGame(payload);
    alert("Adicionado!");
  }

  return (
    <Layout>
      <form className="searchbar" onSubmit={doSearch}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar no RAWG"/>
        <button className="btn" type="submit" disabled={loading}>Pesquisar</button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">A pesquisar…</div>}

      <div className="results">
        {results.map(r=>(
          <div key={`${r.provider}:${r.id}`} className="result">
            <div className="r-cover" style={{backgroundImage:`url(${r.cover_url||''})`}} />
            <div className="r-meta">
              <div className="r-title">{r.title}</div>
              <div className="r-sub">{r.platforms?.join(", ")||""}</div>
            </div>
            <div className="grow"/>
            <button className="btn" onClick={()=>addFrom(r)}>Adicionar</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
