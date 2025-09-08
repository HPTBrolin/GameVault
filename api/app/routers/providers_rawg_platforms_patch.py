from fastapi import APIRouter, HTTPException
import httpx
from ..services.config import get_settings

router = APIRouter(prefix="/providers/rawg", tags=["providers-rawg"])

@router.get("/platforms")
async def rawg_platforms():
  s = get_settings()
  key = getattr(s, "RAWG_API_KEY", None)
  if not key:
    # Fallback static platforms
    return [
      {"id":"PC","name":"PC"},
      {"id":"PlayStation 5","name":"PlayStation 5"},
      {"id":"Xbox Series X/S","name":"Xbox Series X/S"},
      {"id":"Nintendo Switch","name":"Nintendo Switch"},
    ]
  url = "https://api.rawg.io/api/platforms"
  params = {"key": key, "page_size": 40}
  async with httpx.AsyncClient(timeout=20.0) as c:
    r = await c.get(url, params=params)
    r.raise_for_status()
    data = r.json()
    results = data.get("results", [])
    return [{"id":p.get("id"), "name":p.get("name")} for p in results]
