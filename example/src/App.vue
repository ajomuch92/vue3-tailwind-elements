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
const menuOpen = ref(false);

// Navigating closes the drawer, so every link doubles as its dismiss button.
const onHash = () => {
  slug.value = location.hash.slice(1);
  menuOpen.value = false;
};
const onKey = (event) => { if (event.key === 'Escape') menuOpen.value = false; };

onMounted(() => {
  addEventListener('hashchange', onHash);
  addEventListener('keydown', onKey);
});
onUnmounted(() => {
  removeEventListener('hashchange', onHash);
  removeEventListener('keydown', onKey);
});

// No hash — or one that matches nothing — lands on the home page.
const current = computed(() => stories.find((s) => s.slug === slug.value));
</script>

<template>
  <div class="flex h-screen flex-col text-gray-800 md:flex-row">
    <header class="flex items-center gap-3 border-b border-gray-200 bg-white p-3 md:hidden">
      <button
        type="button"
        class="btn light small"
        aria-controls="playground-nav"
        :aria-expanded="menuOpen"
        @click="menuOpen = true"
      >
        <span aria-hidden="true">☰</span>
        <span class="sr-only">Open the component list</span>
      </button>
      <span class="truncate font-semibold capitalize">{{ current?.title ?? 'Playground' }}</span>
    </header>

    <div
      v-if="menuOpen"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      @click="menuOpen = false"
    ></div>

    <!-- `invisible` rather than a bare translate: an off-screen drawer that
         keeps its links tabbable drops a keyboard user into a menu they cannot
         see. Visibility is also what makes it inert without a JS media query. -->
    <nav
      id="playground-nav"
      class="fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3
             transition-transform duration-200
             md:visible md:static md:w-56 md:translate-x-0"
      :class="menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'"
    >
      <a
        href="#"
        class="mb-3 block rounded px-2 py-1 text-sm font-semibold hover:bg-gray-200"
        :class="current ? '' : 'bg-blue-500 text-white hover:bg-blue-500'"
        @click="menuOpen = false"
      >Home</a>

      <h1 class="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-gray-400">Components</h1>
      <a
        v-for="item in stories"
        :key="item.slug"
        :href="`#${item.slug}`"
        class="block rounded px-2 py-1 text-sm capitalize hover:bg-gray-200"
        :class="item.slug === current?.slug ? 'bg-blue-500 text-white hover:bg-blue-500' : ''"
        @click="menuOpen = false"
      >{{ item.title }}</a>
    </nav>

    <main class="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <template v-if="current">
        <h2 class="mb-6 hidden text-2xl font-semibold capitalize md:block">{{ current.title }}</h2>
        <Story :key="current.slug" :name="current.slug" :story="current.story" />
      </template>
      <Home v-else :stories="stories" />
    </main>
  </div>
</template>
