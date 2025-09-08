from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    ENV: str = Field(default="development")
    FRONTEND_ORIGINS: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"])
    RAWG_API_KEY: str | None = None
    BARCODE_ENABLED: bool = False
    TRACK_INTERVAL_MINUTES: int = 30

    class Config:
        env_file = (".env", ".env.local", ".env.development", ".env.development.local")
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
