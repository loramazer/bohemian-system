import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    proxy: {
      // Redireciona qualquer requisição que comece com /api para o seu backend
      '/api': {
        target: 'http://localhost:3000', // O endereço do seu backend
        changeOrigin: true, // Necessário para evitar erros de CORS
      },
    },
  },
  })
