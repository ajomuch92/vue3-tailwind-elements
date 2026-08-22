<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Home from './Home.vue';
import Story from './Story.vue';

// Drop a .js file in ./stories and it shows up in the sidebar. No registry.
const modules = import.meta.glob('./stories/*.js', { eager: true });

const stories = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.slice('./stories/'.length, -'.js'.length);
    return { slug, story: mod.default, title: slug.replace(/-/g, ' ') };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const slug = ref(location.hash.slice(1));
const onHash = () => { slug.value = location.hash.slice(1); };
onMounted(() => addEventListener('hashchange', onHash));
onUnmounted(() => removeEventListener('hashchange', onHash));

// No hash — or one that matches nothing — lands on the home page.
const current = computed(() => stories.find((s) => s.slug === slug.value));
</script>

<template>
  <div class="flex h-screen text-gray-800">
    <nav class="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3">
      <a
        href="#"
        class="mb-3 block rounded px-2 py-1 text-sm font-semibold hover:bg-gray-200"
        :class="current ? '' : 'bg-blue-500 text-white hover:bg-blue-500'"
      >Home</a>

      <h1 class="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-gray-400">Components</h1>
      <a
        v-for="item in stories"
        :key="item.slug"
        :href="`#${item.slug}`"
        class="block rounded px-2 py-1 text-sm capitalize hover:bg-gray-200"
        :class="item.slug === current?.slug ? 'bg-blue-500 text-white hover:bg-blue-500' : ''"
      >{{ item.title }}</a>
    </nav>

    <main class="flex-1 overflow-y-auto p-8">
      <template v-if="current">
        <h2 class="mb-6 text-2xl font-semibold capitalize">{{ current.title }}</h2>
        <Story :key="current.slug" :name="current.slug" :story="current.story" />
      </template>
      <Home v-else :stories="stories" />
    </main>
  </div>
</template>
