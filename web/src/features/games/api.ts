// web/src/features/games/api.ts
import { get, post, del as apiDel, api } from "../../lib/http";

export type GameFilters = {
  q?: string;
  platform?: string;
  status?: string;
  sort?: string; // "name" | "added" | "console"
};

export type Game = {
  id: number;
  title: string;
  platform?: string | null;
  cover_url?: string | null;
  added_at?: string;
  status?: string;
  slug?: string;
};

export type Paged<T> = { items: T[]; total: number; offset: number; limit: number };

// ---- Helpers --------------------------------------------------------------
function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  return q.toString();
}

// Some backends have /games/paged; others only /games.
// We try /games/paged first; if 404, fall back to /games and slice locally.
export async function listGamesPaged(
  offset = 0,
  limit = 30,
  filters: GameFilters = {}
): Promise<Paged<Game>> {
  const qs = buildQuery({ offset, limit, ...filters });
  // Try paged endpoint
  try {
    const page = await get<Paged<Game>>(`/games/paged?${qs}`);
    if (page && Array.isArray(page.items)) return page;
  } catch (e: any) {
    // If 404 or any structural issue, try fallback
  }
  // Fallback: /games returns an array
  const all = await get<Game[]>(`/games?${buildQuery(filters)}`);
  const items = all.slice(offset, offset + limit);
  return { items, total: all.length, offset, limit };
}

// Sometimes components asked for listGamesPagedByPage(page)
export const listGamesPagedByPage = async (
  page: number,
  pageSize = 30,
  filters: GameFilters = {}
) => {
  const offset = Math.max(0, page) * pageSize;
  return listGamesPaged(offset, pageSize, filters);
};

export async function getGame(id: number | string): Promise<Game> {
  return get<Game>(`/games/${id}`);
}

export async function createGame(payload: Partial<Game>) {
  return post<Game>("/games", payload);
}

export async function deleteGame(id: number | string) {
  return apiDel(`/games/${id}`);
}

export type ProviderItem = {
  title: string;
  platform?: string;
  release_date?: string;
  cover_url?: string;
  provider?: string;
  external_id?: string | number;
};

export async function searchProviders(q: string): Promise<ProviderItem[]> {
  if (!q || q.trim().length < 2) return [];
  return get<ProviderItem[]>(`/providers/search?${buildQuery({ q })}`);
}

// Keep legacy names for compatibility if some components import these:
export { searchProviders as providerSearch };
