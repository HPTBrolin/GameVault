from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from ..db import get_session
from ..models import Game

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/counts")
def counts(sess: Session = Depends(get_session)):
    total = sess.exec(select(func.count()).select_from(Game)).one()
    have_cover = sess.exec(select(func.count()).select_from(Game).where(Game.cover_url != None)).one()
    return {"total": total, "have_cover": have_cover}
