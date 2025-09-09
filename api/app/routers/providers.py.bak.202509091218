from fastapi import APIRouter, Query
from ..services.providers import rawg

router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("/search")
async def provider_search(q: str = Query(...), kind: str | None = None):
  results = []
  if kind in (None, "video", "game"):
    try:
      results.extend(await rawg.search(q))
    except Exception:
      # be defensive; never 500 on provider issues
      pass
  return results
