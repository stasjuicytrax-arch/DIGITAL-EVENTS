import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages отдаёт сайт из подпапки /DIGITAL-EVENTS/ (BASE_PATH задаётся в .github/workflows/deploy.yml)
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  ssgOptions: {
    dirStyle: 'nested',
    // маршрут «*» рендерим как /404 — scripts/fallback-404.mjs превращает его в dist/404.html для GitHub Pages
    includedRoutes: (paths) => [...paths, '/404'],
  },
})
