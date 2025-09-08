import { Link } from "react-router-dom";
import type { CardGame } from "../types";

export default function List({ items }: { items: CardGame[] }){
  return (
    <table className="list">
      <thead><tr><th>Título</th><th>Plataforma</th><th>Estado</th></tr></thead>
      <tbody>
        {items.length===0 && <tr><td colSpan={3} className="empty">Sem resultados.</td></tr>}
        {items.map(it=> (
          <tr key={it.id}>
            <td><Link to={`/game/${it.id}`}>{it.title}</Link></td>
            <td>{it.platform || '—'}</td>
            <td>{it.status || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
