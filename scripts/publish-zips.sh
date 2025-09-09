#!/usr/bin/env bash
set -euo pipefail

OWNER="${1:-}"
REPO="${2:-}"
TAG="${3:-latest}"
ROOT="${4:-.}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

ARTS="artifacts"
mkdir -p "$ARTS"

if [[ ! -f ".zipignore" ]]; then
  cat > .zipignore <<'EOF'
.git/
artifacts/
*.log
*.tmp
*.swp
.DS_Store
Thumbs.db
web/node_modules/
web/dist/
web/.vite/
web/.cache/
web/.eslintcache
api/.venv/
api/__pycache__/
api/.mypy_cache/
api/.pytest_cache/
api/games.db
api/*.sqlite
api/*.db
EOF
fi

tmp="$(mktemp -d)"
cleanup(){ rm -rf "$tmp"; }
trap cleanup EXIT

# SRC ZIP
rsync -a --exclude-from=".zipignore" ./ "$tmp/src/"
( cd "$tmp/src" && zip -qr "../../$ARTS/gamevault-src.zip" . )

# WEB ZIP
mkdir -p "$tmp/webroot"
rsync -a --exclude-from=".zipignore" --include='web/***' --exclude='*' ./ "$tmp/webroot/"
( cd "$tmp/webroot" && zip -qr "../../$ARTS/gamevault-web.zip" . )

# API ZIP
mkdir -p "$tmp/apiroot"
rsync -a --exclude-from=".zipignore" --include='api/***' --exclude='*' ./ "$tmp/apiroot/"
( cd "$tmp/apiroot" && zip -qr "../../$ARTS/gamevault-api.zip" . )

echo "[info] Artefactos em: $ARTS"

if [[ "${NOPUBLISH:-}" == "1" || -z "${OWNER}" || -z "${REPO}" ]]; then
  echo "[info] NOPUBLISH ativo ou sem OWNER/REPO. A terminar sem publicar."
  exit 0
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "[warn] 'gh' (GitHub CLI) não encontrado. Pula publicação."
  exit 0
fi

if gh release view "$TAG" --repo "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "[info] Release '$TAG' existe. Atualizando assets (--clobber)."
  gh release upload "$TAG" "$ARTS"/gamevault-*.zip --repo "$OWNER/$REPO" --clobber
else
  echo "[info] Criando release '$TAG'."
  gh release create "$TAG" "$ARTS"/gamevault-*.zip --repo "$OWNER/$REPO" --title "$TAG" --notes "Automated ZIPs" --latest
fi
echo "[info] Done."
