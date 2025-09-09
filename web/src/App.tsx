import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function App() {
  return (
    <div className="app-shell" style={{display:"grid",gridTemplateColumns:"240px 1fr",minHeight:"100vh"}}>
      <aside style={{background:"#0B1220",color:"#e6eefc",padding:"16px"}}>
        <div style={{fontWeight:700,letterSpacing:0.3,marginBottom:16}}>GameVault</div>
        <nav style={{display:"grid",gap:8}}>
          <NavLink to="/" end className={({isActive})=> isActive?"active":""}>Library</NavLink>
          <NavLink to="/add" className={({isActive})=> isActive?"active":""}>Add New</NavLink>
          <NavLink to="/calendar" className={({isActive})=> isActive?"active":""}>Calendar</NavLink>
          <NavLink to="/settings" className={({isActive})=> isActive?"active":""}>Settings</NavLink>
        </nav>
      </aside>
      <main style={{padding:"16px"}}>
        <Suspense fallback={<div>A carregar…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
