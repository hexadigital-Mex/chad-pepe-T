import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { chatHandler } from './server/chat.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'chat-api',
      configureServer(server) {
        server.middlewares.use('/api/chat', chatHandler)
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/chat', chatHandler)
      },
    },
  ],
})
