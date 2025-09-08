import Card from "./Card";
import type { CardGame } from "../types";

export default function Grid({ items }: { items: CardGame[] }){
  return (
    <div className="grid">
      {items.map(it => <Card key={it.id} item={it} />)}
      {items.length === 0 && <div className="empty">Sem resultados.</div>}
    </div>
  );
}
