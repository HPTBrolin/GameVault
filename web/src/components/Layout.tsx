
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/app.css";

type Props = { children: React.ReactNode };

export default function Layout({children}: Props){
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand"><div className="logo"/> GameVault</div>
        <nav>
          <NavLink to="/" end>📚 Biblioteca</NavLink>
          <NavLink to="/calendar">📅 Calendário</NavLink>
          <NavLink to="/add">➕ Adicionar</NavLink>
          <NavLink to="/settings">⚙️ Definições</NavLink>
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div className="actions">
            <Link className="btn" to="/add">+ Novo</Link>
            <button className="btn" data-open-filter>Filtros</button>
            <button className="btn" data-sync>⟳ Sync</button>
          </div>
        </header>
        <section className="page">{children}</section>
      </main>
    </div>
  );
}
