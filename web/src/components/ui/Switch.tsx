
import React from 'react'
type Props = {checked:boolean, onChange:(v:boolean)=>void, label?:string}
export default function Switch({checked,onChange,label}:Props){
  return <label className="gv-switch">
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
    <span className="trk"/><span>{label}</span>
  </label>
}
