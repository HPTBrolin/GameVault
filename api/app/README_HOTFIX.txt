HOTFIX API v6a
--------------
1) Corrige import relativo no providers/rawg.py:
   from ...config import get_settings
   (antes estava com '..config', o que procurava app/services/config)

2) Assegura pacotes Python com __init__.py em:
   - app/
   - app/services/
   - app/services/providers/

3) Garante no app/main.py:
   from .routers import calendar  # se usares o calendário
   app.include_router(calendar.router)

Reinicia: uvicorn app.main:app --reload
