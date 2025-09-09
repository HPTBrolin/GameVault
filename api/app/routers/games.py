from typing import Optional, List, Any, Dict
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, func
from sqlalchemy import asc, desc
# assume Game & get_session are already declared in your project
try:
    from ..models import Game  # adjust if your model path differs
except Exception:
    from ..db import Game  # fallback path if your project uses db.py

try:
    from ..db import get_session  # typical helper to create a Session
except Exception:
    # fallback for projects that use a different session import
    from ..database import get_session  # type: ignore

router = APIRouter()

@router.get("/games/paged")
def list_games_paged(
    offset: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=200),
    sort: str = Query("added"),
    order: str = Query("desc"),
    q: Optional[str] = None,
    sess: Session = Depends(get_session),
) -> Dict[str, Any]:
    sort_map = {
        "added": "added_at",
        "name": "title",
        "platform": "platform",
    }
    col_name = sort_map.get(sort, "added_at")
    try:
        col = getattr(Game, col_name)
    except AttributeError:
        col = getattr(Game, "added_at")

    order_fn = desc if order.lower() == "desc" else asc

    stmt = select(Game)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(Game.title.ilike(like))
    stmt = stmt.order_by(order_fn(col)).offset(offset).limit(limit)

    items: List[Game] = list(sess.exec(stmt).all())

    total_stmt = select(func.count()).select_from(Game)
    if q:
        total_stmt = total_stmt.where(Game.title.ilike(f"%{q}%"))
    total = sess.exec(total_stmt).one()
    if isinstance(total, tuple):
        total = total[0]

    return {"items": items, "total": int(total)}
