import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlatforms } from '../features/providers/api';

const FilterDrawer: React.FC<{open:boolean,onClose:()=>void}> = ({open,onClose}) => {
  const [sp, setSp] = useSearchParams();
  const [platforms, setPlatforms] = useState<{id:string|number, name:string}[]>([]);

  const sort = sp.get('sort') || 'added_at';
  const order = sp.get('order') || 'desc';
  const platform = sp.get('platform') || '';

  useEffect(()=>{
    (async ()=>{
      try {
        const list = await getPlatforms();
        setPlatforms(list);
      } catch {
        setPlatforms([
          {id:'PC', name:'PC'},
          {id:'PS5', name:'PlayStation 5'},
          {id:'XBOX', name:'Xbox Series'},
          {id:'SWITCH', name:'Nintendo Switch'}
        ]);
      }
    })();
  },[]);

  function apply(){
    if(platform) sp.set('platform', platform); else sp.delete('platform');
    sp.set('sort', sort); sp.set('order', order); sp.set('page', '1');
    setSp(sp, {replace:false}); onClose();
  }

  return (
    <div className={`drawer ${open?'open':''}`} aria-hidden={!open}>
      <div className="drawer-header">
        <h3>Filtros</h3>
        <button className="btn" onClick={onClose}>Fechar</button>
      </div>
      <div className="drawer-body">
        <label>Plataforma</label>
        <select value={platform} onChange={e=>{ const v=e.target.value; v? sp.set('platform',v): sp.delete('platform'); setSp(sp); }}>
          <option value="">Todas</option>
          {platforms.map(p=> <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <label>Sort By</label>
        <select value={sort} onChange={e=>{ sp.set('sort', e.target.value); setSp(sp); }}>
          <option value="title">Nome</option>
          <option value="added_at">Adicionado</option>
          <option value="platform">Console</option>
        </select>

        <label>Ordem</label>
        <select value={order} onChange={e=>{ sp.set('order', e.target.value); setSp(sp); }}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <div className="drawer-footer">
        <button className="btn" onClick={apply}>Aplicar</button>
      </div>
    </div>
  );
};

export default FilterDrawer;
