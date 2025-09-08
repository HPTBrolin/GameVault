import React, { createContext, useContext, useState } from 'react'
type Toast = { id: number; text: string; type?: 'info'|'success'|'error' }
type Ctx = { push: (text: string, type?: Toast['type']) => void }
const ToastCtx = createContext<Ctx>({ push: () => {} })
export const useToaster = () => useContext(ToastCtx)
export function ToasterProvider({ children }:{ children: React.ReactNode }){
  const [items, setItems] = useState<Toast[]>([])
  const push = (text: string, type: Toast['type']='info') => {
    const id = Date.now() + Math.random()
    setItems(x => [...x, { id, text, type }])
    setTimeout(() => setItems(x => x.filter(i => i.id !== id)), 3200)
  }
  return (<ToastCtx.Provider value={{ push }}>
    {children}
    <div className="toaster">
      {items.map(t => (<div key={t.id} className={`toast ${t.type||'info'}`}>{t.text}</div>))}
    </div>
  </ToastCtx.Provider>)
}
