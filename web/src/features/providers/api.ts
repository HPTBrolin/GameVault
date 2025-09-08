
import api from "../../lib/http";

export async function providerSearch(q: string){
  const { data } = await api.get(`/providers/search`, { params: { q } });
  return data as Array<{
    id:number; title:string; cover_url?:string|null; release_date?:string|null; platforms?:string[]
  }>;
}
