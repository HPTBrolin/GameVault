// src/pages/Detail.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGame, updateGame, deleteGame, Game } from "/src/features/games/api";

export default function Detail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [g,setG] = React.useState<Game|null>(null);
  const [busy,setBusy] = React.useState(false);

  React.useEffect(()=>{
    (async()=>{
      if(!id) return;
      const data = await getGame(id);
      setG(data);
    })();
  },[id]);

  if(!id) return <div className="app">ID inválido</div>;
  if(!g) return <div className="app">A carregar…</div>;

  async function onSave(){
    setBusy(true);
    try{
      await updateGame(id, { title: g.title, platform: g.platform, status: g.status });
      nav("/");
    } finally{ setBusy(false) }
  }

  async function onDelete(){
    if(!confirm("Apagar este item?")) return;
    setBusy(true);
    try{
      await deleteGame(id);
      nav("/");
    } finally{ setBusy(false) }
  }

  return (
    <div className="app" style={{maxWidth:720, margin:"24px auto"}}>
      <h1>Detalhe</h1>
      <label>Título</label>
      <input value={g.title} onChange={e=>setG({...g!, title:e.target.value})} />
      <label>Plataforma</label>
      <input value={g.platform||""} onChange={e=>setG({...g!, platform:e.target.value})} />
      <div style={{display:"flex", gap:10, marginTop:12}}>
        <button className="btn primary" onClick={onSave} disabled={busy}>{busy?"A guardar…":"Guardar"}</button>
        <button className="btn ghost" onClick={()=>nav(-1)} disabled={busy}>Voltar</button>
        <button className="btn secondary" onClick={onDelete} disabled={busy}>Apagar</button>
      </div>
      <p className="muted small" style={{marginTop:8}}>Sem internet? As alterações entram na fila e sincronizam depois.</p>
    </div>
  );
}
