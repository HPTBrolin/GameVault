import { get, post, del as _del, apiGet } from "../../lib/http";

export type Game = {
  id?: number;
  title: string;
  platform?: string;
  cover_url?: string;
  status?: "owned"|"wishlist"|"loaned";
  added_at?: string;
  slug?: string;
};

export type Paged<T> = { items: T[]; total: number; offset: number; limit: number };

export async function listGamesPagedByPage(page:number, pageSize:number, filters?: any): Promise<Paged<Game>>{
  const offset = Math.max(0, (page-1)*pageSize);
  const params:any = { offset, limit: pageSize };
  if(filters?.q) params.q = filters.q;
  if(filters?.platform) params.platform = filters.platform;
  if(filters?.status) params.status = filters.status;
  if(filters?.sort) params.sort = filters.sort;
  return await get<Paged<Game>>("/games/paged", params);
}

export async function getGame(id:string|number): Promise<Game>{
  return await get<Game>(`/games/${id}`);
}

export async function createGame(payload: Partial<Game>): Promise<Game>{
  return await post<Game>("/games", payload);
}

export async function deleteGame(id:string|number): Promise<{ ok: boolean }>{ 
  return await _del<{ok:boolean}>(`/games/${id}`);
}

export async function searchProviders(q:string): Promise<any[]>{
  const data = await apiGet<any>("/providers/search", { q });
  if(Array.isArray(data)) return data;
  return data?.items || [];
}
