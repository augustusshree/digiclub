import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    devServer({
      entry: 'api/boot.ts',
      exclude: [/^\/(?!api\/)/],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@contracts': path.resolve(__dirname, './contracts'),
      '@db': path.resolve(__dirname, './db'),
    },
  },
  server: {
    port: 5173,
  },
})
