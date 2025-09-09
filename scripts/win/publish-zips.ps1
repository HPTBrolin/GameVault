param(
  [Parameter(Mandatory=$true)] [string]$Owner,   # ex: hptbrolin
  [Parameter(Mandatory=$true)] [string]$Repo,    # ex: gamevault
  [string]$Tag,                                  # se omitir, gera vYYYYMMDD-HHmmss
  [switch]$AlsoLatest                            # recria/atualiza uma release 'latest'
)

$ErrorActionPreference = 'Stop'
$repoId = "$Owner/$Repo"
$artDir = Join-Path $PSScriptRoot '..' '..' 'artifacts'
$srcZip = Join-Path $artDir 'gamevault-src.zip'
$webZip = Join-Path $artDir 'gamevault-web.zip'
$apiZip = Join-Path $artDir 'gamevault-api.zip'

if (-not (Test-Path $srcZip) -or -not (Test-Path $webZip) -or -not (Test-Path $apiZip)) {
  throw "Falta pelo menos um ZIP em $artDir. Gera-os primeiro."
}

if (-not $Tag) { $Tag = 'v' + (Get-Date -Format 'yyyyMMdd-HHmmss') }

Write-Host "[info] Repositório alvo: $repoId"
Write-Host "[info] Tag/Release:    $Tag"

# Garante que o gh está autenticado
try { gh auth status -h github.com | Out-Null } catch {
  throw "gh CLI não está autenticado. Corre 'gh auth login -h github.com -s repo' ou define GH_TOKEN."
}

# Cria a release (cria a tag em HEAD). Se já existir, falha => editamos em vez disso.
$created = $true
try {
  gh release create $Tag -R $repoId `
    --title "GameVault $Tag" `
    --notes "Build automatizado $Tag" `
    $srcZip $webZip $apiZip | Out-Null
  Write-Host "[ok] Release criada: https://github.com/$repoId/releases/tag/$Tag"
} catch {
  $created = $false
}

if (-not $created) {
  # Se já havia release com esta tag, apenas atualiza (clobber)
  Write-Host "[info] Release '$Tag' já existia. A atualizar assets (clobber)…"
  gh release upload $Tag -R $repoId --clobber $srcZip $webZip $apiZip | Out-Null
  Write-Host "[ok] Assets atualizados para '$Tag'."
}

if ($AlsoLatest) {
  # Mantém um "apontador" latest: recria sempre (simples e previsível)
  Write-Host "[info] (latest) a recriar release 'latest'…"
  gh release delete latest -R $repoId -y 2>$null | Out-Null
  gh release create latest -R $repoId `
    --title "Latest" `
    --notes "Aponta para $Tag" `
    $srcZip $webZip $apiZip | Out-Null
  Write-Host "[ok] (latest) Release 'latest' atualizada."
}

# Depois de criares a release/tag com 'gh release create ...'
# $Owner, $Repo e $tag já definidos no script

$payload = @{
  tag     = $tag
  release = $tag
  url     = "https://github.com/$Owner/$Repo/releases/tag/$tag"
} | ConvertTo-Json -Compress

Write-Host "[info] A disparar repository_dispatch (zips_published)..." -ForegroundColor Cyan
gh api repos/$Owner/$Repo/dispatches `
  -f event_type='zips_published' `
  -f client_payload="$payload" | Out-Null
Write-Host "[info] repository_dispatch enviado." -ForegroundColor Green



