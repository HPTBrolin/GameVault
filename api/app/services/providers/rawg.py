from typing import List, Dict, Any, Optional
import httpx
import os

RAWG_API = "https://api.rawg.io/api/games"
RAWG_KEY = os.getenv("RAWG_API_KEY") or ""

async def search(query: str) -> List[Dict[str, Any]]:
  params = {"search": query, "page_size": 10}
  if RAWG_KEY:
    params["key"] = RAWG_KEY
  async with httpx.AsyncClient(timeout=15) as client:
    r = await client.get(RAWG_API, params=params)
    r.raise_for_status()
    data = r.json()
  results = []
  for item in (data.get("results") or []):
    # Some entries come with platforms=None
    platforms = item.get("platforms") or []
    plats = [p.get("platform", {}).get("name", "") for p in platforms if isinstance(p, dict) and p.get("platform")]
    results.append({
      "provider": "rawg",
      "provider_id": item.get("id"),
      "title": item.get("name"),
      "released": item.get("released"),
      "platforms": plats,
      "cover_url": (item.get("background_image") or ""),
    })
  return results
