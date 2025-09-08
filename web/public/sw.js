const STATIC_CACHE='gv-static-v1';
const IMG_CACHE='gv-img-v1';
const API_CACHE='gv-api-v1';

const STATIC_ASSETS=[
  '/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>{
      if(![STATIC_CACHE,IMG_CACHE,API_CACHE].includes(k)) return caches.delete(k);
    }))).then(()=>self.clients.claim())
  );
});

// Navigation fallback
self.addEventListener('fetch', e=>{
  const req=e.request;
  const url=new URL(req.url);
  // Only same-origin
  if(url.origin!==location.origin) return;

  // Images: cache-first
  if(req.destination==='image'){
    e.respondWith((async()=>{
      const cache=await caches.open(IMG_CACHE);
      const hit=await cache.match(req);
      if(hit) return hit;
      try{
        const res=await fetch(req);
        cache.put(req,res.clone());
        return res;
      }catch(_){
        return caches.match('/placeholder-cover.svg');
      }
    })());
    return;
  }

  // API GET: stale-while-revalidate (settings/games/releases/stats)
  if(url.pathname.startsWith('/settings')||url.pathname.startsWith('/games')||url.pathname.startsWith('/releases')||url.pathname.startsWith('/stats')){
    if(req.method==='GET'){
      e.respondWith((async()=>{
        const cache=await caches.open(API_CACHE);
        const cached=await cache.match(req);
        const net=fetch(req).then(res=>{ if(res.ok) cache.put(req,res.clone()); return res }).catch(_=>cached||Response.error());
        return cached||net;
      })());
      return;
    }
  }

  // Navigations: network first → offline fallback
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      try{ return await fetch(req) }catch(_){ return caches.match('/offline.html') }
    })());
  }
});
