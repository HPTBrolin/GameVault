from sqlalchemy import text
from sqlmodel import Session
from .db import engine

def colset(conn, table: str) -> set[str]:
    rows = conn.exec_driver_sql(f'PRAGMA table_info("{table}")').all()
    return {r[1] for r in rows}

def add(conn, table: str, col: str, type_sql: str, default_sql: str | None = None):
    if col in colset(conn, table):
        return
    sql = f'ALTER TABLE "{table}" ADD COLUMN "{col}" {type_sql}'
    if default_sql is not None:
        sql += f' DEFAULT {default_sql}'
    conn.exec_driver_sql(sql)

def run():
    with engine.begin() as conn:
        t = "game"
        add(conn, t, "item_type",    "TEXT",      "'game'")
        add(conn, t, "status",       "TEXT",      "'owned'")
        add(conn, t, "platform",     "TEXT")
        add(conn, t, "is_board_game","INTEGER",   "0")
        add(conn, t, "release_date", "DATE")
        add(conn, t, "cover_url",    "TEXT")
        add(conn, t, "barcode",      "TEXT")
        add(conn, t, "region",       "TEXT")
        add(conn, t, "condition",    "TEXT")
        add(conn, t, "edition",      "TEXT")
        add(conn, t, "hw_model",     "TEXT")
        add(conn, t, "serial_number","TEXT")
        add(conn, t, "toy_series",   "TEXT")
        add(conn, t, "toy_id",       "TEXT")
        add(conn, t, "folders_json", "TEXT",      "'[]'")
        add(conn, t, "added_at",     "TIMESTAMP")

        # tabela das definições (caso falte)
        t2 = "appsetting"
        add(conn, t2, "is_secret", "INTEGER", "0")

    print("Migração concluída.")

if __name__ == "__main__":
    run()
