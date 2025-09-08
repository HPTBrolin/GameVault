import React from "react";
import { useNavigate } from "react-router-dom";
import { createHardware } from "/src/features/hardware/api";

export default function AddHardware(){
  const nav = useNavigate();
  const [title,setTitle] = React.useState("");
  const [platform,setPlatform] = React.useState("");
  const [hw_model,setModel] = React.useState("");
  const [serial_number,setSerial] = React.useState("");
  const [busy,setBusy] = React.useState(false);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!title.trim()) return;
    setBusy(true);
    try{
      await createHardware({ title, platform, hw_model, serial_number, status:"owned" });
      nav("/");
    } finally{ setBusy(false) }
  }

  return (
    <div className="app" style={{maxWidth:720, margin:"24px auto"}}>
      <h1>Adicionar hardware</h1>
      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nome" />
        <input value={platform} onChange={e=>setPlatform(e.target.value)} placeholder="Plataforma (ex.: Nintendo 64)" />
        <input value={hw_model} onChange={e=>setModel(e.target.value)} placeholder="Modelo" />
        <input value={serial_number} onChange={e=>setSerial(e.target.value)} placeholder="Número de série" />
        <button className="btn primary" disabled={busy}>{busy ? "A guardar…" : "Guardar"}</button>
      </form>
      <p className="muted small" style={{marginTop:8}}>Sem internet? Entra em fila e sincroniza depois.</p>
    </div>
  );
}
