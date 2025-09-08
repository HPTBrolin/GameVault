# Patch: Índice `added_at` + Spinner + Teste de paginação

## API
- Nova migração Alembic: `0003_add_index_added_at.py` cria índice `ix_game_added_at`.
- Aplicar:
  ```powershell
  cd api
  .\.venv\Scripts\activate
  $env:USE_ALEMBIC="1"
  python -m alembic upgrade head
  ```

## Web
- Infinite scroll com `loadingMore` guard + spinner minimal (`.gv-spinner`).

## Teste
- `api/tests/test_pagination.py` (pytest).
  ```powershell
  cd api
  pytest -q
  ```
