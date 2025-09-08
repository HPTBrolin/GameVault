// src/features/hardware/api.ts
import { api, postOrQueue, putOrQueue, deleteOrQueue } from "../../lib/http";

export interface Hardware {
  id?: number;
  title: string;
  platform?: string | null;
  hw_model?: string | null;
  serial_number?: string | null;
  status?: "owned"|"wishlist"|"loaned"|"repair"|string;
  condition?: string | null;
  cover_url?: string | null;
  added_at?: string | null;
}

export interface Page<T>{ items:T[]; total:number; offset:number; limit:number }

export async function listHardware(): Promise<Hardware[]>{
  const res = await api.get("/hardware");
  return res.data ?? [];
}

export async function listHardwarePaged(params: {offset:number;limit:number; q?:string; sort?:string; order?:"asc"|"desc"}): Promise<Page<Hardware>>{
  try{
    const res = await api.get("/hardware/paged", { params });
    return res.data;
  }catch{
    // fallback: client-side paging
    const all = await listHardware();
    let items = all;
    if(params.q){
      const q = params.q.toLowerCase();
      items = items.filter(x => (x.title||"").toLowerCase().includes(q) || (x.platform||"").toLowerCase().includes(q));
    }
    const sort = params.sort || "title";
    const order = params.order || "asc";
    items = [...items].sort((a:any,b:any)=>{
      const av = (a[sort] ?? "").toString().toLowerCase();
      const bv = (b[sort] ?? "").toString().toLowerCase();
      if(av < bv) return order==="asc"? -1 : 1;
      if(av > bv) return order==="asc"? 1 : -1;
      return 0;
    });
    const total = items.length;
    const slice = items.slice(params.offset, params.offset+params.limit);
    return { items:slice, total, offset:params.offset, limit:params.limit };
  }
}

export async function getHardware(id:number|string): Promise<Hardware>{
  const res = await api.get(`/hardware/${id}`);
  return res.data;
}

export async function createHardware(payload: Partial<Hardware>): Promise<Hardware>{
  return await postOrQueue("/hardware", payload);
}

export async function updateHardware(id:number|string, payload: Partial<Hardware>): Promise<Hardware>{
  return await putOrQueue(`/hardware/${id}`, payload);
}

export async function deleteHardware(id:number|string): Promise<{ok:boolean}>{
  return await deleteOrQueue(`/hardware/${id}`);
}
