from httpx import AsyncClient
from ...config import get_settings

async def search(query: str):
  s = get_settings()
  params = {"search": query, "page_size": 10}
  if s.RAWG_API_KEY:
    params["key"] = s.RAWG_API_KEY
  async with AsyncClient(timeout=10) as c:
    r = await c.get("https://api.rawg.io/api/games", params=params)
    # If no/invalid key, don't crash the app – just return nothing
    if r.status_code == 401:
      return []
    r.raise_for_status()
    data = r.json()
  items = []
  for item in data.get("results", []):
    platforms = item.get("platforms") or []
    names = []
    for p in platforms:
      try:
        nm = (p or {}).get("platform", {}).get("name", "")
        if nm: names.append(nm)
      except Exception:
        continue
    items.append({
      "provider": "rawg",
      "id": item.get("id"),
      "slug": item.get("slug"),
      "title": item.get("name"),
      "platform": ", ".join(names),
      "release_date": item.get("released"),
      "cover_url": item.get("background_image") or "",
    })
  return items
