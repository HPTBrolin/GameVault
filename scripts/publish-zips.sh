#!/usr/bin/env bash
set -euo pipefail

# diretório raiz do repo
ROOT="$(pwd)"
ART="$ROOT/artifacts"
mkdir -p "$ART"

echo "Root: $ROOT"
echo "Artifacts: $ART"

# ficheiro com exclusões (se existir)
ZIPIGNORE="$ROOT/.zipignore"

# helpers
zip_src () {
  local OUT="$1"; shift
  if [[ -f "$ZIPIGNORE" ]]; then
    zip -r "$OUT" "$@" -x@"$ZIPIGNORE"
  else
    zip -r "$OUT" "$@"
  fi
}

echo "📦 a gerar gamevault-src.zip…"
zip_src "$ART/gamevault-src.zip" .

echo "📦 a gerar gamevault-web.zip…"
zip_src "$ART/gamevault-web.zip" web

echo "📦 a gerar gamevault-api.zip…"
zip_src "$ART/gamevault-api.zip" api

echo "✅ ZIPs gerados:"
ls -lh "$ART"
