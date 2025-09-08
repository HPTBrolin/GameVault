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
