<#
.SYNOPSIS
  Empacota o projeto (src, web, api) em ZIPs, cria/atualiza uma Release no GitHub e
  dispara um repository_dispatch para acionar o workflow post-release.

.PARAMETER Owner
  Dono da org/conta no GitHub (ex.: hptbrolin)

.PARAMETER Repo
  Nome do repositório (ex.: gamevault)

.PARAMETER Root
  Raiz do repositório local (default: .)

.PARAMETER Tag
  Tag da release (default: zips-YYYYMMDD-HHmmss). Ignorado se -UseExistingTag for usado.

.PARAMETER UseExistingTag
  Se passado, o script tenta fazer upload para uma release já existente com esta tag.

.PARAMETER Latest
  Marca a release criada como "latest" (flag --latest). Só válido quando a release é criada nova.

.EXAMPLE
  pwsh -ExecutionPolicy Bypass -File .\scripts\win\publish-zips.ps1 -Owner hptbrolin -Repo gamevault

.EXAMPLE
  pwsh -ExecutionPolicy Bypass -File .\scripts\win\publish-zips.ps1 -Owner hptbrolin -Repo gamevault -Tag v1.2.3 -Latest
#>

param(
  [Parameter(Mandatory=$true)][string]$Owner,
  [Parameter(Mandatory=$true)][string]$Repo,
  [string]$Root = ".",
  [string]$Tag,
  [switch]$UseExistingTag,
  [switch]$Latest
)

$ErrorActionPreference = "Stop"

function Assert-Tool {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Ferramenta obrigatória não encontrada: $Name"
  }
}

function Has-7z {
  return [bool](Get-Command 7z -ErrorAction SilentlyContinue)
}

# 1) Pré-checks
Assert-Tool "gh"
if (-not (gh auth status 2>$null)) {
  throw "O GitHub CLI não está autenticado. Corre 'gh auth login' e tenta de novo."
}

$Root = (Resolve-Path $Root).Path
$Artifacts = Join-Path $Root "artifacts"
if (-not (Test-Path $Artifacts)) { New-Item -ItemType Directory -Path $Artifacts | Out-Null }

# 2) Zips
$zipSrc = Join-Path $Artifacts "gamevault-src.zip"
$zipWeb = Join-Path $Artifacts "gamevault-web.zip"
$zipApi = Join-Path $Artifacts "gamevault-api.zip"

Write-Host "[info] A criar ZIPs em $Artifacts" -ForegroundColor Cyan

if (Has-7z) {
  Push-Location $Root
  # SRC: zip do repo (exclui .git, artifacts, dist, node_modules, .venv)
  if (Test-Path $zipSrc) { Remove-Item $zipSrc -Force }
  & 7z a -tzip $zipSrc ".\*" `
    -xr!".git" -xr!"artifacts" -xr!"**\node_modules" -xr!"**\dist" -xr!"**\.venv" -xr!"**\__pycache__" | Out-Null
  Pop-Location

  # WEB
  if (Test-Path $zipWeb) { Remove-Item $zipWeb -Force }
  Push-Location (Join-Path $Root "web")
  & 7z a -tzip $zipWeb ".\*" -xr!"node_modules" -xr!"dist" -xr!".vite" -xr!".next" | Out-Null
  Pop-Location

  # API
  if (Test-Path $zipApi) { Remove-Item $zipApi -Force }
  Push-Location (Join-Path $Root "api")
  & 7z a -tzip $zipApi ".\*" -xr!".venv" -xr!"__pycache__" | Out-Null
  Pop-Location
}
else {
  # Fallback: Compress-Archive (um pouco mais lento e menos flexível com exclusões)
  Write-Host "[warn] 7-Zip não encontrado. A usar Compress-Archive (fallback)." -ForegroundColor Yellow

  # SRC
  if (Test-Path $zipSrc) { Remove-Item $zipSrc -Force }
  $srcItems = Get-ChildItem -Path $Root -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\\.git\\|\\artifacts\\|\\node_modules\\|\\dist\\|\\\.venv\\|\\__pycache__\\' }
  $srcItems | ForEach-Object { $_.FullName } | Compress-Archive -DestinationPath $zipSrc -Force

  # WEB
  if (Test-Path $zipWeb) { Remove-Item $zipWeb -Force }
  $webRoot = Join-Path $Root "web"
  $webItems = Get-ChildItem -Path $webRoot -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\dist\\|\\\.vite\\|\\\.next\\' }
  $webItems | ForEach-Object { $_.FullName } | Compress-Archive -DestinationPath $zipWeb -Force

  # API
  if (Test-Path $zipApi) { Remove-Item $zipApi -Force }
  $apiRoot = Join-Path $Root "api"
  $apiItems = Get-ChildItem -Path $apiRoot -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\\.venv\\|\\__pycache__\\' }
  $apiItems | ForEach-Object { $_.FullName } | Compress-Archive -DestinationPath $zipApi -Force
}

Write-Host "[info] Criado $zipSrc" -ForegroundColor Green
Write-Host "[info] Criado $zipWeb" -ForegroundColor Green
Write-Host "[info] Criado $zipApi" -ForegroundColor Green

# 3) Release/tag
if (-not $UseExistingTag) {
  if (-not $Tag) {
    $Tag = ("zips-{0:yyyyMMdd-HHmmss}" -f (Get-Date))
  }
}

$repoSlug = "$Owner/$Repo"

# Verifica se release existe
$releaseExists = $false
try {
  gh release view $Tag --repo $repoSlug 1>$null 2>$null
  $releaseExists = $true
} catch {
  $releaseExists = $false
}

if ($releaseExists) {
  Write-Host "[info] Release '$Tag' já existe. Vou atualizar assets com --clobber." -ForegroundColor Cyan
  gh release upload $Tag $zipSrc $zipWeb $zipApi --clobber --repo $repoSlug | Out-Null
}
else {
  Write-Host "[info] A criar release '$Tag'..." -ForegroundColor Cyan
  $args = @("release","create",$Tag,$zipSrc,$zipWeb,$zipApi,"--generate-notes","--repo",$repoSlug,"-t",$Tag)
  if ($Latest) { $args += "--latest" }
  gh @args | Out-Null
  Write-Host "[info] Release '$Tag' criada." -ForegroundColor Green
}

$releaseUrl = "https://github.com/$repoSlug/releases/tag/$Tag"

# 4) Disparar repository_dispatch (para o workflow post-release)
Write-Host "[info] A disparar repository_dispatch (zips_published)..." -ForegroundColor Cyan
$payloadObj = @{ tag = $Tag; url = $releaseUrl }
$payloadJson = ($payloadObj | ConvertTo-Json -Compress)

# Nota: gh api aceita -f event_type=... e -f client_payload=<json>
gh api repos/$repoSlug/dispatches -f event_type='zips_published' -f "client_payload=$payloadJson" | Out-Null
Write-Host "[info] repository_dispatch enviado." -ForegroundColor Green

Write-Host ""
Write-Host "✅ Concluído." -ForegroundColor Green
Write-Host "   Release: $releaseUrl" -ForegroundColor Gray
