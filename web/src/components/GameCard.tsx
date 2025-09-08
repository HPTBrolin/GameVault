import React from "react";
import { Link } from "react-router-dom";
export type CardGame = {
  id:number;
  title:string;
  platform?:string|null;
  year?:number|null;
  cover_url?:string|null;
};
export default function GameCard({g}:{g:CardGame}){
  const cover = g.cover_url || "https://placehold.co/400x600/0b1018/8aa?text=No+Cover";
  return (
    <Link to={`/game/${g.id}`} className="card" title={g.title}>
      <img className="thumb" src={cover} alt={g.title}/>
      <div className="meta">
        <div style={{fontWeight:600, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{g.title}</div>
        <div className="badge">{g.platform||"—"} {g.year?`· ${g.year}`:''}</div>
      </div>
    </Link>
  );
}
