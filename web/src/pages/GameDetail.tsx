
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { getGame, type Game } from "../features/games/api";

export default function GameDetailPage(){
  const { id } = useParams();
  const [g,setG] = useState<Game|undefined>();

  useEffect(()=>{
    (async()=>{
      if(!id) return;
      try{
        const data = await getGame(id);
        setG(data);
      }catch{}
    })();
  },[id]);

  return (
    <Layout>
      {!g ? <div className="loading">A carregar…</div> : (
        <div className="detail">
          <div className="cover big" style={{backgroundImage:`url(${g.cover_url||''})`}} />
          <div className="meta">
            <h2>{g.title}</h2>
            <div className="sub">{g.platform||""}</div>
            <div className="sub">Lançado: {g.release_date? new Date(g.release_date).toLocaleDateString():"?"}</div>
          </div>
        </div>
      )}
    </Layout>
  );
}
