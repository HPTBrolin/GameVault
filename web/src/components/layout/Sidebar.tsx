import { Link, useLocation } from "react-router-dom";
import React from "react";

type Item = { to: string; label: string; icon?: React.ReactNode };
const items: Item[] = [
  { to: "/", label: "Library", icon: "📚" },
  { to: "/add", label: "Add New", icon: "➕" },
  { to: "/unmapped", label: "Unmapped Files", icon: "📦" },
  { to: "/calendar", label: "Calendar", icon: "📅" },
  { to: "/activity", label: "Activity", icon: "⚡" },
  { to: "/wanted", label: "Wanted", icon: "⭐" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
  { to: "/system", label: "System", icon: "🖥️" },
];

export default function Sidebar() {
  const loc = useLocation();
  return (
    <aside className="gv-sidebar">
      <div className="brand"><span className="logo" /> GameVault</div>
      <nav>
        {items.map(it => {
          const active = (it.to === "/" && loc.pathname === "/") || (it.to !== "/" && loc.pathname.startsWith(it.to));
          return (
            <Link key={it.to} to={it.to} className={active ? "nav-item active" : "nav-item"}>
              <span className="i">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
