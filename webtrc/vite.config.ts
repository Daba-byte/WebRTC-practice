import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
    proxy: {
      '/api': {
        target: 'https://localhost:4443',
        changeOrigin: true,
        secure: false, // SSL 인증서 오류 무시 (로컬 개발 환경에서만 사용)
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
})