import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7109',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
