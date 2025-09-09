
param(
  [string]$RepoRoot = "."
)

function Backup-And-Write($targetPath, $content) {
  $full = Join-Path $RepoRoot $targetPath
  $dir = Split-Path $full -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path $full) {
    $stamp = Get-Date -UFormat "%Y%m%d%H%M"
    Copy-Item $full "$full.bak.$stamp" -Force
  }
  $content | Out-File -FilePath $full -Encoding utf8 -Force
  Write-Host "✓ Patched $targetPath"
}

# --- FRONTEND ---
# http.ts
$httpTs = @"
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export async function apiGet<T = any>(url: string, params?: any): Promise<T> {
  const r = await api.get(url, { params });
  return r.data;
}
export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  const r = await api.post(url, data);
  return r.data;
}
export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  const r = await api.put(url, data);
  return r.data;
}
export async function apiDel<T = any>(url: string): Promise<T> {
  const r = await api.delete(url);
  return r.data;
}

export default api;
"@
Backup-And-Write "web/src/lib/http.ts" $httpTs

# games api.ts
$gamesApiTs = @"
import { apiGet, apiPost, apiDel } from "@/lib/http";

export interface Paged<T> { items: T[]; total: number; offset: number; limit: number; }

export function listGamesPagedByPage(page: number, limit: number, filters?: Record<string, any>) {
  const offset = page * limit;
  return apiGet<Paged<any>>("/games/paged", { ...filters, offset, limit });
}

export function getGame(id: number | string) {
  return apiGet<any>(`/games/${id}`);
}

export function searchProviders(q: string) {
  return apiGet<{ items: any[]; error?: string }>("/providers/search", { q });
}

export function createGame(payload: any) {
  return apiPost<any>("/games", payload);
}

export function deleteGame(id: number | string) {
  return apiDel<any>(`/games/${id}`);
}
"@
Backup-And-Write "web/src/features/games/api.ts" $gamesApiTs

# router.tsx
$routerTsx = @"
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { lazy } from "react";

const Library = lazy(() => import("@/pages/Library"));
const Add = lazy(() => import("@/pages/Add"));
const Settings = lazy(() => import("@/pages/Settings"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Calendar = lazy(() => import("@/pages/Calendar"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Library /> },
      { path: "add", element: <Add /> },
      { path: "settings", element: <Settings /> },
      { path: "calendar", element: <Calendar /> },
      { path: "game/:id", element: <GameDetail /> },
    ],
  },
]);

export default router;
"@
Backup-And-Write "web/src/app/router.tsx" $routerTsx

# main.tsx
$mainTsx = @"
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
"@
Backup-And-Write "web/src/main.tsx" $mainTsx

# App.tsx
$appTsx = @"
import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function App() {
  return (
    <div className="app-shell" style={{display:"grid",gridTemplateColumns:"240px 1fr",minHeight:"100vh"}}>
      <aside style={{background:"#0B1220",color:"#e6eefc",padding:"16px"}}>
        <div style={{fontWeight:700,letterSpacing:0.3,marginBottom:16}}>GameVault</div>
        <nav style={{display:"grid",gap:8}}>
          <NavLink to="/" end className={({isActive})=> isActive?"active":""}>Library</NavLink>
          <NavLink to="/add" className={({isActive})=> isActive?"active":""}>Add New</NavLink>
          <NavLink to="/calendar" className={({isActive})=> isActive?"active":""}>Calendar</NavLink>
          <NavLink to="/settings" className={({isActive})=> isActive?"active":""}>Settings</NavLink>
        </nav>
      </aside>
      <main style={{padding:"16px"}}>
        <Suspense fallback={<div>A carregar…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
"@
Backup-And-Write "web/src/App.tsx" $appTsx

# vite.config.ts (ensure alias @)
$viteConfig = @"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
});
"@
# Only write if not present, otherwise leave user's file intact
$vitePath = Join-Path $RepoRoot "web/vite.config.ts"
if (!(Test-Path $vitePath)) {
  Backup-And-Write "web/vite.config.ts" $viteConfig
}

# tsconfig.json: inject alias if missing
$tsPath = Join-Path $RepoRoot "web/tsconfig.json"
if (Test-Path $tsPath) {
  try {
    $json = Get-Content $tsPath -Raw | ConvertFrom-Json
    if (!$json.compilerOptions) { $json | Add-Member -NotePropertyName compilerOptions -NotePropertyValue (@{}) }
    if (!$json.compilerOptions.baseUrl) { $json.compilerOptions.baseUrl = "." }
    if (!$json.compilerOptions.paths) { $json.compilerOptions.paths = @{} }
    if (!$json.compilerOptions.paths."@/*") { $json.compilerOptions.paths."@/*" = @("src/*") }
    ($json | ConvertTo-Json -Depth 10) | Out-File -FilePath $tsPath -Encoding utf8
    Write-Host "✓ Patched web\\tsconfig.json (alias @)"
  } catch {
    Write-Host "! Falha a ajustar tsconfig.json, escreve à mão o alias @ -> src"
  }
}

# --- BACKEND (RAWG provider robusto) ---
$rawgPy = @"
from __future__ import annotations
import os
from typing import Any, Dict, List
import httpx

from ...config import get_settings  # type: ignore

async def search(query: str) -> List[Dict[str, Any]]:
    if not query:
        return []
    s = get_settings() if callable(get_settings) else None  # tolerante
    api_key = getattr(s, "RAWG_API_KEY", None) or os.getenv("RAWG_API_KEY")
    params = { "search": query, "page_size": 10 }
    if api_key:
        params["key"] = api_key

    async with httpx.AsyncClient(timeout=10) as c:
        try:
            r = await c.get("https://api.rawg.io/api/games", params=params)
            r.raise_for_status()
            data = r.json() or {}
        except Exception:
            # Sem API key ou erro rede: comportamento tolerante
            return []

    results = []
    for item in data.get("results", []) or []:
        platforms = []
        for p in (item.get("platforms") or []):
            plat = (p or {}).get("platform") or {}
            name = plat.get("name") or ""
            if name:
                platforms.append(name)
        results.append({
            "provider": "rawg",
            "id": item.get("id"),
            "slug": item.get("slug"),
            "title": item.get("name"),
            "platform": ", ".join(platforms) if platforms else None,
            "release_date": item.get("released"),
            "cover_url": (item.get("background_image") or None),
        })
    return results
"@
Backup-And-Write "api/app/services/providers/rawg.py" $rawgPy

$providersRouter = @"
from fastapi import APIRouter, Query
from ..services.providers import rawg

router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("/search")
async def provider_search(q: str = Query(...), kind: str | None = None):
    items = []
    try:
        if kind in (None, "video"):
            items.extend(await rawg.search(q))
    except Exception as e:
        return {"items": [], "error": str(e)}
    return {"items": items}
"@
Backup-And-Write "api/app/routers/providers.py" $providersRouter

Write-Host "`nPatch aplicado. Reinstala deps e arranca conforme README-APPLY.md" -ForegroundColor Green
