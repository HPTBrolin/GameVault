
import React from 'react'
type Props = React.InputHTMLAttributes<HTMLInputElement> & {label?:string, hint?:string, right?:React.ReactNode}
export default function Input({label, hint, right, ...rest}:Props){
  return <label className="gv-field">
    {label && <span className="lb">{label}</span>}
    <div className="ctr">
      <input className="gv-input" {...rest}/>
      {right && <div className="right">{right}</div>}
    </div>
    {hint && <small className="hint">{hint}</small>}
  </label>
}
