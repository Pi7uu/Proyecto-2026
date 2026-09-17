import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // En build los assets deben colgar de STATIC_URL de Django (/static/),
  // que es quien los sirve en producción. En dev se usa / para no mover
  // la URL ni romper las rutas de React Router.
  base: command === "build" ? "/static/" : "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
}))
