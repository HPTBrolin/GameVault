import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PLATFORMS } from "../utils/config";

export default function FilterDrawer(){
  const [open,setOpen] = useState(false);
  const [sp, setSp] = useSearchParams();
  const [platform, setPlatform] = useState(sp.get("platform") || "");
  const [status, setStatus] = useState(sp.get("status") || "");

  useEffect(()=>{
    const onOpen = ()=>setOpen(true);
    document.addEventListener("open-filters", onOpen);
    return ()=>document.removeEventListener("open-filters", onOpen);
  },[]);

  function apply(){
    const next = new URLSearchParams(sp);
    platform ? next.set("platform", platform) : next.delete("platform");
    status ? next.set("status", status) : next.delete("status");
    setSp(next);
    setOpen(false);
  }

  if(!open) return null;
  return (
    <div className="drawer">
      <div className="panel">
        <div className="row">
          <label>Plataforma</label>
          <select value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option value="">Todas</option>
            {PLATFORMS.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="row">
          <label>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="owned">owned</option>
            <option value="wishlist">wishlist</option>
            <option value="digital">digital</option>
          </select>
        </div>
        <div className="actions">
          <button className="btn" onClick={()=>setOpen(false)}>Cancelar</button>
          <button className="btn primary" onClick={apply}>Aplicar</button>
        </div>
      </div>
    </div>
  );
}
