
import { apiGet, apiPost, apiDel } from "../../lib/http";

export type Game = {
  id: number;
  title: string;
  slug?: string;
  platform?: string;
  cover_url?: string;
  release_date?: string;
  status?: "owned"|"wishlist"|"playing"|string;
  added_at?: string;
};

export type Page<T> = { items: T[]; total: number };

export type GameFilters = {
  q?: string;
  platform?: string;
  status?: string;
  sort?: string; // name|added|console
  dir?: "asc"|"desc";
};

export async function listGames(offset = 0, limit = 30, filters?: GameFilters): Promise<Page<Game>>{
  // Prefer paged endpoint, but gracefully fall back to /games
  try{
    return await apiGet<Page<Game>>("/games/paged", { offset, limit, ...filters });
  }catch{
    const all = await apiGet<Game[]>("/games", filters);
    const items = all.slice(offset, offset+limit);
    return { items, total: all.length };
  }
}

export async function listGamesPagedByPage(page = 1, pageSize = 30, filters?: GameFilters){
  const offset = (page-1)*pageSize;
  return listGames(offset, pageSize, filters);
}

export async function getGame(id: number|string): Promise<Game>{
  return apiGet<Game>(`/games/${id}`);
}

export type CreateGamePayload = {
  title: string;
  platform?: string;
  cover_url?: string;
  release_date?: string | null;
  status?: string;
  slug?: string;
};

export async function createGame(payload: CreateGamePayload): Promise<Game>{
  return apiPost<Game>("/games", payload);
}

export async function deleteGame(id: number|string): Promise<{ok:true}>{
  return apiDel<{ok:true}>(`/games/${id}`);
}

export type ProviderResult = {
  id: string;
  title: string;
  year?: number;
  platforms?: string[];
  cover_url?: string;
  provider: string; // rawg, igdb, etc
};

export async function searchProviders(q: string): Promise<ProviderResult[]>{
  if(!q?.trim()) return [];
  try{
    return await apiGet<ProviderResult[]>("/providers/search", { q });
  }catch{
    return [];
  }
}
