export type Game = {
  id: number;
  item_type?: string;
  slug?: string;
  title: string;
  platform?: string | null;
  is_board_game?: boolean;
  release_date?: string | null;
  cover_url?: string | null;
  barcode?: string | null;
  region?: string | null;
  condition?: string | null;
  edition?: string | null;
  hw_model?: string | null;
  serial_number?: string | null;
  toy_series?: string | null;
  toy_id?: string | null;
  folders?: string[] | null;
  added_at?: string | number;
  status?: string;
};

export type CardGame = {
  id: number;
  title: string;
  subtitle?: string;
  platform?: string | null;
  cover_url?: string | null;
  status?: string;
};

export function toCard(g: Game): CardGame{
  return {
    id: g.id,
    title: g.title,
    subtitle: g.platform ?? undefined,
    platform: g.platform,
    cover_url: g.cover_url ?? undefined,
    status: g.status ?? undefined,
  };
}
