<script setup>
import pkg from '../../package.json';

defineProps({ stories: { type: Array, required: true } });

const repo = pkg.repository.url.replace(/\.git$/, '');

const install = 'npm install vue3-tailwind-elements';

const setup = `// main.js
import { createApp } from 'vue';
import Vue3TailwindElements from 'vue3-tailwind-elements';
import './style.css';

createApp(App).use(Vue3TailwindElements).mount('#app');`;

const styles = `/* style.css */
@import "tailwindcss";
@import "vue3-tailwind-elements/css";`;
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-3xl font-bold">{{ pkg.name }}</h1>
        <te-badge type="primary" :text="`v${pkg.version}`" rounded />
      </div>
      <p class="max-w-2xl text-gray-600">
        {{ stories.length }} components for Vue 3 and Tailwind CSS v4. Pick one on the left to
        play with its props and read the exact code that renders it.
      </p>
      <div class="flex flex-wrap gap-2">
        <a :href="pkg.homepage" target="_blank" rel="noreferrer" class="btn primary medium">Documentation</a>
        <a :href="repo" target="_blank" rel="noreferrer" class="btn dark medium outlined">GitHub</a>
      </div>
    </header>

    <section class="grid gap-6 lg:grid-cols-3">
      <div>
        <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">1. Install</h2>
        <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"><code>{{ install }}</code></pre>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">2. Register</h2>
        <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"><code>{{ setup }}</code></pre>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">3. Import the styles</h2>
        <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"><code>{{ styles }}</code></pre>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-gray-400">Components</h2>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <a
          v-for="item in stories"
          :key="item.slug"
          :href="`#${item.slug}`"
          class="rounded-lg border border-gray-200 px-3 py-2 text-sm capitalize hover:border-blue-400 hover:bg-blue-50"
        >{{ item.title }}</a>
      </div>
    </section>

    <p class="border-t border-gray-200 pt-6 text-sm text-gray-500">
      This playground runs the components from <code class="rounded bg-gray-100 px-1">../src</code>,
      not the published package — what you see is the working tree.
    </p>
  </div>
</template>
