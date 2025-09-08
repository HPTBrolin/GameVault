
import React from 'react'
import Icon from '../ui/Icon'
import Button from '../ui/Button'

export default function Navbar({onOpenFilters, onOpenSettings}:{onOpenFilters:()=>void, onOpenSettings:()=>void}){
  return <header className="gv-topbar token-card">
    <div className="brand"><div className="logo"/><span>GameVault</span></div>
    <div className="search">
      <Icon name="search"/><input placeholder="Pesquisar título, plataforma, código de barras…"/>
    </div>
    <div className="actions">
      <Button variant="ghost" onClick={onOpenFilters} iconLeft={<Icon name="filter"/>}>Filtros</Button>
      <Button variant="ghost" onClick={onOpenSettings} iconLeft={<Icon name="settings"/>}>Definições</Button>
    </div>
  </header>
}
