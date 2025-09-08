
import React from 'react'
type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {label?:string, hint?:string}
export default function Select({label, hint, children, ...rest}:Props){
  return <label className="gv-field">
    {label && <span className="lb">{label}</span>}
    <select className="gv-input" {...rest}>{children}</select>
    {hint && <small className="hint">{hint}</small>}
  </label>
}
