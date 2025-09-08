
Param(
  [string]$Root = "."
)
$ErrorActionPreference = "Stop"
$web = Join-Path $Root "web"
if(!(Test-Path $web)){ Write-Host "Pasta 'web' não encontrada em $Root" -ForegroundColor Red; exit 1 }
$files = Get-ChildItem -Path $web -Include *.ts,*.tsx -Recurse
foreach($f in $files){
  $txt = Get-Content -Path $f.FullName -Raw
  $new = $txt `
    -replace '\bFalse\b','false' `
    -replace '\bTrue\b','true' `
    -replace '([^A-Za-z_])or([^A-Za-z_])','$1||$2' `
    -replace '([^A-Za-z_])and([^A-Za-z_])','$1&&$2'
  if($new -ne $txt){
    Set-Content -Path $f.FullName -Value $new -NoNewline
    Write-Host "Patched $($f.FullName)" -ForegroundColor Green
  }
}
Write-Host "Fix concluído." -ForegroundColor Cyan
