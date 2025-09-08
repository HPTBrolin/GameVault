import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      devOptions: { enabled: false }, // SW OFF in dev para evitar ruído
      workbox: {
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/(games|settings|providers)/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "assets-images",
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request }) => ["style", "script", "font"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "assets-static" }
          },
          // API: não cachear; os writes são geridos pela fila offline
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && /^\/(games|settings|providers)/.test(url.pathname),
            handler: "NetworkOnly",
            options: { cacheName: "api-bypass" }
          }
        ]
      }
    })
  ]
});
