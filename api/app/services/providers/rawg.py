from __future__ import annotations
import os
from typing import Any, Dict, List
import httpx

from ...config import get_settings  # type: ignore

async def search(query: str) -> List[Dict[str, Any]]:
    if not query:
        return []
    s = get_settings() if callable(get_settings) else None  # tolerante
    api_key = getattr(s, "RAWG_API_KEY", None) or os.getenv("RAWG_API_KEY")
    params = { "search": query, "page_size": 10 }
    if api_key:
        params["key"] = api_key

    async with httpx.AsyncClient(timeout=10) as c:
        try:
            r = await c.get("https://api.rawg.io/api/games", params=params)
            r.raise_for_status()
            data = r.json() or {}
        except Exception:
            # Sem API key ou erro rede: comportamento tolerante
            return []

    results = []
    for item in data.get("results", []) or []:
        platforms = []
        for p in (item.get("platforms") or []):
            plat = (p or {}).get("platform") or {}
            name = plat.get("name") or ""
            if name:
                platforms.append(name)
        results.append({
            "provider": "rawg",
            "id": item.get("id"),
            "slug": item.get("slug"),
            "title": item.get("name"),
            "platform": ", ".join(platforms) if platforms else None,
            "release_date": item.get("released"),
            "cover_url": (item.get("background_image") or None),
        })
    return results
