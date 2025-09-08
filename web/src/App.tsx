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
