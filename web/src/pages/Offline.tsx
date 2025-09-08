import React from "react";
export default function Offline() {
  return (
    <div style={{display:"grid",placeItems:"center",minHeight:"70vh"}}>
      <div style={{border:"1px solid rgba(148,163,184,.25)",borderRadius:12,padding:24,background:"rgba(10,13,23,.8)"}}>
        <h1 style={{marginTop:0}}>Estás offline</h1>
        <p>Algumas ações podem não funcionar. O conteúdo já sincronizado continua disponível.</p>
      </div>
    </div>
  );
}
