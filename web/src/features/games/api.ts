import { apiGet, apiPost, apiDel } from "@/lib/http";

export interface Paged<T> { items: T[]; total: number; offset: number; limit: number; }

export function listGamesPagedByPage(page: number, limit: number, filters?: Record<string, any>) {
  const offset = page * limit;
  return apiGet<Paged<any>>("/games/paged", { ...filters, offset, limit });
}

export function getGame(id: number | string) {
  return apiGet<any>(/games/);
}

export function searchProviders(q: string) {
  return apiGet<{ items: any[]; error?: string }>("/providers/search", { q });
}

export function createGame(payload: any) {
  return apiPost<any>("/games", payload);
}

export function deleteGame(id: number | string) {
  return apiDel<any>(/games/);
}
