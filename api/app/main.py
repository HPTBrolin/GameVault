import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GameVault API")

# --- CORS (dev-friendly, restrict in production) ---
allow_all = os.getenv("CORS_ALLOW_ALL", "1") in ("1", "true", "True")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://192.168.1.73:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers imports must be BELOW app creation to ensure CORS is installed
from .routers import games  # type: ignore
app.include_router(games.router)
