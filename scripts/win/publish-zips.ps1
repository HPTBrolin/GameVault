param(
  [string]$Owner = "",
  [string]$Repo = "",
  [string]$Tag = "latest",
  [string]$Root = ".",
  [switch]$NoPublish
)

$ErrorActionPreference = "Stop"

function Write-Info($msg){ Write-Host "[info] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[warn] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[err ] $msg" -ForegroundColor Red }

function Read-ZipIgnore($rootPath){
  $file = Join-Path $rootPath ".zipignore"
  $list = @()
  if(Test-Path $file){
    Get-Content $file | ForEach-Object {
      $line = $_.Trim()
      if($line -and -not $line.StartsWith("#")){
        $list += $line.Replace("\","/")
      }
    }
  }
  return $list
}

function Should-Exclude($relPath, $patterns){
  $p = $relPath.Replace("\","/").ToLower()
  foreach($pat in $patterns){
    $pat2 = $pat.Replace("\","/").ToLower()
    if($pat2.EndsWith("/")){
      if($p.StartsWith($pat2.TrimEnd("/"))){ return $true }
    } else {
      # wildcard-like
      $wild = $pat2
      if($wild.StartsWith("/")){ $wild = $wild.TrimStart("/") }
      if($p -like $wild){ return $true }
      # also match "contains"
      if($p.Contains($wild)){ return $true }
    }
  }
  return $false
}

function Collect-Files($base, $rootPath, $patterns, $prefixFilter){
  Push-Location $rootPath
  try{
    $files = Get-ChildItem -Recurse -File | ForEach-Object { $_.FullName }
    $result = @()
    foreach($f in $files){
      $rel = Resolve-Path -LiteralPath $f -Relative
      $rel = $rel -replace '^[.][/\\]', ''
      $rel = $rel.Replace("\","/")
      if($prefixFilter){
        if(-not $rel.StartsWith($prefixFilter)){ continue }
      }
      if(Should-Exclude $rel $patterns){ continue }
      # also skip artifacts and .git always
      if($rel.StartsWith(".git/")){ continue }
      if($rel.StartsWith("artifacts/")){ continue }
      $result += $rel
    }
    return $result
  } finally {
    Pop-Location
  }
}

function New-Zip($zipPath, $rootPath, $files){
  if(Test-Path $zipPath){ Remove-Item $zipPath -Force }
  Push-Location $rootPath
  try{
    if($files.Count -eq 0){
      Write-Warn "Nada para zipar para $zipPath"
      return
    }
    Compress-Archive -Path $files -DestinationPath $zipPath -Force -CompressionLevel Optimal | Out-Null
    Write-Info "Criado $zipPath"
  } finally {
    Pop-Location
  }
}

# Main
$Root = Resolve-Path $Root
$artifacts = Join-Path $Root "artifacts"
if(-not (Test-Path $artifacts)){ New-Item -ItemType Directory -Path $artifacts | Out-Null }

$patterns = Read-ZipIgnore $Root

# SRC ZIP
$srcFiles = Collect-Files -base $Root -rootPath $Root -patterns $patterns -prefixFilter $null
New-Zip (Join-Path $artifacts "gamevault-src.zip") $Root $srcFiles

# WEB ZIP
$webFiles = Collect-Files -base $Root -rootPath $Root -patterns $patterns -prefixFilter "web/"
New-Zip (Join-Path $artifacts "gamevault-web.zip") $Root $webFiles

# API ZIP
$apiFiles = Collect-Files -base $Root -rootPath $Root -patterns $patterns -prefixFilter "api/"
New-Zip (Join-Path $artifacts "gamevault-api.zip") $Root $apiFiles

if($NoPublish){
  Write-Info "Feito. Artefactos em: $(Join-Path $Root 'artifacts')"
  exit 0
}

if(-not $Owner -or -not $Repo){
  Write-Warn "Sem -Owner/-Repo -> não publico. Use -NoPublish para suprimir este aviso."
  exit 0
}

# GH publish
$gh = Get-Command gh -ErrorAction SilentlyContinue
if(-not $gh){
  Write-Warn "'gh' (GitHub CLI) não encontrado. Instala: https://cli.github.com/"
  Write-Warn "Ou define GH_TOKEN e tenta novamente."
  exit 0
}

try {
  gh release view $Tag --repo "$Owner/$Repo" | Out-Null
  Write-Info "Release '$Tag' existe. Vou enviar assets com --clobber."
  gh release upload $Tag "$artifacts\gamevault-*.zip" --repo "$Owner/$Repo" --clobber
} catch {
  Write-Info "Release '$Tag' não existe. Vou criar e publicar os zips."
  gh release create $Tag "$artifacts\gamevault-*.zip" --repo "$Owner/$Repo" --title "$Tag" --notes "Automated ZIPs" --latest
}
Write-Info "Concluído."
