import { apiGet } from "../../lib/http";

export async function searchProviders(q: string) {
  // RAWG proxy expects ?q=term
  return apiGet("/providers/search", { q });
}
