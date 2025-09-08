
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet, apiPost } from "../lib/http";

type Settings = {
  RAWG_API_KEY?: string;
  BARCODE_ENABLED?: boolean;
  TRACK_INTERVAL_MINUTES?: number;
  APP_BASE_URL?: string;
  THEME?: string;
  LOCALE?: string;
};

export default function SettingsPage(){
  const [tab,setTab] = useState<"general"|"indexers"|"ui">("general");
  const [s,setS] = useState<Settings>({});
  const [msg,setMsg] = useState<string|undefined>();

  useEffect(()=>{
    (async()=>{
      try{ const data = await apiGet<Settings>("/settings"); setS(data||{});}catch{}
    })();
  },[]);

  async function save(){
    await apiPost("/settings", s);
    setMsg("Guardado.");
    setTimeout(()=>setMsg(undefined),2000);
  }

  return (
    <Layout>
      <div className="tabs">
        <button className={`tab ${tab==='general'?'active':''}`} onClick={()=>setTab('general')}>Geral</button>
        <button className={`tab ${tab==='indexers'?'active':''}`} onClick={()=>setTab('indexers')}>Indexadores</button>
        <button className={`tab ${tab==='ui'?'active':''}`} onClick={()=>setTab('ui')}>UI</button>
      </div>

      {tab==='general' && (
        <div className="panel">
          <label>Base URL da app</label>
          <input value={s.APP_BASE_URL||""} onChange={e=>setS({...s, APP_BASE_URL:e.target.value})} />
          <label>Intervalo de sync (min)</label>
          <input type="number" value={s.TRACK_INTERVAL_MINUTES||15} onChange={e=>setS({...s, TRACK_INTERVAL_MINUTES: Number(e.target.value)})}/>
          <label>Logs / Segurança</label>
          <input placeholder="(placeholder)" />
        </div>
      )}

      {tab==='indexers' && (
        <div className="panel">
          <label>RAWG API Key</label>
          <input value={s.RAWG_API_KEY||""} onChange={e=>setS({...s, RAWG_API_KEY:e.target.value})} />
          <label>Leitura de barcode</label>
          <select value={s.BARCODE_ENABLED?"1":"0"} onChange={e=>setS({...s, BARCODE_ENABLED: e.target.value==='1'})}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
      )}

      {tab==='ui' && (
        <div className="panel">
          <label>Tema</label>
          <select value={s.THEME||"system"} onChange={e=>setS({...s, THEME:e.target.value})}>
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <label>Língua</label>
          <select value={s.LOCALE||"pt"} onChange={e=>setS({...s, LOCALE:e.target.value})}>
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={save}>Guardar</button>
        {msg && <span className="ok">{msg}</span>}
      </div>
    </Layout>
  );
}
