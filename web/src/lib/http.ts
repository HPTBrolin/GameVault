
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export async function get<T>(url: string, params?: any): Promise<T> {
  const res = await api.get(url, { params });
  return res.data as T;
}
export async function post<T>(url: string, data?: any): Promise<T> {
  const res = await api.post(url, data);
  return res.data as T;
}
export async function del<T>(url: string): Promise<T> {
  const res = await api.delete(url);
  return res.data as T;
}

export { get as apiGet, post as apiPost, del as apiDel };
export default api;
