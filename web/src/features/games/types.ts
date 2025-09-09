export type SortKey = "added_at" | "name" | "platform";
export type SortOrder = "asc" | "desc";

export interface Game {
  id: number | string;
  name: string;
  platform?: string;
  year?: number | string;
  cover?: string;
  owned?: boolean;
  added_at?: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
}

export function mapBackendGame(g: any): Game {
  const name = g?.name ?? g?.title ?? g?.game_title ?? "";
  const platform = g?.platform ?? g?.console ?? g?.system ?? g?.platform_name ?? undefined;
  const cover = g?.cover ?? g?.cover_url ?? g?.image ?? g?.thumb ?? undefined;
  const id = g?.id ?? g?.game_id ?? name;
  const year = g?.year ?? (g?.release_date ? String(g.release_date).slice(0,4) : undefined);
  const added_at = g?.added_at ?? g?.created_at ?? undefined;
  const owned = g?.owned ?? g?.status === "owned";
  return { id, name, platform, year, cover, owned, added_at };
}
