
import React from 'react'
type Name = 'search'|'filter'|'stats'|'settings'|'add'|'more'|'close'|'grid'|'list'|'shelf'|'scan'|'barcode'|'gamepad'|'hardware'|'chevron-left'|'chevron-right'|'chevrons-left'|'chevrons-right'|'sort'|'arrow-up'|'arrow-down'
type Props = { name: Name, size?: number }
export default function Icon({name,size=18}:Props){
  const s = {width:size, height:size}
  const stroke='currentColor'
  switch(name){
    case 'search': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M21 21l-3.6-3.6" strokeWidth="2"/></svg>)
    case 'filter': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M3 5h18M6 12h12M10 19h4" strokeWidth="2" strokeLinecap="round"/></svg>)
    case 'stats': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M4 20V10M10 20V4M16 20v-7M2 20h20" strokeWidth="2"/></svg>)
    case 'settings': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15A7.96 7.96 0 0 0 20 12c0-.51-.05-1-.16-1.48l2.06-1.6-2-3.46-2.46.68A8.1 8.1 0 0 0 15 4.6L14.32 2h-4.64L9 4.6A8.1 8.1 0 0 0 6.4 6.14L3.94 5.46l-2 3.46 2.06 1.6C4 11 4 11.5 4 12s.05 1 .16 1.48l-2.06 1.6 2 3.46 2.46-.68A8.1 8.1 0 0 0 9 19.4L9.68 22h4.64L15 19.4a8.1 8.1 0 0 0 2.6-1.54l2.46.68 2-3.46-2.06-1.6Z" strokeWidth="1.2"/></svg>)
    case 'add': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M12 5v14M5 12h14" strokeWidth="2"/></svg>)
    case 'more': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>)
    case 'close': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M6 6l12 12M18 6L6 18" strokeWidth="2"/></svg>)
    case 'grid': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>)
    case 'list': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg>)
    case 'shelf': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M3 8h18M3 16h18M5 4h14M5 20h14" strokeWidth="2"/></svg>)
    case 'scan': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2" strokeWidth="2"/><path d="M5 12h14" strokeWidth="2"/></svg>)
    case 'barcode': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M4 6v12M6 6v12M9 6v12M12 6v12M14 6v12M17 6v12M20 6v12" strokeWidth="2"/></svg>)
    case 'gamepad': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M7 12h4M9 10v4M16 11h.01M18.5 13h.01" strokeWidth="2"/><path d="M3 15c0-2.8 2.2-5 5-5h8c2.8 0 5 2.2 5 5 0 2.2-1.8 4-4 4-.8 0-1.5-.2-2.2-.6l-1.5-.9h-2.6l-1.5.9c-.7.4-1.4.6-2.2.6-2.2 0-4-1.8-4-4Z" strokeWidth="2"/></svg>)
    case 'hardware': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><rect x="3" y="5" width="18" height="10" rx="2" strokeWidth="2"/><path d="M7 20h10" strokeWidth="2"/></svg>)
    case 'chevron-left': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    case 'chevron-right': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    case 'chevrons-left': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    case 'chevrons-right': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M7 7l5 5-5 5M14 7l5 5-5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    case 'sort': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M3 7h12M3 12h8M3 17h4" strokeWidth="2" strokeLinecap="round"/></svg>)
    case 'arrow-up': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    case 'arrow-down': return (<svg style={s} viewBox="0 0 24 24" fill="none" stroke={stroke}><path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
  }
  return null
}
