import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/tripduel_frontend/",
  plugins: [react(), VitePWA(/* unchanged */)],
  server: {
    proxy: {
      '/api': {
        target: 'http://gruppe8.sccprak.netd.cs.tu-dresden.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
