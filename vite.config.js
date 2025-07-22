import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiHost = env.VITE_API_HOST

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: `https://${apiHost}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/api/messaging/v1.0')
        }
      }
    }
  }
})