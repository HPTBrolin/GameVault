\
Param(
  [string]$Root = "."
)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Push-Location $Root
try {
  New-Item -ItemType Directory -Force -Path artifacts | Out-Null
  # web
  & powershell -NoProfile -Command {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
  } | Out-Null
  $zip1 = Join-Path artifacts "gamevault-web.zip"
  if(Test-Path $zip1){ Remove-Item $zip1 -Force }
  & tar -a -c -f $zip1 web --exclude=web/node_modules --exclude=web/dist --exclude=web/.vite --exclude=web/coverage --exclude=web/.idea --exclude=web/.vscode

  # api
  $zip2 = Join-Path artifacts "gamevault-api.zip"
  if(Test-Path $zip2){ Remove-Item $zip2 -Force }
  & tar -a -c -f $zip2 api --exclude=api/.venv --exclude=api/__pycache__ --exclude=*.db --exclude=*.sqlite --exclude=api/.idea --exclude=api/.vscode

  # src
  $zip3 = Join-Path artifacts "gamevault-src.zip"
  if(Test-Path $zip3){ Remove-Item $zip3 -Force }
  & tar -a -c -f $zip3 web api --exclude=web/node_modules --exclude=web/dist --exclude=web/.vite --exclude=api/.venv --exclude=api/__pycache__ --exclude=*.db --exclude=*.sqlite --exclude=.idea --exclude=.vscode

  Write-Host "Artifacts written to $(Resolve-Path artifacts)"
} finally {
  Pop-Location
}
