
from fastapi import APIRouter, Query
from typing import Any, Dict, List
from ..services.providers import rawg

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.get("/upcoming")
async def upcoming(days:int = Query(90, ge=7, le=365), page_size:int = Query(24, ge=1, le=40))->Dict[str,Any]:
    items = await rawg.upcoming(days=days, page_size=page_size)
    # Normaliza campos
    norm = [{
        "id": it.get("id") or it.get("slug") or it.get("name"),
        "title": it.get("name"),
        "release_date": it.get("released"),
        "platform": ", ".join([p.get("name") for p in it.get("platforms") or []]) or None,
        "cover_url": it.get("background_image"),
    } for it in items]
    return {"items": norm}
