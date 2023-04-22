import { defineConfig } from 'vite'
import { resolve } from 'path'
// import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'Vue3TailwindElements',
      fileName: 'vue3-tailwind-elements',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
