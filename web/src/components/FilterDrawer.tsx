import React, { useMemo, useState } from "react";

export type GameFilters = {
  q?: string;
  platform?: string;
  status?: string;
  sort?: "title" | "added" | "platform";
};

type Props = {
  open: boolean;
  value: GameFilters;
  onApply: (next: GameFilters) => void;
  onClose: () => void;
  onClear?: () => void;
};

const ALL_PLATFORMS = [
  "PC","Linux","Mac",
  "PlayStation 5","PlayStation 4","PlayStation 3","PlayStation 2","PlayStation",
  "PSP","PS Vita",
  "Xbox Series X|S","Xbox One","Xbox 360","Xbox",
  "Nintendo Switch","Wii U","Wii","GameCube","Nintendo 64","SNES","NES",
  "Game Boy","Game Boy Color","Game Boy Advance","Nintendo DS","Nintendo 3DS",
  "Dreamcast","Saturn","Mega Drive/Genesis","Master System",
  "Amiga","Atari 2600","Atari 7800","Atari Jaguar",
  "Other"
];

export default function FilterDrawer({ open, value, onApply, onClose, onClear }: Props){
  const [local, setLocal] = useState<GameFilters>(value || {});

  React.useEffect(()=>{ setLocal(value || {}) }, [value?.q, value?.platform, value?.status, value?.sort]);

  const className = useMemo(()=> "filter-drawer " + (open ? "open" : ""), [open]);

  const update = (patch: Partial<GameFilters>) => setLocal(prev => ({...prev, ...patch}));

  return (
    <>
      {open && <div className="filter-backdrop" onClick={onClose} />}
      <aside className={className} aria-hidden={!open}>
        <header>
          <h3>Filtros</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <div className="content">
          <label className="field">
            <span>Pesquisa</span>
            <input
              type="text"
              value={local.q || ""}
              placeholder="Título, barcode, série…"
              onChange={e => update({ q: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Plataforma</span>
            <select value={local.platform || ""} onChange={e=> update({ platform: e.target.value || undefined })}>
              <option value="">Todas</option>
              {ALL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Estado</span>
            <select value={local.status || ""} onChange={e=> update({ status: e.target.value || undefined })}>
              <option value="">Todos</option>
              <option value="owned">Owned</option>
              <option value="wishlist">Wish List</option>
              <option value="loaned">Emprestado</option>
            </select>
          </label>

          <label className="field">
            <span>Ordenar por</span>
            <select value={local.sort || "added"} onChange={e=> update({ sort: (e.target.value as any) })}>
              <option value="title">Nome</option>
              <option value="added">Adicionado</option>
              <option value="platform">Consola</option>
            </select>
          </label>
        </div>

        <footer>
          <button onClick={()=> onApply(local)} className="btn primary">Aplicar</button>
          <button onClick={()=> { onClear?.(); onClose(); }} className="btn ghost">Limpar</button>
        </footer>
      </aside>

      <style>{`
        .filter-backdrop{
          position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:99;
        }
        .filter-drawer{
          position:fixed; top:0; right:-360px; width:360px; height:100vh;
          background:#0f1115; color:#e5e7eb; border-left:1px solid #1f2430;
          box-shadow:-8px 0 24px rgba(0,0,0,.25);
          z-index:100; transition:right .25s ease;
          display:flex; flex-direction:column;
        }
        .filter-drawer.open{ right:0; }
        .filter-drawer header{ display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #1f2430;}
        .filter-drawer header h3{ margin:0; font-size:16px; font-weight:600; letter-spacing:.3px;}
        .filter-drawer .content{ padding:14px 18px; gap:14px; display:flex; flex-direction:column; overflow:auto;}
        .field{ display:flex; flex-direction:column; gap:6px; }
        .field span{ font-size:12px; color:#9aa4b2; }
        input, select{
          background:#0b0d11; border:1px solid #222938; color:#e5e7eb;
          border-radius:8px; padding:10px 12px; outline:none;
        }
        input:focus, select:focus{ border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.2);}
        footer{ margin-top:auto; padding:14px 18px; display:flex; gap:10px; border-top:1px solid #1f2430; }
        .btn{ padding:10px 12px; border-radius:8px; border:1px solid transparent; cursor:pointer;}
        .btn.primary{ background:#3b82f6; color:white;}
        .btn.ghost{ background:transparent; color:#cbd5e1; border-color:#2a3245;}
        .icon-btn{ background:transparent; border:none; color:#9aa4b2; font-size:20px; cursor:pointer;}
      `}</style>
    </>
  );
}
