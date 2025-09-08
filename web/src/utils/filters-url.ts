// src/utils/filters-url.ts
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Sincroniza o estado do modal de filtros com o query param ?filters=1
 * e devolve helpers para abrir/fechar via URL.
 */
export function useFiltersUrlSync(setOpen: (v: boolean) => void){
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(params.get("filters") === "1");
  }, [params, setOpen]);

  function open(){
    const p = new URLSearchParams(params);
    p.set("filters","1");
    // força a home com o query param para manter o mesmo contexto
    navigate({ pathname: "/", search: p.toString() }, { replace: true });
  }

  function close(){
    const p = new URLSearchParams(params);
    p.delete("filters");
    setParams(p, { replace: true });
  }

  return { open, close };
}
