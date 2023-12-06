import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    '@': fileURLToPath(new URL('./src/game', import.meta.url))
  },
  plugins: [vue()],
})
