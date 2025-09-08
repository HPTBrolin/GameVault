// src/features/shared/urlState.ts
import { useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

export type SortOrder = "asc"|"desc";

export function useUrlState<T extends Record<string, any>>(defaults: T){
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const loc = useLocation();

  const state = useMemo(()=>{
    const obj: any = { ...defaults };
    for(const k of Object.keys(defaults)){
      const v = sp.get(k);
      if(v!==null){
        const dv = (defaults as any)[k];
        if(typeof dv === "number") obj[k] = Number(v);
        else if(typeof dv === "boolean") obj[k] = v === "1" || v === "true";
        else obj[k] = v;
      }
    }
    return obj as T;
  },[sp.toString()]);

  function setState(patch: Partial<T>, options?: { replace?: boolean }){
    const next = new URLSearchParams(sp);
    for(const [k,v] of Object.entries(patch)){
      if(v===undefined || v===null || v==="") next.delete(k);
      else next.set(k, String(v));
    }
    const url = `${loc.pathname}?${next.toString()}`;
    if(options?.replace) nav(url, { replace:true });
    else nav(url);
  }

  return [state, setState] as const;
}
