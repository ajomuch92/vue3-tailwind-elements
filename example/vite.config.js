import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const src = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // The library name points straight at ../src, so the playground runs the
      // real source with HMR — no `npm run build`, no `file:..`, no stale dist.
      'vue3-tailwind-elements/css': src('../src/plugin/index.css'),
      'vue3-tailwind-elements/types': src('../src/types.ts'),
      'vue3-tailwind-elements': src('../src/index.ts'),
      // Full build = runtime template compiler, so a story's code string is
      // compiled and rendered as-is. What you read is what you see.
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
});
