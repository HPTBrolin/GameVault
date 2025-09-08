from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from sqlmodel import SQLModel
import os, sys

# add app to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import models  # import models to load SQLModel.metadata

config = context.config
fileConfig(config.config_file_name)
target_metadata = SQLModel.metadata

def run_migrations_offline():
    context.configure(url=config.get_main_option("sqlalchemy.url"), target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(config.get_section(config.config_ini_section), prefix='sqlalchemy.', poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, render_as_batch=True)  # batch for SQLite
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
