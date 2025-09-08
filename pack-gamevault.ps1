<# pack-gamevault.ps1
 Empacota GameVault (api + web) para zip leve e seguro (sem node_modules/.venv/etc).
 Cria .env.shared com segredos redigidos. Opcional: git bundle.
#>

param(
  [string]$RepoRoot = "C:\Proj\GameVault",
  [string]$OutDir   = "$env:USERPROFILE\Desktop",
  [switch]$IncludeGitBundle
)

$ErrorActionPreference = "Stop"

$SevenZip = "C:\Program Files\7-Zip\7z.exe"
if (!(Test-Path $SevenZip)) {
  Write-Warning "7-Zip não encontrado em '$SevenZip'. Vou usar Compress-Archive do PowerShell."
}

$stamp    = (Get-Date).ToString('yyyyMMdd-HHmmss')
$baseName = "GameVault-$stamp"
$tmpRoot  = Join-Path $env:TEMP "gamevault-pack-$stamp"
$stage    = Join-Path $tmpRoot $baseName

$excludeDirs = @(
  ".git","node_modules",".venv","dist","build",".next",".parcel-cache",".vite",
  ".turbo",".cache","coverage","__pycache__",".pytest_cache",".mypy_cache",
  ".idea",".vscode",".gradle",".history",".pnp",".vs",".DS_Store"
)

function Copy-Tree {
  param([string]$src,[string]$dst)
  New-Item -ItemType Directory -Force -Path $dst | Out-Null
  $xd = @()
  foreach($d in $excludeDirs){ $xd += @("/XD", (Join-Path $src $d)) }
  $xf = @("/XF",".DS_Store","Thumbs.db")
  # /E inclui subpastas, /SL segue links simbólicos
  robocopy $src $dst /E /SL @xd @xf | Out-Null
}

# limpeza e staging
if (Test-Path $tmpRoot) { Remove-Item -Recurse -Force $tmpRoot }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

# copiar api + web
Copy-Tree (Join-Path $RepoRoot "api") (Join-Path $stage "api")
Copy-Tree (Join-Path $RepoRoot "web") (Join-Path $stage "web")

# redigir segredos em .env*
$envFiles = Get-ChildItem -Path $stage -Recurse -Force -Filter ".env*"
foreach($f in $envFiles){
  try{
    $txt = Get-Content $f.FullName -Raw
    $txt = $txt -replace '(?im)^(RAWG_API_KEY|DATABASE_URL|SECRET_KEY|JWT_SECRET|VITE_.*)=.*$', '$1=***REDACTED***'
    $out = "$($f.FullName).shared"
    $txt | Set-Content -Encoding UTF8 -NoNewline $out
  }catch{}
}

# compactar
$zipPath = Join-Path $OutDir "$baseName.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $SevenZip) {
  & "$SevenZip" a -tzip $zipPath "$stage\*" `
    "-xr!node_modules" "-xr!.git" "-xr!.venv" "-xr!dist" "-xr!build" "-xr!.next" `
    "-xr!.parcel-cache" "-xr!.vite" "-xr!coverage" "-xr!__pycache__" "-xr!.turbo" `
    "-xr!.mypy_cache" "-xr!.pytest_cache" "-xr!.idea" "-xr!.vscode" | Out-Null
} else {
  Compress-Archive -Path "$stage\*" -DestinationPath $zipPath -Force
}

# (opcional) git bundle
if ($IncludeGitBundle) {
  Push-Location $RepoRoot
  & git bundle create (Join-Path $OutDir "$baseName.git.bundle") --all
  Pop-Location
}

Write-Host ""
Write-Host "ZIP pronto:" -ForegroundColor Green
Write-Host "  $zipPath"
if ($IncludeGitBundle) {
  Write-Host "Git bundle:" -ForegroundColor Green
  Write-Host "  $(Join-Path $OutDir "$baseName.git.bundle")"
}
