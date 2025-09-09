#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifacts
zip -r artifacts/gamevault-web.zip web   -x "web/node_modules/*" "web/dist/*" "web/.vite/*" "web/coverage/*"      "web/.DS_Store" "web/*.log" "web/.idea/*" "web/.vscode/*"
zip -r artifacts/gamevault-api.zip api   -x "api/.venv/*" "api/__pycache__/*" "api/*.db" "api/*.sqlite"      "api/.mypy_cache/*" "api/.pytest_cache/*" "api/.idea/*" "api/.vscode/*"
zip -r artifacts/gamevault-src.zip web api   -x "web/node_modules/*" "web/dist/*" "web/.vite/*"      "api/.venv/*" "api/__pycache__/*" "api/*.db" "api/*.sqlite"      "*/.DS_Store" "*/.idea/*" "*/.vscode/*"
echo "Artifacts in ./artifacts"
