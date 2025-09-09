import React from "react";
import { searchProviders, ProviderResult } from "../features/providers/api";
import { createGame } from "../features/games/api";

export default function Add() {
  const [q, setQ] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [items, setItems] = React.useState<ProviderResult[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await searchProviders(q);
      setItems(res);
    } catch (e: any) {
      setErr(e?.message || "Falhou a pesquisa");
    } finally { setBusy(false); }
  }

  async function doAdd(it: ProviderResult, platform?: string) {
    setBusy(true); setErr(null);
    try {
      await createGame({
        title: it.title,
        externalId: it.externalId || it.slug || null,
        provider: it.provider,
        coverUrl: it.image || null,
        releaseDate: it.released || null,
        platform,
      });
      alert("Adicionado!");
    } catch (e: any) {
      setErr(e?.message || "Falhou ao adicionar.");
    } finally { setBusy(false); }
  }

  return (
    <div className="page">
      <form onSubmit={doSearch} className="searchbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar no RAWG…"
        />
        <button disabled={busy}>Pesquisar</button>
      </form>

      {err && <div className="err">{err}</div>}

      <div className="grid">
        {items.map((it, i) => (
          <div key={i} className="card">
            {it.image ? <img src={it.image} alt="" /> : <div className="ph" />}
            <div className="meta">
              <div className="t">{it.title}</div>
              <div className="s">
                {(it.platforms || []).slice(0, 3).join(" • ")}
                {it.released ? ` • ${it.released}` : ""}
              </div>
              <div className="row">
                <select defaultValue="">
                  <option value="" disabled>Plataforma…</option>
                  {(it.platforms || []).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button onClick={(e)=>{
                  const select = (e.currentTarget.previousSibling as HTMLSelectElement);
                  doAdd(it, select?.value || undefined);
                }} disabled={busy}>Adicionar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page { padding: 16px; }
        .searchbar { display:flex; gap:8px; margin-bottom: 12px; }
        .searchbar input { flex:1; padding:8px 10px; }
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:16px; }
        .card { background:#111827; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,.3); display:flex; flex-direction:column; }
        .card img, .card .ph { width:100%; height:160px; object-fit:cover; background:#1f2937; }
        .meta { padding:10px; display:flex; flex-direction:column; gap:6px; }
        .t { font-weight:600; }
        .s { font-size:12px; opacity:.8; }
        .row { display:flex; gap:8px; }
        select, button { padding:8px 10px; border-radius:8px; border:1px solid #374151; background:#0f172a; color:#e5e7eb; }
        button { cursor:pointer; border-color:#2563eb; }
        .err{ background:#7f1d1d; color:#fff; padding:8px; border-radius:8px; margin:8px 0;}
      `}</style>
    </div>
  );
}
