import React, { useEffect, useState } from 'react'

export default function NetworkBadge(){
  const [online, setOnline] = useState<boolean>(navigator.onLine)

  useEffect(()=>{
    const on = ()=> setOnline(true)
    const off = ()=> setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return ()=>{
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if(online) return null
  return (
    <div style={barStyle}>
      <span>Sem ligação — a trabalhar offline</span>
    </div>
  )
}

const barStyle: React.CSSProperties = {
  position:'fixed',
  top:0,
  left:0,
  right:0,
  background:'linear-gradient(90deg, #7c3aed, #0ea5e9)',
  color:'#fff',
  textAlign:'center',
  padding:'8px 12px',
  fontWeight:600,
  zIndex: 9998
}
