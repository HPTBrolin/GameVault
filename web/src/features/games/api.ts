import { apiGet, apiPost, apiDelete } from "../../lib/http";

export type GameCard = {
  id: number;
  title: string;
  platform?: string;
  release_date?: string;
  cover_url?: string;
};

export type Paged<T> = {
  items: T[];
  total: number;
};

export type GameFilters = {
  q?: string;
  platform?: string;
  status?: string;
  tag?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export async function listGamesPaged(offset = 0, limit = 30, filters: GameFilters = {}): Promise<Paged<GameCard>> {
  const data = await apiGet<Paged<GameCard>>("/games/paged", { offset, limit, ...filters });
  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
  };
}

export async function searchProviders(q: string, provider?: string) {
  // Backend espera ?q=..., não ?params[q]=
  const data = await apiGet<any>("/providers/search", { q, provider });
  // Alguns backends podem devolver diretamente array, outros { items: [...] }
  return (data?.items ?? data) || [];
}

export async function createGame(payload: any) {
  return await apiPost("/games", payload);
}

export async function deleteGame(id: number) {
  return await apiDelete(`/games/${id}`);
}
