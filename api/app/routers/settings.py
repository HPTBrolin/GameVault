from fastapi import APIRouter, HTTPException
from ..services.config import get_settings

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("")
def read_settings():
    s = get_settings()
    return {
        "env": s.ENV,
        "frontend_origins": s.FRONTEND_ORIGINS,
        "RAWG_API_KEY": "***" if s.RAWG_API_KEY else None,
        "BARCODE_ENABLED": s.BARCODE_ENABLED,
        "TRACK_INTERVAL_MINUTES": s.TRACK_INTERVAL_MINUTES,
    }

@router.put("")
def update_settings():
    raise HTTPException(status_code=501, detail="Edição de definições ainda não está disponível via API.")
