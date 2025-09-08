
import React from 'react'
import Tabs from '../ui/Tabs'

export default function AppShell({children, tab, onTab}:{children:React.ReactNode, tab:string, onTab:(k:string)=>void}){
  return <div className="app-shell">
    <div className="tabs-wrap token-card">
      <Tabs value={tab} onChange={onTab} items={[
        {key:'all',label:'Todos'},
        {key:'owned',label:'Coleção'},
        {key:'wishlist',label:'Lista de desejos'},
        {key:'hardware',label:'Hardware'},
        {key:'board',label:'Board games'},
      ]}/>
    </div>
    <main>{children}</main>
  </div>
}
