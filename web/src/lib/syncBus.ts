const bus = new EventTarget();
function fire(type: string, detail?: any){
  bus.dispatchEvent(new CustomEvent(type, { detail }));
}
(window as any).gvSync = { fire };
export function notifyQueueSize(n:number){ fire('queueSize', n); }
export function notifySyncStart(){ fire('syncStart'); }
export function notifySyncEnd(){ fire('syncEnd'); }
export default bus;
