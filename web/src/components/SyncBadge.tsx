// src/components/SyncBadge.tsx
import React from "react";
import { useSync } from "../lib/sync";

export default function SyncBadge(){
  const { status, pending } = useSync();
  const busy = status === "syncing";
  if (!busy && pending <= 0) return null;
  return (
    <div style={wrap}>
      <span style={dot(busy)} /> 
      <span>{busy ? "Sync em curso" : "Aguardando sync"}</span>
      {pending>0 && <span style={pill}>{pending} alteração{pending>1?"s":""} por sincronizar</span>}
    </div>
  );
}

const wrap: React.CSSProperties = {
  display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:999,
  background:"rgba(148,163,184,.12)", border:"1px solid rgba(148,163,184,.24)", fontSize:12
};

const dot = (busy:boolean): React.CSSProperties => ({
  width:8, height:8, borderRadius:999, background: busy? "deepskyblue":"gray", 
  boxShadow: busy? "0 0 0 6px rgba(0,191,255,.15)": "none", animation: busy? "pulse 1.2s infinite": "none"
});

const pill: React.CSSProperties = {
  marginLeft:6, padding:"2px 8px", borderRadius:999, background:"rgba(59,130,246,.2)", fontWeight:600
};
