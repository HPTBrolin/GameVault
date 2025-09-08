export default function Drawer({ open, onClose, children, side='left' }:{ open:boolean; onClose:()=>void; children:any; side?:'left'|'right' }){
  return (
    <div className="drawer" style={{pointerEvents: open ? 'auto' : 'none'}}>
      <div className="drawer-overlay" onClick={onClose} style={{opacity: open?1:0}}/>
      <div className={`drawer-panel ${side}`} style={{transform:`translateX(${open?0:(side==='left'?-100:100)}%)`}}>
        <div className="drawer-inner">{children}</div>
      </div>
    </div>
  )
}
