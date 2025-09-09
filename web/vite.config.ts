import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // active only if your client calls relative paths like "/games"
      "/games": { target: "http://localhost:8000", changeOrigin: true },
      "/providers": { target: "http://localhost:8000", changeOrigin: true },
      "/releases": { target: "http://localhost:8000", changeOrigin: true },
      "/settings": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
