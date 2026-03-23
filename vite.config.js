import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    allowedHosts: ['5f92c366.r40.cpolar.top', 'localhost']
  }
})
