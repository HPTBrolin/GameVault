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
