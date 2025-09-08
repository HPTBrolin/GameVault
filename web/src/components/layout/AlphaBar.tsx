import React from "react";
import { useSearchParams } from "react-router-dom";

const letters = ["★","#"].concat(Array.from({length:26},(_,i)=>String.fromCharCode(65+i)));

export default function AlphaBar(){
  const [params, setParams] = useSearchParams();
  const active = params.get("alpha") || "";
  const click = (L:string)=>{
    const p = new URLSearchParams(params);
    if (L === "★") p.delete("alpha");
    else p.set("alpha", L);
    p.set("offset","0");
    setParams(p);
  };
  return (
    <div className="gv-alpha">
      {letters.map(L => (
        <button key={L} onClick={()=>click(L)} className={active===L ? "a active":"a"}>{L}</button>
      ))}
    </div>
  );
}
