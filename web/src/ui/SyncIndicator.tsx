import { useEffect, useState } from "react";
import bus from "../lib/syncBus";

export default function SyncIndicator(){
  const [count, setCount] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);

  useEffect(()=>{
    const onQ = (e: any)=> setCount(e.detail || 0);
    const onS = ()=> setActive(true);
    const onE = ()=> setActive(false);
    bus.addEventListener('queueSize', onQ as any);
    bus.addEventListener('syncStart', onS as any);
    bus.addEventListener('syncEnd', onE as any);
    return ()=>{
      bus.removeEventListener('queueSize', onQ as any);
      bus.removeEventListener('syncStart', onS as any);
      bus.removeEventListener('syncEnd', onE as any);
    };
  }, []);

  return (
    <div className="sync">
      <span className={active ? 'dot active' : 'dot'} />
      <span className="label">{active ? 'Sync em curso' : 'Sync'}</span>
      {count>0 && <span className="count">{count}</span>}
    </div>
  );
}
