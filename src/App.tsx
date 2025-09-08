// src/App.tsx
import { Outlet, NavLink } from "react-router-dom";
import "./styles/app.css";
import "./styles/theme.css";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="nav">
          <NavLink to="/" end className={({isActive})=> "nav-link"+(isActive?" active":"")}>Biblioteca</NavLink>
          <NavLink to="/add" className={({isActive})=> "nav-link"+(isActive?" active":"")}>Adicionar</NavLink>
          <NavLink to="/calendar" className={({isActive})=> "nav-link"+(isActive?" active":"")}>Calendário</NavLink>
          <NavLink to="/settings" className={({isActive})=> "nav-link"+(isActive?" active":"")}>Definições</NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
