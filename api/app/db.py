from sqlmodel import create_engine, SQLModel, Session
import os
engine=create_engine('sqlite:///./games.db', connect_args={'check_same_thread': False})

def init_db():
    # When using Alembic, skip SQLModel.create_all (migrations control the schema)
    if os.getenv("USE_ALEMBIC","0") == "1":
        return
    from . import models
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as s:
        yield s
