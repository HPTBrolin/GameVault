
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function FiltersDrawer({open, knownPlatforms, onClose}:{open:boolean, knownPlatforms:string[], onClose:()=>void}){
  const [sp, setSp] = useSearchParams();
  useEffect(()=>{
    function onEsc(e:KeyboardEvent){ if(e.key==="Escape") onClose(); }
    document.addEventListener("keydown", onEsc);
    return ()=> document.removeEventListener("keydown", onEsc);
  },[onClose]);

  function apply(e:React.FormEvent){
    e.preventDefault();
    const form=e.target as HTMLFormElement;
    const fd=new FormData(form);
    const next=new URLSearchParams(sp);
    for(const [k,v] of fd.entries()){
      if(v) next.set(k,String(v)); else next.delete(k);
    }
    next.set("offset","0");
    setSp(next,{replace:false});
    onClose();
  }

  function clearAll(){
    const next=new URLSearchParams(sp);
    ["platform","status","yearMin","yearMax"].forEach(k=>next.delete(k));
    next.set("offset","0");
    setSp(next,{replace:false});
  }

  return (
    <div className={"drawer "+(open?"open":"")}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel">
        <h3>Filtros</h3>
        <form onSubmit={apply} className="drawer-form">
          <label>Plataforma
            <select name="platform" defaultValue={sp.get("platform")||""}>
              <option value="">Todas</option>
              {knownPlatforms.map(p=> <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>Status
            <select name="status" defaultValue={sp.get("status")||""}>
              <option value="">Todos</option>
              <option value="owned">Owned</option>
              <option value="wishlist">Wish List</option>
              <option value="finished">Finished</option>
            </select>
          </label>
          <label>Ano mínimo
            <input name="yearMin" type="number" min="1970" max="2100" defaultValue={sp.get("yearMin")||""} />
          </label>
          <label>Ano máximo
            <input name="yearMax" type="number" min="1970" max="2100" defaultValue={sp.get("yearMax")||""} />
          </label>
          <div className="drawer-actions">
            <button type="button" className="btn" onClick={clearAll}>Limpar</button>
            <button type="submit" className="btn primary">Aplicar</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
