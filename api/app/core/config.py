
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List, Optional


class Settings(BaseSettings):
    RAWG_API_KEY: Optional[str] = None
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    TRACK_INTERVAL_MINUTES: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
