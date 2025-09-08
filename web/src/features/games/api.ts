import { get, post, del } from "../../lib/http";

export type Game = {
  id: number;
  title: string;
  platform?: string;
  slug?: string;
  cover_url?: string;
  added_at?: string;
};

export type Paged<T> = { items: T[]; total: number; offset: number; limit: number };

export async function listGamesPagedByPage(page: number, limit: number, filters?: Record<string,string>) {
  const params = new URLSearchParams();
  params.set("offset", String(page * limit));
  params.set("limit", String(limit));
  if (filters?.q) params.set("q", filters.q);
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.status) params.set("status", filters.status);
  return await get<Paged<Game>>(`/games/paged?${params.toString()}`);
}

export async function getGame(idOrSlug: string) {
  return await get<Game>(`/games/${encodeURIComponent(idOrSlug)}`);
}

export async function createGame(payload: Partial<Game>) {
  return await post<Game>("/games", payload);
}

export async function deleteGame(id: number) {
  return await del<{}>(`/games/${id}`);
}

export async function searchProviders(q: string, kind?: string) {
  const qs = new URLSearchParams({ q });
  if (kind) qs.set("kind", kind);
  return await get<any[]>(`/providers/search?${qs.toString()}`);
}
