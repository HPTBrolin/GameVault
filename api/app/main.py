from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers opcionais - nem todos precisam existir no teu projeto
from .routers import providers, releases
try:
    from .routers import games  # type: ignore
except Exception:  # pragma: no cover
    games = None
try:
    from .routers import stats  # type: ignore
except Exception:  # pragma: no cover
    stats = None
try:
    from .routers import settings as settings_router  # type: ignore
except Exception:  # pragma: no cover
    settings_router = None

# Config
try:
    from .config import get_settings
except Exception:
    def get_settings():
        class _S:  # defaults
            CORS_ORIGINS = ["*"]
        return _S()

app = FastAPI(title="GameVault API")

# CORS
s = get_settings()
origins = getattr(s, "CORS_ORIGINS", ["*"]) or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup opcional
try:
    from .db import create_db_and_tables  # type: ignore

    @app.on_event("startup")
    def on_startup():
        try:
            create_db_and_tables()
        except Exception:
            # não bloquear o arranque por causa disto
            pass
except Exception:
    pass

# Mount routers
if games:
    app.include_router(games.router)  # type: ignore[attr-defined]
app.include_router(providers.router)
app.include_router(releases.router)
if stats:
    app.include_router(stats.router)  # type: ignore[attr-defined]
if settings_router:
    app.include_router(settings_router.router)  # type: ignore[attr-defined]
