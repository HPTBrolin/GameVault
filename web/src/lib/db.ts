import Dexie, { Table } from "dexie";

export interface PendingOp {
  id?: number;
  kind: "POST" | "PUT" | "DELETE";
  url: string;
  body: any;
  createdAt: number;
}

class GVDB extends Dexie {
  pending!: Table<PendingOp, number>;
  constructor() {
    super("gamevault");
    this.version(1).stores({
      pending: "++id, createdAt, kind, url"
    });
  }
}

export const db = new GVDB();

export async function queueOp(op: Omit<PendingOp,"id"|"createdAt">) {
  const id = await db.pending.add({ ...op, createdAt: Date.now() });
  dispatchEvent(new CustomEvent("gv:sync", { detail: { state: "queued", count: await db.pending.count() } }));
  return id;
}

export async function getQueueCount() {
  return db.pending.count();
}
