import React from "react";
import { useNavigate } from "react-router-dom";
import { createToy } from "/src/features/toys/api";

export default function AddToy(){
  const nav = useNavigate();
  const [title,setTitle] = React.useState("");
  const [toy_series,setSeries] = React.useState("");
  const [toy_id,setToyId] = React.useState("");
  const [busy,setBusy] = React.useState(false);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!title.trim()) return;
    setBusy(true);
    try{
      await createToy({ title, toy_series, toy_id, status:"owned" });
      nav("/");
    } finally{ setBusy(false) }
  }

  return (
    <div className="app" style={{maxWidth:720, margin:"24px auto"}}>
      <h1>Adicionar Toy-to-Life</h1>
      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nome" />
        <input value={toy_series} onChange={e=>setSeries(e.target.value)} placeholder="Série" />
        <input value={toy_id} onChange={e=>setToyId(e.target.value)} placeholder="ID do brinquedo" />
        <button className="btn primary" disabled={busy}>{busy ? "A guardar…" : "Guardar"}</button>
      </form>
      <p className="muted small" style={{marginTop:8}}>Sem internet? Entra em fila e sincroniza depois.</p>
    </div>
  );
}
