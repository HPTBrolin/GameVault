from typing import List, Dict, Any
from fastapi import APIRouter, Query

from ..services.providers import rawg

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("/search")
async def provider_search(q: str = Query(..., min_length=1), kind: str | None = None) -> List[Dict[str, Any]]:
    """
    Pesquisa provedores externos por jogos.
    Atualmente usa apenas RAWG. `kind` reservado para futuro (video/board/etc).
    """
    results: list[dict[str, Any]] = []
    # Apenas 'video' por enquanto
    if kind in (None, "video"):
        results.extend(await rawg.search(q))
    return results
