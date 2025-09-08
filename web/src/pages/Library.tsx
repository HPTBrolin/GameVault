import { useEffect, useState } from "react";
import { listGamesPaged } from "../features/games/api";

type Card = {
  id: number;
  title: string;
  platform?: string;
  release_date?: string;
  cover_url?: string;
};

export default function Library() {
  const [items, setItems] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const page = await listGamesPaged(0, 30, {});
        if (!cancelled) {
          setItems(page?.items ?? []);
          setTotal(page?.total ?? 0);
        }
      } catch (e) {
        console.error("Falha a carregar jogos", e);
        if (!cancelled) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {loading && <div>A carregar…</div>}
      {!loading && items.length === 0 && <div>Sem resultados.</div>}
      {!loading && items.length > 0 && (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {items.map(g => (
            <div key={g.id} style={{ background: "#111826", borderRadius: 8, padding: 12 }}>
              <div style={{ height: 280, background: "#0b1220", borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                {g.cover_url ? <img src={g.cover_url} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              </div>
              <div style={{ fontWeight: 600 }}>{g.title}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{g.platform || ""} {g.release_date ? `• ${g.release_date}` : ""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
