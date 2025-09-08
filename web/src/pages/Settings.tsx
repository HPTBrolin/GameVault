import React from "react";
import { get, post } from "../lib/http";

type Settings = {
  RAWG_API_KEY?: string;
  BARCODE_API_URL?: string;
  TRACK_INTERVAL_MINUTES?: number;
  PREFERRED_LANG?: string;
  THEME?: "system"|"dark"|"light";
  DATE_FMT?: string;
};

const TabNames = ["General","Indexadores","UI"] as const;
type Tab = typeof TabNames[number];

export default function SettingsPage(){
  const [tab, setTab] = React.useState<Tab>("General");
  const [s, setS] = React.useState<Settings| null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  React.useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const data = await get<Settings>("/settings");
        setS(data || {});
      }catch(e:any){
        setMsg("Não foi possível carregar as definições.");
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  const up = (patch: Partial<Settings>)=> setS(prev => ({ ...(prev || {}), ...patch }));

  const save = async ()=>{
    if(!s) return;
    setSaving(true);
    setMsg("");
    try{
      await post("/settings", s);
      setMsg("Definições guardadas.");
    }catch(err:any){
      setMsg("Falha ao guardar. Verifica a API.");
    }finally{
      setSaving(false);
    }
  };

  return (
    <div className="page settings">
      <div className="tabs">
        {TabNames.map(t=> (
          <button key={t} className={t===tab?"active":""} onClick={()=> setTab(t)}>{t}</button>
        ))}
      </div>

      {loading && <div className="panel">A carregar…</div>}
      {!loading && s && (
        <div className="panel">
          {tab==="General" && (
            <div className="grid">
              <label className="field">
                <span>URL da Aplicação</span>
                <input disabled value={location.origin} />
                <small>Definido automaticamente.</small>
              </label>

              <label className="field">
                <span>Intervalo de tracking (min)</span>
                <input type="number" value={s.TRACK_INTERVAL_MINUTES ?? 60} onChange={e=> up({ TRACK_INTERVAL_MINUTES: parseInt(e.target.value || "60")})} />
              </label>
            </div>
          )}

          {tab==="Indexadores" && (
            <div className="grid">
              <label className="field">
                <span>RAWG API Key</span>
                <input value={s.RAWG_API_KEY || ""} onChange={e=> up({ RAWG_API_KEY: e.target.value })} placeholder="pk_..." />
                <small>Usada para pesquisa e lançamentos.</small>
              </label>

              <label className="field">
                <span>Barcode API URL</span>
                <input value={s.BARCODE_API_URL || ""} onChange={e=> up({ BARCODE_API_URL: e.target.value })} placeholder="https://.../barcode" />
              </label>
            </div>
          )}

          {tab==="UI" && (
            <div className="grid">
              <label className="field">
                <span>Tema</span>
                <select value={s.THEME || "system"} onChange={e=> up({ THEME: e.target.value as any })}>
                  <option value="system">Sistema</option>
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                </select>
              </label>
              <label className="field">
                <span>Formato de Data</span>
                <input value={s.DATE_FMT || "yyyy-MM-dd"} onChange={e=> up({ DATE_FMT: e.target.value })} />
              </label>
              <label className="field">
                <span>Língua</span>
                <select value={s.PREFERRED_LANG || "pt"} onChange={e=> up({ PREFERRED_LANG: e.target.value })}>
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>
          )}

          <div className="actions">
            <button className="btn primary" onClick={save} disabled={saving}>{saving? "A guardar…" : "Guardar"}</button>
            {msg && <span className="msg">{msg}</span>}
          </div>
        </div>
      )}

      <style>{`
        .page.settings{ padding:16px; color:#e5e7eb; }
        .tabs{ display:flex; gap:8px; margin-bottom:12px;}
        .tabs button{ background:#0b0d11; border:1px solid #1f2430; color:#9aa4b2; padding:8px 12px; border-radius:8px; cursor:pointer;}
        .tabs button.active{ color:#fff; border-color:#3b82f6; background:#0e1320; }
        .panel{ background:#0f1115; border:1px solid #1f2430; border-radius:12px; padding:14px;}
        .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px;}
        .field{ display:flex; flex-direction:column; gap:6px;}
        .field span{ font-size:12px; color:#9aa4b2;}
        input, select{ background:#0b0d11; border:1px solid #222938; color:#e5e7eb; border-radius:8px; padding:10px 12px;}
        .actions{ margin-top:14px; display:flex; align-items:center; gap:10px;}
        .msg{ color:#9aa4b2; font-size:12px;}
        .btn.primary{ background:#3b82f6; color:#fff; border:none; padding:10px 12px; border-radius:8px; cursor:pointer;}
      `}</style>
    </div>
  );
}
