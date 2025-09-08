from __future__ import annotations

import datetime as _dt
from typing import Any, Dict, List, Optional

import httpx
from fastapi import HTTPException

from ...config import get_settings

_RAWG_BASE = "https://api.rawg.io/api"


def _norm_platforms(item: Dict[str, Any]) -> List[str]:
    plats = item.get("platforms") or []
    out: List[str] = []
    for p in plats:
        if not isinstance(p, dict):
            continue
        plat = p.get("platform") or {}
        name = plat.get("name")
        if isinstance(name, str) and name.strip():
            out.append(name.strip())
    # Fallback RAWG older field
    if not out and isinstance(item.get("platform"), dict):
        name = item["platform"].get("name")
        if isinstance(name, str):
            out.append(name)
    return out


def _norm_game(item: Dict[str, Any]) -> Dict[str, Any]:
    slug = item.get("slug") or ""
    name = item.get("name") or ""
    released = item.get("released") or item.get("released_at") or None
    cover = item.get("background_image") or item.get("background_image_additional")
    platforms = _norm_platforms(item)

    return {
        "provider": "rawg",
        "provider_id": item.get("id"),
        "slug": slug,
        "title": name,
        "release_date": released,
        "cover_url": cover,
        "platforms": platforms,
        "platform": ", ".join(platforms) if platforms else None,
    }


async def _client() -> httpx.AsyncClient:
    timeout = httpx.Timeout(connect=10, read=20, write=20, pool=None)
    return httpx.AsyncClient(timeout=timeout)


async def search(query: str, page_size: int = 18) -> List[Dict[str, Any]]:
    """Search games by text in RAWG."""
    if not query or not query.strip():
        return []

    s = get_settings()
    params = {"search": query, "page_size": page_size}
    if s.RAWG_API_KEY:
        params["key"] = s.RAWG_API_KEY

    async with await _client() as c:
        try:
            r = await c.get(f"{_RAWG_BASE}/games", params=params)
            if r.status_code == 401:
                # Key missing/invalid: degrade gracefully instead of 500
                return []
            r.raise_for_status()
            data = r.json()
        except httpx.HTTPError as e:
            # Bubble up as a 503 so the UI pode lidar
            raise HTTPException(status_code=503, detail=f"RAWG search error: {e}") from e

    results = []
    for item in data.get("results", []) or []:
        if not isinstance(item, dict):
            continue
        results.append(_norm_game(item))
    return results


async def upcoming(days: int = 60, limit: int = 20) -> List[Dict[str, Any]]:
    """Upcoming releases within next N days."""
    today = _dt.date.today()
    end = today + _dt.timedelta(days=max(1, days))
    s = get_settings()
    params = {
        "dates": f"{today.isoformat()},{end.isoformat()}",
        "ordering": "released",
        "page_size": max(1, min(40, limit)),
    }
    if s.RAWG_API_KEY:
        params["key"] = s.RAWG_API_KEY

    async with await _client() as c:
        try:
            r = await c.get(f"{_RAWG_BASE}/games", params=params)
            if r.status_code == 401:
                return []
            r.raise_for_status()
            data = r.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=503, detail=f"RAWG upcoming error: {e}") from e

    results = []
    for item in data.get("results", []) or []:
        if not isinstance(item, dict):
            continue
        results.append(_norm_game(item))
    return results
