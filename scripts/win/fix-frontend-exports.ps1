# Salva como: scripts\win\fix-frontend-exports.ps1
$ErrorActionPreference = "Stop"

$newHttp = @'
import axios, { AxiosInstance } from "axios";

let BASE = (localStorage.getItem("settings.apiBase") || import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000").toString();

export function setApiBase(url: string){
  BASE = url;
}

function join(base: string, url: string){
  if (/^https?:\/\//i.test(url)) return url;
  return base.replace(/\/+$/,"") + "/" + url.replace(/^\/+/,"");
}

const api: AxiosInstance = axios.create({
  // baseURL: BASE  -> usamos join(base,url) para permitir mudar BASE em runtime
  withCredentials: false,
  timeout: 20000,
});

// --- Wrappers básicos (com fallback de params/data) ---
export async function get<T=any>(url: string, params?: any): Promise<T> {
  const r = await api.get<T>(join(BASE, url), { params });
  return r.data as T;
}

export async function post<T=any>(url: string, data?: any): Promise<T> {
  const r = await api.post<T>(join(BASE, url), data);
  return r.data as T;
}

export async function put<T=any>(url: string, data?: any): Promise<T> {
  const r = await api.put<T>(join(BASE, url), data);
  return r.data as T;
}

export async function del<T=any>(url: string): Promise<T> {
  const r = await api.delete<T>(join(BASE, url));
  return r.data as T;
}

// --- Aliases retro-compatíveis (evita “does not provide an export named ...”) ---
export const apiGet = get;
export const apiPost = post;
export const apiPut = put;
export const apiDelete = del;

export default { get, post, put, del, setApiBase };
'@

$newGamesApi = @'
/**
 * API de jogos: exports estáveis para o resto da app.
 * Mantém nomes esperados pelos componentes (searchProviders, getGame, createGame, etc.).
 */

import { get, post, put, del } from "../../lib/http";

// Tipos leves para não quebrar TS (evita “property X does not exist …”)
export type ID = string | number;

export type Game = {
  id?: ID;
  slug?: string;
  title: string;
  platform?: string;
  cover_url?: string;
  release_date?: string | null;
  status?: "owned" | "wishlist" | "played" | string;
  [key: string]: any;
};

export type Paged<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};

export type ProviderItem = {
  id: string;
  slug?: string;
  title: string;
  cover_url?: string;
  release_date?: string | null;
  platforms?: string[];
};

// ----------------- LISTAGEM / PAGINAÇÃO -----------------

/**
 * Backend pode expor /games/paged ou /games com offset/limit.
 * Aqui tentamos /games/paged e, se 404, caímos para /games.
 */
export async function listGamesPaged(offset = 0, limit = 30, filters?: Record<string, any>): Promise<Paged<Game>> {
  // serializa filtros simples
  const params: Record<string, any> = { offset, limit, ...(filters || {}) };

  try {
    return await get<Paged<Game>>("/games/paged", params); // caminho “novo”
  } catch (e: any) {
    // fallback p/ caminho “antigo”
    return await get<Paged<Game>>("/games", params);
  }
}

// ----------------- CRUD -----------------

export async function getGame(id: ID): Promise<Game> {
  return await get<Game>(`/games/${id}`);
}

export async function createGame(payload: Partial<Game>): Promise<Game> {
  return await post<Game>("/games", payload);
}

export async function updateGame(id: ID, payload: Partial<Game>): Promise<Game> {
  return await put<Game>(`/games/${id}`, payload);
}

export async function deleteGame(id: ID): Promise<{ ok: boolean } | any> {
  return await del(`/games/${id}`);
}

// ----------------- PROVEDORES / RAWG -----------------

/**
 * Pesquisa em provedores (ex.: RAWG) via backend.
 * Correspondência com a rota FastAPI /providers/search?q=...&kind=...
 */
export async function searchProviders(query: string, kind?: "video" | "board" | "hardware"): Promise<ProviderItem[]> {
  if (!query?.trim()) return [];
  const params: Record<string, any> = { q: query.trim() };
  if (kind) params.kind = kind;
  return await get<ProviderItem[]>(`/providers/search`, params);
}

// ----------------- LANÇAMENTOS / CALENDÁRIO -----------------

export type ReleaseItem = {
  id?: ID;
  title: string;
  release_date?: string | null;
  platform?: string;
  cover_url?: string;
  [k: string]: any;
};

export async function upcomingReleases(days = 60, limit = 20): Promise<ReleaseItem[]> {
  // alguns backends expõem /releases/upcoming; se não existir, devolvemos []
  try {
    return await get<ReleaseItem[]>(`/releases/upcoming`, { days, limit });
  } catch {
    return [];
  }
}

// ----------------- DEFINIÇÕES -----------------

export async function getSettings(): Promise<any> {
  return await get<any>("/settings");
}

export async function saveSettings(data: any): Promise<any> {
  return await put<any>("/settings", data);
}

// Export default opcional (se algum import default depender disto)
export default {
  listGamesPaged,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  searchProviders,
  upcomingReleases,
  getSettings,
  saveSettings
};
'@

function Write-FileSafe($path, $content) {
  if (Test-Path $path) {
    Copy-Item $path "$path.bak" -Force
  } else {
    New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null
  }
  Set-Content -Path $path -Value $content -Encoding UTF8
  Write-Host "Atualizado: $path (backup em $path.bak se existia)" -ForegroundColor Green
}

Write-FileSafe "src\lib\http.ts" $newHttp
Write-FileSafe "src\features\games\api.ts" $newGamesApi

Write-Host "`n✅ Patch aplicado. Passos:" -ForegroundColor Cyan
Write-Host "  1) npm run dev (ou reiniciar o vite)" -ForegroundColor DarkGray
Write-Host "  2) Em Add.tsx, garantir:  import { searchProviders, createGame } from '@/features/games/api';" -ForegroundColor DarkGray
