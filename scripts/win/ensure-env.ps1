# Usage: .\ensure-env.ps1 -ApiDir ..\api
param([string]$ApiDir = (Join-Path (Resolve-Path ".") "api"))

$envFile = Join-Path $ApiDir ".env"
if(-not (Test-Path $envFile)) { New-Item -ItemType File -Path $envFile | Out-Null }

$lines = Get-Content -Raw $envFile
function Set-KV($key,$value){
  if($lines -match ("^" + [regex]::Escape($key) + "=.*$")){
    $lines = [regex]::Replace($lines,"^" + [regex]::Escape($key) + "=.*$",("$key=$value"), 'Multiline')
  } else {
    if($lines.Length -gt 0 -and -not $lines.EndsWith("`n")){ $lines += "`n" }
    $lines += "$key=$value`n"
  }
}

if(-not $env:RAWG_API_KEY -and -not ($lines -match "^RAWG_API_KEY=")){
  Write-Host "RAWG_API_KEY missing. Set it now:  Set-Item -Path Env:RAWG_API_KEY -Value YOUR_KEY" -ForegroundColor Yellow
} else {
  $val = if($env:RAWG_API_KEY){ $env:RAWG_API_KEY } else { ($lines -split "`n" | Where-Object { $_ -like "RAWG_API_KEY=*"} | ForEach-Object { $_.Substring(13) })[0] }
  Set-KV "RAWG_API_KEY" $val
  Write-Host "Ensured RAWG_API_KEY in .env" -ForegroundColor Green
}

Set-Content -Path $envFile -Value $lines -NoNewline
Write-Host "Wrote $envFile" -ForegroundColor Green