/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST || [])

async function notifyClients(msg:any){
  const clients = await self.clients.matchAll({ type:'window', includeUncontrolled: true })
  for(const c of clients){
    c.postMessage(msg)
  }
}

registerRoute(
  ({ url, request }) => request.method === 'GET' && (
    url.pathname.startsWith('/games') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/providers')
  ),
  new StaleWhileRevalidate({ cacheName: 'api-cache' }),
  'GET'
)

registerRoute(({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/assets'),
  new CacheFirst({ cacheName: 'assets-cache' }), 'GET')
registerRoute(({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images-cache' }), 'GET')

const bgSync = new BackgroundSyncPlugin('gv-post-queue', {
  maxRetentionTime: 24 * 60,
  onSync: async ({ queue }) => {
    await notifyClients({ type: 'gv:sync-start' })
    let processed = 0
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request)
        processed++
      } catch (err) {
        await queue.unshiftRequest(entry)
        break
      }
    }
    await notifyClients({ type: 'gv:sync-complete', processed })
  }
})

registerRoute(
  ({ url, request }) => request.method === 'POST' && url.pathname.endsWith('/games'),
  new NetworkOnly({ plugins: [bgSync] }),
  'POST'
)
