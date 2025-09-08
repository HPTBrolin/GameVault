import React from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  placeholder?: string;
  onFilters?: ()=>void;
};
export default function Topbar({ placeholder="Pesquisar…", onFilters }: Props){
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <header className="gv-topbar">
      <div className="search">
        <input
          value={q}
          onChange={(e)=>{ const p=new URLSearchParams(params); p.set("q", e.target.value); p.set("offset","0"); setParams(p); }}
          placeholder={placeholder}
        />
      </div>
      <div className="actions">
        <button className="btn ghost" title="View">👁️ View</button>
        <button className="btn ghost" title="Sort">↕️ Sort</button>
        <button className="btn grad" title="Filters" onClick={onFilters}>⚙️ Filters</button>
      </div>
    </header>
  );
}
