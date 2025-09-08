import os
from sqlmodel import Session, select
from .db import engine
from .models import AppSetting
from .config import get_settings

def load_settings_into_env():
    with Session(engine) as s:
        for k,v in s.exec(select(AppSetting.key, AppSetting.value)).all():
            if v is not None:
                os.environ[k]=v
    get_settings.cache_clear()

def upsert_settings(items:dict[str,str|None]):
    with Session(engine) as s:
        for k,v in items.items():
            row=s.get(AppSetting,k) or AppSetting(key=k)
            row.value=v; s.add(row)
        s.commit()
    load_settings_into_env()
