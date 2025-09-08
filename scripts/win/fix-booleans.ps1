param(
  [Parameter(Mandatory=$false)][string]$Root = "."
)

$ErrorActionPreference = "Stop"

Write-Host "Normalizar booleanos e operadores em TS/TSX (true/false, &&, ||)..." -ForegroundColor Cyan

$paths = Get-ChildItem -Path $Root -Recurse -Include *.ts,*.tsx | Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\build\\|\\.vite\\|\\.next\\" }

foreach($file in $paths){
  $txt = Get-Content -Raw -Path $file.FullName

  # Só troca fora de strings simples (heurística básica)
  $txt = $txt -replace '\bTrue\b', 'true'
  $txt = $txt -replace '\bFalse\b', 'false'
  # Evita substituir 'or' em palavras (ex: "floor")
  $txt = $txt -replace '(\s)or(\s)', '$1||$2'
  $txt = $txt -replace '(\s)and(\s)', '$1&&$2'

  Set-Content -Path $file.FullName -Value $txt -NoNewline
}

Write-Host "Concluído." -ForegroundColor Green
