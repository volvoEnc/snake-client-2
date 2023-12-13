import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    '@': fileURLToPath(new URL('./src/game', import.meta.url)),
  },
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    origin: 'http://212.220.200.39',
  },
  build: {
    rollupOptions: {
      plugins: [
        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'true'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          'typeof FEATURE_SOUND': "'true'",
        }),
      ],
    },
  },
});
