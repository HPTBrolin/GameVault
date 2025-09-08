from fastapi import APIRouter
import httpx
from datetime import date, timedelta
from ..services.config import get_settings

router = APIRouter(prefix="/releases", tags=["releases"])

@router.get("/upcoming")
async def releases_upcoming():
  s = get_settings()
  key = getattr(s, "RAWG_API_KEY", None)
  today = date.today()
  end = today + timedelta(days=60)
  if not key:
    return []
  url = "https://api.rawg.io/api/games"
  params = {
    "key": key,
    "dates": f"{today.isoformat()},{end.isoformat()}",
    "ordering": "released",
    "page_size": 50,
  }
  async with httpx.AsyncClient(timeout=20.0) as c:
    r = await c.get(url, params=params)
    r.raise_for_status()
    data = r.json()
    items = []
    for g in data.get("results", []):
      items.append({
        "name": g.get("name"),
        "release_date": g.get("released"),
        "platforms": [p.get("platform",{}).get("name") for p in g.get("parent_platforms",[]) if p.get("platform")],
        "image": g.get("background_image")
      })
    return items
