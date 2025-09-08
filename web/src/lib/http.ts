import axios, { AxiosInstance } from "axios";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || (window as any).__API_URL__ || "http://127.0.0.1:8000";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

api.interceptors.response.use(
  r => r,
  err => {
    // normaliza mensagens offline/network
    if (err?.code === "ERR_NETWORK") {
      err.message = "offline";
    }
    return Promise.reject(err);
  }
);

export async function get<T=any>(url:string, params?:any): Promise<T> {
  const r = await api.get(url, { params });
  return r.data as T;
}
export async function post<T=any>(url:string, data?:any): Promise<T> {
  const r = await api.post(url, data);
  return r.data as T;
}
export async function put<T=any>(url:string, data?:any): Promise<T> {
  const r = await api.put(url, data);
  return r.data as T;
}
export async function del<T=any>(url:string): Promise<T> {
  const r = await api.delete(url);
  return r.data as T;
}

// Backwards compat aliases
export const apiGet = get;
