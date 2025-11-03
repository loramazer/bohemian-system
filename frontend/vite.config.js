import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true, 
        secure: false, 
      },
    },
    host: true, 
    hmr: {
      host: 'denis-unwelcoming-candida.ngrok-free.dev',
      protocol: 'wss',
    },
    allowedHosts: ['denis-unwelcoming-candida.ngrok-free.dev'], 
  } // Esta é a chave '}' que fecha o 'server'
}) // Este é o '})' que fecha o 'defineConfig'