param(
  [string]$Root = (Resolve-Path -Path ".").Path
)

$ErrorActionPreference = "Stop"

function Backup-Path([string]$PathToBackup){
  if(Test-Path $PathToBackup){
    $ts = (Get-Date).ToString("yyyyMMdd-HHmmss")
    $dest = "$PathToBackup.bak.$ts"
    Write-Host "Backup: $PathToBackup -> $dest" -ForegroundColor Yellow
    Copy-Item -Recurse -Force $PathToBackup $dest
  }
}

Write-Host "== GameVault rescue: restore selected files from GitHub ==" -ForegroundColor Cyan

$web = Join-Path $Root "web"
$api = Join-Path $Root "api"

if(-not (Test-Path $web)){ throw "web/ not found at $web" }
if(-not (Test-Path $api)){ throw "api/ not found at $api" }

Backup-Path (Join-Path $Root "web\src")
Backup-Path (Join-Path $Root "api\app")

$owner = "hptbrolin"
$repo = "gamevault"
$branch = "main"

$files = @(
  @{ rel="web/src/lib/http.ts"; dst="web\src\lib\http.ts" }
  @{ rel="web/src/features/games/api.ts"; dst="web\src\features\games\api.ts" }
  @{ rel="web/src/pages/Add.tsx"; dst="web\src\pages\Add.tsx" }
  @{ rel="web/src/pages/Library.tsx"; dst="web\src\pages\Library.tsx" }
  @{ rel="web/src/pages/GameDetail.tsx"; dst="web\src\pages\GameDetail.tsx" }
  @{ rel="web/src/ui/Layout.tsx"; dst="web\src\ui\Layout.tsx" }
  @{ rel="web/src/App.tsx"; dst="web\src\App.tsx" }
  @{ rel="web/src/main.tsx"; dst="web\src\main.tsx" }
  @{ rel="api/app/main.py"; dst="api\app\main.py" }
  @{ rel="api/app/routers/games.py"; dst="api\app\routers\games.py" }
  @{ rel="api/app/routers/providers.py"; dst="api\app\routers\providers.py" }
  @{ rel="api/app/routers/releases.py"; dst="api\app\routers\releases.py" }
  @{ rel="api/app/services/providers/rawg.py"; dst="api\app\services\providers\rawg.py" }
)

foreach($f in $files){
  $raw = "https://raw.githubusercontent.com/$owner/$repo/$branch/{0}" -f $f.rel
  $dst = Join-Path $Root $f.dst
  $dstDir = Split-Path $dst -Parent
  if(-not (Test-Path $dstDir)){ New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }
  Write-Host "GET $raw" -ForegroundColor Green
  Invoke-WebRequest -Uri $raw -UseBasicParsing -OutFile $dst
}

Write-Host "Applying small safety patches..." -ForegroundColor Cyan

# Patch RAWG platforms None handling (idempotent)
$rawg = Join-Path $Root "api\app\services\providers\rawg.py"
if(Test-Path $rawg){
  $txt = Get-Content -Raw $rawg
  if($txt -match "item\.get\(\"platforms\""){
    $txt = $txt -replace "item\.get\(\"platforms\", \[\]\)", "(item.get(\"platforms\") or [])"
    Set-Content -Path $rawg -Value $txt -NoNewline
    Write-Host " - Patched rawg.py platforms None handling" -ForegroundColor Green
  }
}

Write-Host "Done. Next steps:" -ForegroundColor Cyan
Write-Host "  1) In one terminal: cd api; set USE_ALEMBIC=1; uvicorn app.main:app --reload" -ForegroundColor Gray
Write-Host "  2) In another: cd web; npm i; npm run dev" -ForegroundColor Gray