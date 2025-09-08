from __future__ import annotations
from typing import Optional
import datetime as dt
from enum import Enum
from sqlmodel import SQLModel, Field


class ItemType(str, Enum):
    game = "game"
    toy = "toy"


class Status(str, Enum):
    owned = "owned"
    wishlist = "wishlist"
    playing = "playing"
    finished = "finished"


class Game(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_type: ItemType = Field(default=ItemType.game, index=True)
    title: str
    slug: str = Field(index=True)
    platform: Optional[str] = Field(default=None, index=True)
    status: Status = Field(default=Status.owned, index=True)
    cover_url: Optional[str] = None
    release_date: Optional[dt.date] = None
    added_at: dt.datetime = Field(default_factory=lambda: dt.datetime.utcnow())

    # optional / legacy fields we don't necessarily use but keep for compatibility
    edition: Optional[str] = None
    region: Optional[str] = None
    is_board_game: bool = False
    hw_model: Optional[str] = None
    serial_number: Optional[str] = None
    barcode: Optional[str] = None
    toy_series: Optional[str] = None
    toy_id: Optional[str] = None
    condition: Optional[str] = None
    folders_json: Optional[str] = None


class AppSetting(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: Optional[str] = None
    is_secret: bool = False
