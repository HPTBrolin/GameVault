# scripts/win/fix-router-ui.ps1
$ErrorActionPreference = "Stop"

function Write-File($Path, $Content) {
  $dir = Split-Path -Parent $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
  Write-Host ("wrote " + $Path)
}

# 1) main.tsx — único RouterProvider aqui
$main = @'
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

import Library from "./pages/Library";
import Add from "./pages/Add";
import Settings from "./pages/Settings";
import GameDetail from "./pages/GameDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Library /> },
      { path: "add", element: <Add /> },
      { path: "settings", element: <Settings /> },
      { path: "game/:id", element: <GameDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
'@
Write-File ".\src\main.tsx" $main

# 2) App.tsx — layout + <Outlet/>, sem Router aqui
$app = @'
import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

export default function App(){
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector("input[name=q]") as HTMLInputElement;
    const nx = new URLSearchParams(params);
    if (input?.value) nx.set("q", input.value); else nx.delete("q");
    nx.set("offset","0");
    navigate({ pathname: "/", search: nx.toString() });
  }

  function go(path: string){ navigate(path); }

  return (
    <div style={{background:"#0f1720", minHeight:"100vh", color:"#E6EDF3"}}>
      <header style={{display:"flex", gap:12, alignItems:"center", padding:"10px 14px", background:"#116149"}}>
        <NavLink to="/" style={{fontWeight:700, color:"#fff", textDecoration:"none"}}>GameVault</NavLink>
        <form onSubmit={onSearchSubmit} style={{flex:1}}>
          <input
            name="q"
            defaultValue={q}
            placeholder="Pesquisar por título, plataforma, etc."
            style={{width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid #0b3d32", background:"#0b3d32", color:"#fff"}}
          />
        </form>
        <button onClick={()=>go("/add")} style={btn()}>+ Adicionar</button>
        <NavLink to="/settings" style={btn()}>Definições</NavLink>
      </header>
      <main style={{padding:"16px"}}>
        <Outlet/>
      </main>
    </div>
  );
}

function btn(){
  return {
    padding:"8px 10px",
    borderRadius:8,
    background:"linear-gradient(135deg,#7c3aed,#06b6d4)",
    color:"#fff",
    border:"none",
    cursor:"pointer",
    textDecoration:"none"
  } as React.CSSProperties;
}
'@
Write-File ".\src\App.tsx" $app

# 3) http.ts — expõe get/post/... e apiGet/apiPost/... (compatibilidade)
$http = @'
import axios, { AxiosInstance } from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api: AxiosInstance = axios.create({ baseURL, timeout: 15000 });

export function get<T = any>(url: string, config: any = {}) { return api.get<T>(url, config); }
export function post<T = any>(url: string, data?: any, config: any = {}) { return api.post<T>(url, data, config); }
export function put<T = any>(url: string, data?: any, config: any = {}) { return api.put<T>(url, data, config); }
export function del<T = any>(url: string, config: any = {}) { return api.delete<T>(url, config); }

export const apiGet = get, apiPost = post, apiPut = put, apiDelete = del;
'@
Write-File ".\src\lib\http.ts" $http

# 4) features/games/api.ts — endpoints base
$gamesApi = @'
import { get, post, del } from "../../lib/http";

export type Game = {
  id: number;
  title: string;
  cover_url?: string;
  platform?: string | null;
  release_date?: string | null;
  slug?: string | null;
};

export async function listGamesPaged(
  offset = 0, limit = 30,
  opts?: { q?: string; sort?: string; order?: "asc" | "desc" }
){
  const params: any = { offset, limit };
  if (opts?.q) params.q = opts.q;
  if (opts?.sort) params.sort = opts.sort;
  if (opts?.order) params.order = opts.order;
  const { data } = await get<{ items: Game[]; total: number }>("/games/paged", { params });
  return data;
}

export async function searchProviders(q: string){
  const { data } = await get<any[]>("/providers/search", { params: { q } });
  return data;
}

export async function createGame(payload: Partial<Game>){
  const { data } = await post<Game>("/games", payload);
  return data;
}

export async function getGame(id: string | number){
  const { data } = await get<Game>(`/games/${id}`);
  return data;
}

export async function deleteGame(id: string | number){
  const { data } = await del(`/games/${id}`);
  return data;
}
'@
Write-File ".\src\features\games\api.ts" $gamesApi

# 5) pages/Library.tsx
$lib = @'
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { listGamesPaged, Game } from "../features/games/api";

export default function Library(){
  const [params, setParams] = useSearchParams();
  const [items, setItems] = React.useState<Game[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "added_at";
  const order = params.get("order") ?? "desc";
  const offset = Number(params.get("offset") ?? "0");
  const limit = Number(params.get("limit") ?? "30");

  React.useEffect(()=> {
    let alive = true;
    (async ()=>{
      setLoading(true);
      try{
        const page = await listGamesPaged(offset, limit, { q, sort, order: order as any });
        if (!alive) return;
        setItems(page.items ?? []);
        setTotal(page.total ?? 0);
      }catch(e){
        if (!alive) return;
        setItems([]); setTotal(0);
        console.warn("Falha a carregar jogos", e);
      }finally{
        if (alive) setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  }, [q, sort, order, offset, limit]);

  function update(param: string, value: string){
    const nx = new URLSearchParams(params);
    if (value) nx.set(param, value); else nx.delete(param);
    if (param !== "offset") nx.set("offset","0");
    setParams(nx, { replace: true });
  }

  return (
    <div>
      <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:12}}>
        <span style={{opacity:.75}}>Sort</span>
        <select value={sort} onChange={e=>update("sort", e.target.value)}>
          <option value="added_at">Adicionado</option>
          <option value="title">Nome</option>
          <option value="platform">Plataforma</option>
          <option value="release_date">Data</option>
        </select>
        <select value={order} onChange={e=>update("order", e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button onClick={()=>alert("Sidebar de filtros (UI) — por agora placeholder.")}>Filtros</button>
        <div style={{marginLeft:"auto", opacity:.6}}>{total} itens</div>
      </div>

      {loading && <div style={{opacity:.8}}>A carregar…</div>}
      {!loading && items.length===0 && <div>Sem resultados.</div>}

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16}}>
        {items.map(g=>(
          <Link key={g.id} to={`/game/${g.id}`} style={{textDecoration:"none"}}>
            <div style={{background:"#0b1320", borderRadius:12, overflow:"hidden", border:"1px solid #1c2a3a"}}>
              <div style={{aspectRatio:"3/4", background:"#111"}}>
                {g.cover_url ? (
                  <img src={g.cover_url} alt={g.title} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                ) : null}
              </div>
              <div style={{padding:"10px 12px", color:"#E6EDF3"}}>
                <div style={{fontWeight:600, marginBottom:6}}>{g.title}</div>
                <div style={{fontSize:12, opacity:.75}}>
                  {g.platform || "—"} {g.release_date ? ` • ${new Date(g.release_date).toISOString().slice(0,10)}` : ""}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
'@
Write-File ".\src\pages\Library.tsx" $lib

# 6) pages/Add.tsx
$add = @'
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
'@
Write-File ".\src\pages\Add.tsx" $add

# 7) pages/Settings.tsx
$settings = @'
import React from "react";

export default function Settings(){
  const [tab, setTab] = React.useState<"general"|"indexers"|"ui">("general");
  return (
    <div>
      <h2>Definições</h2>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <button onClick={()=>setTab("general")}>General</button>
        <button onClick={()=>setTab("indexers")}>Indexadores</button>
        <button onClick={()=>setTab("ui")}>UI</button>
      </div>
      {tab==="general" && <div>Configurações da aplicação (logs, segurança, base URL).</div>}
      {tab==="indexers" && <div>RAWG e outros providers.</div>}
      {tab==="ui" && <div>Formato de data/hora, tema e língua.</div>}
    </div>
  );
}
'@
Write-File ".\src\pages\Settings.tsx" $settings

# 8) pages/GameDetail.tsx
$detail = @'
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
'@
Write-File ".\src\pages\GameDetail.tsx" $detail

Write-Host ""
Write-Host "✔ Fix aplicado. Agora corre:" -ForegroundColor Green
Write-Host "   pwsh -File .\scripts\win\fix-router-ui.ps1"
Write-Host "Depois arranca a UI com: npm run dev"
