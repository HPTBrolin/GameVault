
from typing import Optional
from datetime import date
from pydantic import BaseModel

class GameCreate(BaseModel):
    title: str
    platform: Optional[str] = None
    cover_url: Optional[str] = None
    release_date: Optional[date] = None
    status: Optional[str] = None  # "owned", "wishlist", etc.
