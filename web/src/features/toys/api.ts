// src/features/toys/api.ts
import { api, postOrQueue, putOrQueue, deleteOrQueue } from "../../lib/http";

export interface ToyItem {
  id?: number;
  title: string;
  toy_series?: string | null;
  toy_id?: string | null;
  status?: "owned"|"wishlist"|"loaned"|string;
  cover_url?: string | null;
  added_at?: string | null;
}

export interface Page<T>{ items:T[]; total:number; offset:number; limit:number }

export async function listToys(): Promise<ToyItem[]>{
  const res = await api.get("/toys");
  return res.data ?? [];
}

export async function listToysPaged(params: {offset:number;limit:number; q?:string; sort?:string; order?:"asc"|"desc"}): Promise<Page<ToyItem>>{
  try{
    const res = await api.get("/toys/paged", { params });
    return res.data;
  }catch{
    // fallback: client-side paging
    const all = await listToys();
    let items = all;
    if(params.q){
      const q = params.q.toLowerCase();
      items = items.filter(x => (x.title||"").toLowerCase().includes(q) || (x.toy_series||"").toLowerCase().includes(q));
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

export async function getToy(id:number|string){
  const res = await api.get(`/toys/${id}`);
  return res.data;
}

export async function createToy(payload: Partial<ToyItem>){
  return await postOrQueue("/toys", payload);
}

export async function updateToy(id:number|string, payload: Partial<ToyItem>){
  return await putOrQueue(`/toys/${id}`, payload);
}

export async function deleteToy(id:number|string){
  return await deleteOrQueue(`/toys/${id}`);
}
