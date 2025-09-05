# GameVault

Aplicação web para registar jogos físicos (videojogos e jogos de tabuleiro), com:
- Multilingue (PT/EN) via `react-i18next`
- Integração com providers:
  - RAWG (videojogos) — requer `RAWG_API_KEY`
  - BoardGameGeek XML API (tabuleiro) — sem chave
- Tracking de lançamentos futuros (APScheduler)
- Docker Compose para levantar frontend e API

## Como correr (Docker)
1. Copia `api/.env.sample` para `api/.env` e define `RAWG_API_KEY` (opcional, mas necessário para pesquisar videojogos).
2. `docker compose up --build`
- Frontend: http://localhost:5173
- API docs (Swagger): http://localhost:8000/docs

## Local sem Docker
### API
```bash
cd api
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.sample .env
uvicorn app.main:app --reload
```

### Web
```bash
cd web
npm install
npm run dev
```

## Endpoints úteis
- `GET /providers/search?q=...` — consulta RAWG (se chave definida) + BGG
- `POST /games` — adiciona ao catálogo local
- `GET /releases/upcoming` — lista lançamentos futuros guardados

## Roadmap sugerido
- Campos extra (condição física, região, preço, local de compra)
- Import/export CSV
- Autenticação e partilha de coleções
- Jobs de refresh por ID do provider
