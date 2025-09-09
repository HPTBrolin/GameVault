// web/src/overlays/boot-sync-badge.ts
// Badge “Sync em curso” + contador de fila, sem JSX (compila em .ts)

export function bootSyncBadge() {
  const id = "gv-sync-badge";
  if (document.getElementById(id)) return;

  const root = document.createElement("div");
  root.id = id;
  root.style.position = "fixed";
  root.style.right = "16px";
  root.style.bottom = "16px";
  root.style.zIndex = "2147483647";
  root.style.pointerEvents = "none";

  const chip = document.createElement("div");
  chip.setAttribute("role", "status");
  chip.style.pointerEvents = "auto";
  chip.style.display = "inline-flex";
  chip.style.alignItems = "center";
  chip.style.gap = "8px";
  chip.style.padding = "6px 10px";
  chip.style.borderRadius = "999px";
  chip.style.background = "linear-gradient(90deg,#19c389,#2388ff)";
  chip.style.color = "#fff";
  chip.style.boxShadow = "0 6px 18px rgba(0,0,0,.35)";
  chip.style.font = "500 12px/1.2 system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif";

  const dot = document.createElement("span");
  dot.style.width = "8px";
  dot.style.height = "8px";
  dot.style.borderRadius = "999px";
  dot.style.background = "#fff";
  dot.style.animation = "gv-pulse 1.2s ease-in-out infinite";
  chip.appendChild(dot);

  const label = document.createElement("span");
  label.textContent = "Sync em curso";
  chip.appendChild(label);

  const count = document.createElement("span");
  count.id = "gv-sync-queued";
  count.textContent = "0";
  count.style.marginLeft = "6px";
  count.style.padding = "2px 6px";
  count.style.borderRadius = "999px";
  count.style.background = "rgba(255,255,255,.18)";
  chip.appendChild(count);

  root.appendChild(chip);
  document.body.appendChild(root);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes gv-pulse {
      0% { opacity:.6; transform:scale(.9) }
      50%{ opacity:1;  transform:scale(1) }
      100%{ opacity:.6; transform:scale(.9) }
    }
  `;
  document.head.appendChild(style);
}

export function updateSyncQueued(n: number) {
  const el = document.getElementById("gv-sync-queued");
  if (el) el.textContent = String(n);
}
