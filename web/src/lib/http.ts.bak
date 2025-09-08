// Lightweight axios wrapper with stable named exports
// Works with imports expecting either apiGet/apiPost/... OR get/post/put/del
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  withCredentials: false,
});

export type Params = Record<string, any> | undefined;

export async function apiGet<T=any>(url: string, params?: Params): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data as T;
}
export async function apiPost<T=any>(url: string, data?: any): Promise<T> {
  const res = await api.post<T>(url, data);
  return res.data as T;
}
export async function apiPut<T=any>(url: string, data?: any): Promise<T> {
  const res = await api.put<T>(url, data);
  return res.data as T;
}
export async function apiDelete<T=any>(url: string, params?: Params): Promise<T> {
  const res = await api.delete<T>(url, { params });
  return res.data as T;
}

// Backwards-compatible aliases used in parts of the app
export const get  = apiGet;
export const post = apiPost;
export const put  = apiPut;
export const del  = apiDelete;

export default api;
