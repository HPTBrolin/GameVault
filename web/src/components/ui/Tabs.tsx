
import React from 'react'
type Item = {key:string, label:string}
export default function Tabs({items, value, onChange}:{items:Item[], value:string, onChange:(k:string)=>void}){
  return <div className="gv-tabs">
    {items.map(it=> <button key={it.key} className={value===it.key?'on':''} onClick={()=>onChange(it.key)}>{it.label}</button>)}
  </div>
}
