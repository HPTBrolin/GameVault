import axios from "axios";
export const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://127.0.0.1:8000";
export const api = axios.create({ baseURL: API_BASE, withCredentials: false });

export async function get<T=any>(url: string): Promise<T> {
  const r = await api.get(url);
  return r.data as T;
}
export async function post<T=any>(url: string, data: any): Promise<T> {
  const r = await api.post(url, data);
  return r.data as T;
}
export async function put<T=any>(url: string, data: any): Promise<T> {
  const r = await api.put(url, data);
  return r.data as T;
}
export async function del<T=any>(url: string): Promise<T> {
  const r = await api.delete(url);
  return r.data as T;
}
// Back-compat alias some screens expect
export const apiGet = get;
