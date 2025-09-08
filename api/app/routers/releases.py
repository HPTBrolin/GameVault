from typing import List, Dict, Any
from fastapi import APIRouter, Query
from ..services.providers import rawg

router = APIRouter(prefix="/releases", tags=["releases"])


@router.get("/upcoming")
async def upcoming_releases(days: int = Query(60, ge=1, le=365), limit: int = Query(20, ge=1, le=40)) -> List[Dict[str, Any]]:
    """
    Próximos lançamentos, vindo do RAWG.
    """
    return await rawg.upcoming(days=days, limit=limit)
