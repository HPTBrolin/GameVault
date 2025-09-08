import { useEffect, useState } from "react";
import { apiGet } from "../lib/http";

type Upcoming = {
  provider: string;
  slug: string;
  title: string;
  release_date?: string | null;
  cover_url?: string | null;
  platforms?: string[];
  platform?: string | null;
};

export default function Calendar() {
  const [items, setItems] = useState<Upcoming[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet<Upcoming[]>("/releases/upcoming", { params: { days: 60, limit: 20 } });
        if (mounted) setItems(data || []);
      } catch (e: any) {
        setError(e?.message || "Erro");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 16 }}>A carregar…</div>;
  if (error) return <div style={{ padding: 16, color: "tomato" }}>Falha ao carregar lançamentos: {String(error)}</div>;

  if (!items.length) {
    return <div style={{ padding: 16 }}>Sem lançamentos próximos.</div>;
  }

  return (
    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
      {items.map((g) => (
        <div key={g.slug} style={{ borderRadius: 8, background: "var(--card, #1f2937)", overflow: "hidden", border: "1px solid #30363d" }}>
          {g.cover_url ? (
            <img src={g.cover_url} alt={g.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "16/9", background: "#2a2a2a" }} />
          )}
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{g.title}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{g.release_date || "TBA"}</div>
            {g.platform && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{g.platform}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
