import axios, { AxiosInstance } from "axios";

/**
 * Axios wrapper with small DX niceties:
 * - Flattens `{ params: {...} }` to `{...}` to avoid URLs like `?params[q]=...`
 * - Returns `res.data`
 * - Provides aliases { get, post, del } for retro-compatibilidade
 */

const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE ||
  (typeof window !== "undefined" && (window as any).__API_BASE__) ||
  "http://127.0.0.1:8000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

function flattenParams(params?: Record<string, any>) {
  if (!params) return undefined;
  // Se vier no formato axios-style { params: {...} }, achata para só {...}
  if (typeof params === "object" && "params" in params && typeof params.params === "object") {
    return params.params as Record<string, any>;
  }
  return params;
}

export async function apiGet<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  try {
    const realParams = flattenParams(params);
    const res = await api.get(url, { params: realParams });
    return res.data as T;
  } catch (err) {
    console.error("apiGet error", url, err);
    throw err;
  }
}

export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  try {
    const res = await api.post(url, data);
    return res.data as T;
  } catch (err) {
    console.error("apiPost error", url, err);
    throw err;
  }
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  try {
    const res = await api.delete(url);
    return res.data as T;
  } catch (err) {
    console.error("apiDelete error", url, err);
    throw err;
  }
}

// Retro-compat
export const get = apiGet;
export const post = apiPost;
export const del = apiDelete;

export default { apiGet, apiPost, apiDelete, get, post, del };
