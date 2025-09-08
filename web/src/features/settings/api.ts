
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://127.0.0.1:8000";
export type AppSettings = {
  RAWG_API_KEY?:string|null;
  BARCODE_API_URL?:string|null;
  TRACK_INTERVAL_MINUTES?:number;
}
export async function getSettings():Promise<AppSettings>{
  const res = await fetch(`${API_BASE}/settings`);
  if(!res.ok) throw new Error("settings");
  return res.json();
}
export async function saveSettings(s:AppSettings){
  const res = await fetch(`${API_BASE}/settings`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(s)
  });
  if(!res.ok) throw new Error("settings-save");
  return res.json();
}
