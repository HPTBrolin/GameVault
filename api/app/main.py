from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import Optional, List
import datetime as dt
from apscheduler.schedulers.background import BackgroundScheduler
import httpx

DB_URL = "sqlite:///./games.db"
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})

class Settings(BaseSettings):
    RAWG_API_KEY: Optional[str] = None
    TRACK_INTERVAL_MINUTES: int = 60
    class Config:
        env_file = ".env"

settings = Settings()

class Game(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True)
    title: str
    platform: Optional[str] = None
    media_format: Optional[str] = "physical"  # physical/digital
    is_board_game: bool = False
    release_date: Optional[dt.date] = None
    added_at: dt.datetime = Field(default_factory=lambda: dt.datetime.utcnow())

class GameCreate(BaseModel):
    slug: str
    title: str
    platform: Optional[str] = None
    media_format: Optional[str] = "physical"
    is_board_game: bool = False
    release_date: Optional[dt.date] = None

app = FastAPI(title="GameVault API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_start():
    init_db()
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.add_job(track_upcoming_releases, "interval", minutes=settings.TRACK_INTERVAL_MINUTES)
    scheduler.start()

# -------- Providers --------

async def search_rawg(query: str):
    if not settings.RAWG_API_KEY:
        return []
    url = "https://api.rawg.io/api/games"
    params = {"search": query, "page_size": 10, "key": settings.RAWG_API_KEY}
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()
    out = []
    for g in data.get("results", []):
        out.append({
            "slug": g.get("slug"),
            "title": g.get("name"),
            "release_date": g.get("released"),
            "platforms": [p["platform"]["name"] for p in g.get("platforms", [])] if g.get("platforms") else [],
            "source": "rawg"
        })
    return out

async def search_bgg(query: str):
    url = "https://boardgamegeek.com/xmlapi2/search"
    params = {"query": query, "type": "boardgame"}
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        xml = r.text
    import re
    items = re.findall(r'<item type="boardgame" id="(\d+)">.*?<name type="primary" value="(.*?)"', xml, re.S)
    out = []
    for id_, name in items[:10]:
        out.append({
            "slug": f"bgg-{id_}",
            "title": name,
            "release_date": None,
            "platforms": [],
            "source": "bgg"
        })
    return out

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/games", response_model=List[Game])
def list_games():
    with Session(engine) as s:
        return s.exec(select(Game).order_by(Game.added_at.desc())).all()

@app.post("/games", response_model=Game)
def add_game(payload: GameCreate):
    with Session(engine) as s:
        g = Game(**payload.dict())
        s.add(g)
        s.commit()
        s.refresh(g)
        return g

@app.delete("/games/{game_id}")
def delete_game(game_id: int):
    with Session(engine) as s:
        g = s.get(Game, game_id)
        if not g:
            return {"deleted": False}
        s.delete(g)
        s.commit()
        return {"deleted": True}

@app.get("/providers/search")
async def provider_search(q: str = Query(..., min_length=2), kind: Optional[str] = None):
    results = []
    if kind in (None, "video"):
        results += await search_rawg(q)
    if kind in (None, "board"):
        results += await search_bgg(q)
    return {"query": q, "results": results}

@app.get("/releases/upcoming")
def upcoming(limit: int = 20):
    today = dt.date.today()
    with Session(engine) as s:
        stmt = (select(Game)
                .where(Game.release_date != None)
                .where(Game.release_date >= today)
                .order_by(Game.release_date)
                .limit(limit))
        return s.exec(stmt).all()

def track_upcoming_releases():
    print("[tracker] heartbeat at", dt.datetime.utcnow().isoformat())
