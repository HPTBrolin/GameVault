import React from "react";
import { createRoot } from "react-dom/client";
import SyncBadge from "../components/SyncBadge";
import { installSyncListeners, syncNow } from "../lib/sync";

const host = document.createElement("div");
document.body.appendChild(host);
createRoot(host).render(<SyncBadge />);

installSyncListeners();
addEventListener("gv:manual-sync", ()=> syncNow());
