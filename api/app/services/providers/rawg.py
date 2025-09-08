# api/app/services/providers/rawg.py
import os
import httpx
from ..config import get_settings

async def search(query: str):
    s = get_settings()
    key = s.RAWG_API_KEY or os.environ.get("RAWG_API_KEY") or None
    params = {"search": query, "page_size": 10}
    if key:
        params["key"] = key

    async with httpx.AsyncClient(timeout=20.0) as c:
        r = await c.get("https://api.rawg.io/api/games", params=params)
        # If the API key is missing or invalid, do not crash the app — just return empty results
        if r.status_code == 401:
            return []
        r.raise_for_status()
        data = r.json()

    results = []
    for item in (data or {}).get("results", []) or []:
        platforms = [p.get("platform", {}).get("name", "") for p in (item.get("platforms") or []) if p and p.get("platform")]
        results.append({
            "title": item.get("name", ""),
            "platform": ", ".join([p for p in platforms if p]) if platforms else "",
            "release_date": item.get("released") or None,
            "cover_url": (item.get("background_image") or ""),
            "provider": "rawg",
            "external_id": item.get("id")
        })
    return results
