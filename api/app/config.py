from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    RAWG_API_KEY: str | None = None
    BARCODE_API_URL: str | None = None
    BARCODE_API_KEY: str | None = None
    TRACK_INTERVAL_MINUTES: int = 60
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> "Settings":
    return Settings()
