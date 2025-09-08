import React, { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import "./appshell.css";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="logo" />GameVault</div>
        <nav>
          <NavLink to="/" end>📚 Library</NavLink>
          <NavLink to="/add">➕ Add New</NavLink>
          <NavLink to="/calendar">🗓️ Calendar</NavLink>
          <NavLink to="/settings">⚙️ Settings</NavLink>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
