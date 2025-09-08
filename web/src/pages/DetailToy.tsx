import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToy, updateToy, deleteToy, ToyItem } from "/src/features/toys/api";

export default function DetailToy(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item,setItem] = React.useState<ToyItem|null>(null);
  const [busy,setBusy] = React.useState(false);

  React.useEffect(()=>{
    (async()=>{
      if(!id) return;
      const data = await getToy(id);
      setItem(data);
    })();
  },[id]);

  if(!id) return <div className="app">ID inválido</div>;
  if(!item) return <div className="app">A carregar…</div>;

  async function onSave(){
    setBusy(true);
    try{
      await updateToy(id, item!);
      nav("/");
    } finally{ setBusy(false) }
  }

  async function onDelete(){
    if(!confirm("Apagar este item?")) return;
    setBusy(true);
    try{
      await deleteToy(id);
      nav("/");
    } finally{ setBusy(false) }
  }

  return (
    <div className="app" style={{maxWidth:720, margin:"24px auto"}}>
      <h1>Toy-to-Life</h1>
      <label>Nome</label>
      <input value={item.title} onChange={e=>setItem({...item!, title: e.target.value})} />
      <label>Série</label>
      <input value={item.toy_series||""} onChange={e=>setItem({...item!, toy_series: e.target.value})} />
      <label>ID</label>
      <input value={item.toy_id||""} onChange={e=>setItem({...item!, toy_id: e.target.value})} />
      <div style={{display:"flex", gap:10, marginTop:12}}>
        <button className="btn primary" onClick={onSave} disabled={busy}>{busy?"A guardar…":"Guardar"}</button>
        <button className="btn ghost" onClick={()=>nav(-1)} disabled={busy}>Voltar</button>
        <button className="btn secondary" onClick={onDelete} disabled={busy}>Apagar</button>
      </div>
    </div>
  );
}
