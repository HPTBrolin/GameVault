
import React from "react";

type Props = {
  open: boolean;
  onClose: ()=>void;
  filters: any;
  onChange: (f:any)=>void;
  platforms: string[];
};

export default function FilterPanel({open,onClose,filters,onChange,platforms}:Props){
  return (
    <div className={`drawer ${open?"open":""}`}>
      <div className="drawer-inner">
        <div className="drawer-header">
          <h3>Filtros</h3>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="drawer-body">
          <label>Pesquisa</label>
          <input value={filters.q||""} onChange={e=>onChange({...filters,q:e.target.value})} placeholder="Pesquisar por nome"/>

          <label>Plataforma</label>
          <select value={filters.platform||""} onChange={e=>onChange({...filters,platform:e.target.value||undefined})}>
            <option value="">Todas</option>
            {platforms.map(p=><option key={p} value={p}>{p}</option>)}
          </select>

          <label>Estado</label>
          <select value={filters.status||""} onChange={e=>onChange({...filters,status:e.target.value||undefined})}>
            <option value="">Todos</option>
            <option value="owned">Owned</option>
            <option value="wishlist">Wishlist</option>
            <option value="playing">Playing</option>
          </select>

          <label>Ordenação</label>
          <select value={filters.sort||"added"} onChange={e=>onChange({...filters,sort:e.target.value})}>
            <option value="name">Nome</option>
            <option value="added">Adicionado</option>
            <option value="console">Consola</option>
          </select>
        </div>
      </div>
    </div>
  );
}
