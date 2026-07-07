import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@yugioh': path.resolve(rootDir, 'games/yugioh/frontend/src'),
      '@pokemon': path.resolve(rootDir, 'games/pokemon/frontend/src'),
    },
  },
  server: {
    port: 8090,
    proxy: {
      '/api/yugioh': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/yugioh/, ''),
      },
      '/api/pokemon': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/pokemon/, ''),
      },
    },
  },
})
