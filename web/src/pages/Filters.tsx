
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Filters(){
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  function apply(e:React.FormEvent){
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const next = new URLSearchParams(sp);
    for(const [k,v] of fd.entries()){
      if(v) next.set(k, String(v)); else next.delete(k);
    }
    next.set("offset", "0");
    setSp(next, { replace:false });
    navigate("/", { replace:true });
  }

  return (
    <div className="page-blank">
      <h1>Filtros</h1>
      <form onSubmit={apply} style={{display:"grid", gap:12, maxWidth:380}}>
        <label>Plataforma
          <input name="platform" placeholder="ex.: PS5" defaultValue={sp.get("platform")||""} />
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
        <div style={{display:"flex", gap:8}}>
          <button className="btn primary" type="submit">Aplicar</button>
          <button className="btn" type="button" onClick={()=>{ const next=new URLSearchParams(sp); ["platform","status","yearMin","yearMax"].forEach(k=>next.delete(k)); next.set("offset","0"); setSp(next,{replace:false}); navigate("/",{replace:true}); }}>Limpar</button>
        </div>
      </form>
    </div>
  );
}
