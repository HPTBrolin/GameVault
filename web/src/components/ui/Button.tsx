
import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'ghost'|'danger'|'subtle', size?:'sm'|'md'|'lg', block?:boolean, iconLeft?:React.ReactNode, iconRight?:React.ReactNode}
export default function Button({variant='primary', size='md', block=false, iconLeft, iconRight, children, ...rest}:Props){
  const cls = ['gv-btn', `v-${variant}`, `s-${size}`, block?'block':''].join(' ')
  return <button className={cls} {...rest}>{iconLeft && <span className="ic">{iconLeft}</span>}{children}{iconRight && <span className="ic r">{iconRight}</span>}</button>
}
