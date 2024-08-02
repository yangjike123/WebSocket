import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    open: true, // 自动打开
    port: 8080, // 端口号
  },
  plugins: [react()],
})
