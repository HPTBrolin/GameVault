import React from "react";

export default function Settings(){
  const [tab, setTab] = React.useState<"general"|"indexers"|"ui">("general");
  return (
    <div>
      <h2>Definições</h2>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <button onClick={()=>setTab("general")}>General</button>
        <button onClick={()=>setTab("indexers")}>Indexadores</button>
        <button onClick={()=>setTab("ui")}>UI</button>
      </div>
      {tab==="general" && <div>Configurações da aplicação (logs, segurança, base URL).</div>}
      {tab==="indexers" && <div>RAWG e outros providers.</div>}
      {tab==="ui" && <div>Formato de data/hora, tema e língua.</div>}
    </div>
  );
}
