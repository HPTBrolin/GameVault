import { Link } from "react-router-dom";
import type { CardGame } from "../types";

export default function Card({ item }: { item: CardGame }){
  return (
    <Link to={`/game/${item.id}`} className="card">
      <div className="thumb">
        {item.cover_url ? <img src={item.cover_url} alt={item.title}/> : <div className="ph" />}
      </div>
      <div className="title" title={item.title}>{item.title}</div>
      <div className="sub">{item.subtitle || item.platform || '—'}</div>
      {item.status && <div className="badge">{item.status}</div>}
    </Link>
  );
}
