// src/components/AppFiltersGlue.tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function clearFiltersQuerySync(){
  const url = new URL(window.location.href);
  url.searchParams.delete("filters");
  const q = url.searchParams.toString();
  const next = url.pathname + (q ? `?${q}` : "");
  window.history.replaceState(null, "", next);
}

/**
 * Componente "cola" que mantém setOpen sincronizado com ?filters=1.
 * Usa-o no topo do App.tsx: <AppFiltersGlue setOpen={setFiltersOpen} />
 */
export default function AppFiltersGlue({ setOpen }: { setOpen: (v: boolean)=>void }){
  const [params] = useSearchParams();
  useEffect(() => {
    setOpen(params.get("filters") === "1");
  }, [params, setOpen]);
  return null;
}
