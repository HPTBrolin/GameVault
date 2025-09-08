// src/components/AddMenu.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function AddMenu(){
  const [open,setOpen] = React.useState(false);
  React.useEffect(()=>{
    const onDoc=(e:MouseEvent)=>{
      const target=e.target as HTMLElement;
      if(!target.closest?.(".add-menu")) setOpen(false);
    };
    document.addEventListener("click",onDoc);
    return ()=>document.removeEventListener("click",onDoc);
  },[]);

  return (
    <div className="add-menu" style={{position:"relative"}}>
      <button className="btn primary" onClick={()=>setOpen(o=>!o)}>
        <span style={{marginRight:8}}>＋</span> Adicionar
      </button>
      {open && (
        <div style={dropdownStyle}>
          <Link to="/games/add" className="item">🎮 Jogo</Link>
          <Link to="/hardware/add" className="item">🛠️ Hardware</Link>
          <Link to="/toys/add" className="item">🧸 Toy‑to‑Life</Link>
        </div>
      )}
    </div>
  );
}

const dropdownStyle: React.CSSProperties = {
  position:"absolute", top:"110%", right:0, minWidth:180,
  background:"rgba(15,23,42,.9)", border:"1px solid rgba(148,163,184,.25)",
  borderRadius:12, padding:8, boxShadow:"0 10px 30px rgba(2,8,23,.35)",
};

// util CSS de exemplo (opcional): podes integrar no teu CSS global
export const addMenuCss = `
.add-menu .item{ display:block; padding:8px 10px; border-radius:8px; color:#e5e7eb; text-decoration:none; font-weight:700 }
.add-menu .item:hover{ background:rgba(99,102,241,.18) }
`;
