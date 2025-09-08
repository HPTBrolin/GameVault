# Migrações (Alembic)

1) Instalar deps (já no requirements):
```
cd api
.venv\Scripts\activate
pip install alembic
```
2) Colocar o servidor com `USE_ALEMBIC=1` (para não chamar `create_all`):
- No Windows PowerShell:
```
$env:USE_ALEMBIC="1"
uvicorn app.main:app --reload
```
3) Aplicar migrações:
```
alembic upgrade head
```
Se a BD já existia, as migrações usam `render_as_batch` para SQLite e criam os índices/constraint.

> Para criar novas revisões:
```
alembic revision --autogenerate -m "tua mensagem"
alembic upgrade head
```
