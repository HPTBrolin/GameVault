import React from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const q = sp.get('q') || '';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">GameVault</div>
        <nav>
          <NavLink to="/" end>Library</NavLink>
          <NavLink to="/add">Add New</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <input
            className="search"
            placeholder="Pesquisar…"
            value={q}
            onChange={(e)=>{ const v=e.target.value; v? sp.set('q', v): sp.delete('q'); setSp(sp, {replace:false}); }}
          />
          <div className="actions">
            <Link className="btn" to="/add">+ Add</Link>
            <Link className="btn" to="/settings">⚙ Definições</Link>
          </div>
        </header>
        <section className="page">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
