import { apiGet } from "@/lib/http";

export interface ProviderGame {
  id: string | number;
  name: string;
  year?: number;
  cover?: string;
  platforms?: string[];
}

export async function searchProviders(q: string): Promise<ProviderGame[]> {
  const data: any = await apiGet("/providers/search", { params: { q }});
  const items: any[] = data?.items ?? data ?? [];
  return items.map((x) => ({
    id: x.id ?? x.rawg_id ?? x.slug ?? x.name,
    name: x.name ?? x.title ?? "",
    year: x.year ?? (x.released ? String(x.released).slice(0,4) : undefined),
    cover: x.cover ?? x.background_image ?? x.image,
    platforms: x.platforms?.map((p: any)=> p?.platform?.name ?? p?.name).filter(Boolean) ?? [],
  }));
}
