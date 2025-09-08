// web/src/lib/http.ts
// Minimal, backward-compatible HTTP helper with axios.
// Exports: get/post/del and aliases apiGet/apiPost/apiDel to avoid breaking callers.
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL =
  (import.meta as any)?.env?.VITE_API_URL?.replace(/\/?$/, "") || "http://localhost:8000";

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

function isNetworkish(err: any) {
  // Avoid previous Python-styled "or" mistake — use JS operators.
  return (
    err?.message === "offline" ||
    err?.code === "ERR_NETWORK" ||
    !err?.response
  );
}

export async function get<T = any>(url: string, config?: AxiosRequestConfig) {
  try {
    const r = await api.get<T>(url, config);
    return r.data as T;
  } catch (err: any) {
    if (isNetworkish(err)) throw new Error("offline");
    throw err;
  }
}

export async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  try {
    const r = await api.post<T>(url, data, config);
    return r.data as T;
  } catch (err: any) {
    if (isNetworkish(err)) throw new Error("offline");
    throw err;
  }
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig) {
  try {
    const r = await api.delete<T>(url, config);
    return r.data as T;
  } catch (err: any) {
    if (isNetworkish(err)) throw new Error("offline");
    throw err;
  }
}

// Backward-compat exports used in some components:
export { get as apiGet, post as apiPost, del as apiDel };
export default api;
