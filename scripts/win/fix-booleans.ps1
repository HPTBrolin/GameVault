# Corrige literais booleanos Python-Style para JavaScript na Library.tsx
param(
  [string]$File = "web/src/pages/Library.tsx"
)
if (-not (Test-Path $File)) {
  Write-Error "Não encontrei $File. Ajusta o caminho e volta a correr."
  exit 1
}
$txt = Get-Content $File -Raw
$txt = $txt -replace "\bFalse\b","false"
$txt = $txt -replace "\bTrue\b","true"
Set-Content $File $txt -Encoding UTF8
Write-Host "✔ Substituições aplicadas em $File"
