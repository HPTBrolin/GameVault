
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiGet } from "../lib/http";

type Release = { id:string|number; title:string; date:string; platform?:string; };

export default function CalendarPage(){
  const [items,setItems] = useState<Release[]>([]);
  const [err,setErr] = useState<string|undefined>();

  useEffect(()=>{
    (async()=>{
      try{
        // graceful fallback if /releases/upcoming is missing
        const data = await apiGet<Release[]>("/releases/upcoming", { days: 60, limit: 50 });
        setItems(Array.isArray(data)?data:[]);
      }catch{
        setErr("Sem lançamentos próximos");
      }
    })();
  },[]);

  return (
    <Layout>
      <h2>Próximos lançamentos</h2>
      {err && <div className="empty">{err}</div>}
      <ul className="list">
        {items.map(r=>(
          <li key={String(r.id)} className="row">
            <div className="date">{new Date(r.date).toLocaleDateString()}</div>
            <div className="title">{r.title}</div>
            <div className="sub">{r.platform||""}</div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
