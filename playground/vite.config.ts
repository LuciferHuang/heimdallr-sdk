import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import sourceMapUpload from '../packages/vite-plugin-sourcemap-upload/esm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), sourceMapUpload({
    appname: 'playground',
    url: `http://localhost:8001/sourcemap/upload`
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@heimdallr-sdk': resolve(__dirname, '../packages')
    }
  },
  build: {
    sourcemap: true
  }
})
