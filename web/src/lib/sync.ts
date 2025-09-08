// src/lib/sync.ts
import React from "react";

export type SyncStatus = "idle" | "syncing" | "error";
export interface SyncState {
  pending: number;
  status: SyncStatus;
  lastError?: string;
}

type Listener = (s: SyncState) => void;

const state: SyncState = { pending: 0, status: "idle" };
const listeners = new Set<Listener>();

function emit() {
  for (const cb of Array.from(listeners)) cb({ ...state });
}

export const sync = {
  getState(): SyncState { return { ...state }; },
  setPending(n: number) { state.pending = Math.max(0, n|0); emit(); },
  setStatus(st: SyncStatus) { state.status = st; emit(); },
  setError(msg?: string) { state.lastError = msg; state.status = "error"; emit(); },
  subscribe(cb: Listener) { listeners.add(cb); cb({ ...state }); return () => listeners.delete(cb); },
};

export function useSync() {
  const [s, setS] = React.useState<SyncState>(sync.getState());
  React.useEffect(() => sync.subscribe(setS), []);
  return s;
}
