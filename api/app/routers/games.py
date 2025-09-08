from __future__ import annotations
from typing import Optional, Literal, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, or_, func
from ..db import get_session
from ..models import Game

router = APIRouter(prefix="/games", tags=["games"])

SortField = Literal["added_at","title","platform","release_date"]
Order = Literal["asc","desc"]

def _apply_filters(stmt, q: Optional[str], platform: Optional[str], status: Optional[str]):
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(or_(func.lower(Game.title).like(like),
                              func.lower(Game.slug).like(like),
                              func.lower(Game.platform).like(like)))
    if platform:
        stmt = stmt.where(Game.platform == platform)
    if status:
        stmt = stmt.where(Game.status == status)
    return stmt

@router.get("/paged")
def list_games_paged(
    offset: int = 0,
    limit: int = 30,
    q: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    sort: SortField = "added_at",
    order: Order = "desc",
    sess: Session = Depends(get_session),
) -> Dict[str, Any]:
    stmt = select(Game)
    stmt = _apply_filters(stmt, q, platform, status)
    total = sess.exec(_apply_filters(select(func.count()), q, platform, status).select_from(Game)).one()
    # sort
    col = getattr(Game, sort)
    col = col.desc() if order == "desc" else col.asc()
    items = sess.exec(stmt.order_by(col).offset(offset).limit(limit)).all()
    return {
        "total": total or 0,
        "items": items,
        "offset": offset,
        "limit": limit,
    }

@router.get("/{game_id}")
def get_game(game_id: int, sess: Session = Depends(get_session)) -> Game:
    g = sess.get(Game, game_id)
    if not g:
        raise HTTPException(status_code=404, detail="Game not found")
    return g

@router.post("")
def create_game(payload: Dict[str, Any], sess: Session = Depends(get_session)) -> Game:
    # normalize minimal fields
    title = payload.get("title")
    slug = payload.get("slug") or (title or "").lower().replace(" ", "-")
    g = Game(
        title=title or "Untitled",
        slug=slug,
        platform=payload.get("platform"),
        cover_url=payload.get("cover_url"),
        release_date=payload.get("release_date"),
        status=payload.get("status") or "owned",
    )
    sess.add(g)
    sess.commit()
    sess.refresh(g)
    return g

@router.delete("/{game_id}")
def delete_game(game_id: int, sess: Session = Depends(get_session)) -> Dict[str, Any]:
    g = sess.get(Game, game_id)
    if not g:
        raise HTTPException(status_code=404, detail="Game not found")
    sess.delete(g)
    sess.commit()
    return {"ok": True}
