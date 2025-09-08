
import React from 'react'
export default function Toolbar({left,right}:{left?:React.ReactNode,right?:React.ReactNode}){
  return <div className="gv-toolbar token-card">
    <div className="left">{left}</div><div className="flex"/><div className="right">{right}</div>
  </div>
}
