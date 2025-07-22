import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://framework-daniel-devel.stage.e-ol.nl',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api/messaging/v1.0')
      }
    }
  }
})

