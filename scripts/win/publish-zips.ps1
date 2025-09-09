
param(
  [Parameter(Mandatory = $true)][string]$Owner,
  [Parameter(Mandatory = $true)][string]$Repo,
  [switch]$Latest,
  [string]$Tag,
  [string]$Root = ".",
  [string]$ZipIgnore = ".zipignore",
  [switch]$Clobber
)

$ErrorActionPreference = "Stop"

function Write-Info($m){ Write-Host "[info] $m" -ForegroundColor Cyan }
function Write-Warn($m){ Write-Host "[warn] $m" -ForegroundColor Yellow }
function Write-Err($m){ Write-Host "[err]  $m" -ForegroundColor Red }

# Resolve root
$Root = (Resolve-Path $Root).Path
Push-Location $Root

try {
  # Check gh
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI 'gh' não encontrado. Instala: https://cli.github.com/  (gh auth login)"
  }

  # Detect 7-Zip
  $SevenZip = "C:\Program Files\7-Zip\7z.exe"
  if (-not (Test-Path $SevenZip)) {
    $SevenZip = (Get-Command 7z.exe -ErrorAction SilentlyContinue | Select-Object -First 1)?.Source
  }
  $Use7z = $SevenZip -and (Test-Path $SevenZip)

  # Load ignore patterns
  $DefaultIgnore = @(
    ".git/", "artifacts/", "*.log", "*.tmp", "*.swp", ".DS_Store", "Thumbs.db",
    "node_modules/", "dist/", "build/", ".vite/", ".cache/", ".parcel-cache/",
    "__pycache__/", ".pytest_cache/", ".mypy_cache/", ".venv/", "env/",
    ".env*", ".coverage", "coverage/",
    "web/.vite/", "web/node_modules/",
    "api/.venv/", "api/__pycache__/", "api/.pytest_cache/", "api/.mypy_cache/",
    "api/games.db"
  )

  $IgnoreList = @()
  if (Test-Path (Join-Path $Root $ZipIgnore)) {
    $lines = Get-Content (Join-Path $Root $ZipIgnore)
    foreach ($l in $lines) {
      $t = $l.Trim()
      if ($t -and -not $t.StartsWith("#")) { $IgnoreList += $t }
    }
  }
  $IgnoreList = ($IgnoreList + $DefaultIgnore) | Select-Object -Unique

  # Artifacts dir
  $Artifacts = Join-Path $Root "artifacts"
  New-Item -ItemType Directory -Path $Artifacts -Force | Out-Null
  Write-Info "A criar ZIPs em $Artifacts"

  function SevenZipAdd($zip, $base, $ignore) {
    Push-Location $base
    $args = @("a","-tzip",$zip,"*","-mx=5","-r")
    foreach ($p in $ignore) { $args += ("-xr!" + $p) }
    & "$SevenZip" @args | Out-Null
    Pop-Location
  }

  function Convert-GlobToRegex([string]$glob){
    $g = $glob.Replace('\','/')
    $g = [regex]::Escape($g)
    $g = $g.Replace('\*','.*').Replace('\?','.')
    if ($g.EndsWith('\/')) { $g = $g + '.*' }
    return '^' + $g.TrimStart('^').TrimEnd('$') + '$'
  }

  function CompressArchiveAdd($zip, $base, $ignore) {
    $regexes = $ignore | ForEach-Object { Convert-GlobToRegex $_ }
    $files = Get-ChildItem -Path $base -Recurse -File
    $keep = New-Object System.Collections.Generic.List[string]
    foreach($f in $files){
      $rel = ($f.FullName.Substring($base.Length + 1)).Replace('\','/')
      $ignored = $false
      foreach($rx in $regexes){
        if ($rel -match $rx) { $ignored = $true; break }
      }
      if (-not $ignored) { $keep.Add($f.FullName) }
    }
    if (Test-Path $zip) { Remove-Item $zip -Force }
    if ($keep.Count -eq 0) {
      Write-Warn "Nada para arquivar em $base (após exclusões)."
      return
    }
    Compress-Archive -Path $keep -DestinationPath $zip -Force
  }

  function MakeZip($name, $base, $ignore) {
    $zip = Join-Path $Artifacts $name
    if ($Use7z) {
      SevenZipAdd $zip $base $ignore
    } else {
      Write-Warn "7-Zip não encontrado. A usar Compress-Archive (fallback)."
      CompressArchiveAdd $zip $base $ignore
    }
    Write-Info "Criado $zip"
  }

  # Create zips
  MakeZip "gamevault-src.zip" $Root $IgnoreList
  MakeZip "gamevault-web.zip" (Join-Path $Root "web") $IgnoreList
  MakeZip "gamevault-api.zip" (Join-Path $Root "api") $IgnoreList

  if (-not $Tag) { $Tag = "zips-" + (Get-Date).ToString("yyyyMMdd-HHmmss") }
  $ReleaseName = $Tag

  Write-Info "A criar/atualizar release '$Tag' em $Owner/$Repo..."

  # Check if release exists
  $exists = $false
  & gh release view $Tag -R "$Owner/$Repo" *> $null
  if ($LASTEXITCODE -eq 0) { $exists = $true }

  if (-not $exists) {
    & gh release create $Tag `
      (Join-Path $Artifacts "gamevault-src.zip") `
      (Join-Path $Artifacts "gamevault-web.zip") `
      (Join-Path $Artifacts "gamevault-api.zip") `
      -R "$Owner/$Repo" -t $ReleaseName -n "Automated zips ($Tag)" --latest:$Latest | Out-Null
    Write-Info "Release criada."
  } else {
    Write-Info "Release '$Tag' já existe. Vou atualizar assets com --clobber."
  }

  $cl = @()
  if ($Clobber) { $cl = @("--clobber") }

  & gh release upload $Tag (Join-Path $Artifacts "gamevault-src.zip") -R "$Owner/$Repo" @cl | Out-Null
  & gh release upload $Tag (Join-Path $Artifacts "gamevault-web.zip") -R "$Owner/$Repo" @cl | Out-Null
  & gh release upload $Tag (Join-Path $Artifacts "gamevault-api.zip") -R "$Owner/$Repo" @cl | Out-Null

  $relUrl = "https://github.com/$Owner/$Repo/releases/tag/$Tag"
  Write-Info "Assets enviados. $relUrl"

  # repository_dispatch with proper JSON body (client_payload as object)
  Write-Info "A disparar repository_dispatch (zips_published)..."
  $dispatchBody = @{
    event_type = "zips_published"
    client_payload = @{
      url = $relUrl
      tag = $Tag
    }
  } | ConvertTo-Json -Compress

  $null = $dispatchBody | gh api repos/$Owner/$Repo/dispatches -X POST -H "Accept: application/vnd.github+json" --input -
  Write-Info "repository_dispatch enviado."

  Write-Host "`n✅ Concluído.`n   Release: $relUrl" -ForegroundColor Green
}
finally {
  Pop-Location
}
