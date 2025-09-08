import { apiGet, apiPost, apiDelete } from "../../lib/http";

export type Game = {
  id: number;
  title: string;
  platform?: string;
  cover_url?: string;
  release_date?: string | null;
  [k: string]: any;
};

export type Page<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};

// Unified paged loader with graceful 404 fallback to /games
export async function listGamesPaged(
  offset = 0,
  limit = 30,
  filters?: Record<string, any>
): Promise<Page<Game>> {
  try {
    const data: any = await apiGet("/games/paged", { offset, limit, ...(filters||{}) });
    if (data && Array.isArray(data.items)) {
      return { items: data.items, total: Number(data.total ?? data.items.length), offset, limit };
    }
    if (Array.isArray(data)) {
      return { items: data, total: data.length, offset: 0, limit: data.length };
    }
    return { items: [], total: 0, offset, limit };
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status;
    if (status === 404) {
      // Older API without /games/paged
      const arr: Game[] = (await apiGet("/games")) ?? [];
      return { items: arr, total: arr.length, offset: 0, limit: arr.length };
    }
    throw err;
  }
}

export async function getGame(id: number | string): Promise<Game> {
  return apiGet(`/games/${id}`);
}

export async function createGame(payload: Partial<Game>): Promise<Game> {
  return apiPost("/games", payload);
}

export async function deleteGame(id: number | string): Promise<void> {
  await apiDelete(`/games/${id}`);
}
