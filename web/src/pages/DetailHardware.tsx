import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHardware, updateHardware, deleteHardware, Hardware } from "/src/features/hardware/api";

export default function DetailHardware(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item,setItem] = React.useState<Hardware|null>(null);
  const [busy,setBusy] = React.useState(false);

  React.useEffect(()=>{
    (async()=>{
      if(!id) return;
      const data = await getHardware(id);
      setItem(data);
    })();
  },[id]);

  if(!id) return <div className="app">ID inválido</div>;
  if(!item) return <div className="app">A carregar…</div>;

  async function onSave(){
    setBusy(true);
    try{
      await updateHardware(id, item!);
      nav("/");
    } finally{ setBusy(false) }
  }

  async function onDelete(){
    if(!confirm("Apagar este hardware?")) return;
    setBusy(true);
    try{
      await deleteHardware(id);
      nav("/");
    } finally{ setBusy(false) }
  }

  return (
    <div className="app" style={{maxWidth:720, margin:"24px auto"}}>
      <h1>Hardware</h1>
      <label>Nome</label>
      <input value={item.title} onChange={e=>setItem({...item!, title: e.target.value})} />
      <label>Plataforma</label>
      <input value={item.platform||""} onChange={e=>setItem({...item!, platform: e.target.value})} />
      <label>Modelo</label>
      <input value={item.hw_model||""} onChange={e=>setItem({...item!, hw_model: e.target.value})} />
      <label>Nº série</label>
      <input value={item.serial_number||""} onChange={e=>setItem({...item!, serial_number: e.target.value})} />
      <div style={{display:"flex", gap:10, marginTop:12}}>
        <button className="btn primary" onClick={onSave} disabled={busy}>{busy?"A guardar…":"Guardar"}</button>
        <button className="btn ghost" onClick={()=>nav(-1)} disabled={busy}>Voltar</button>
        <button className="btn secondary" onClick={onDelete} disabled={busy}>Apagar</button>
      </div>
    </div>
  );
}
