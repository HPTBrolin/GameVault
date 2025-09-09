from fastapi import APIRouter, Query
from ..services.providers import rawg

router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("/search")
async def provider_search(q: str = Query(...), kind: str | None = None):
    items = []
    try:
        if kind in (None, "video"):
            items.extend(await rawg.search(q))
    except Exception as e:
        return {"items": [], "error": str(e)}
    return {"items": items}
