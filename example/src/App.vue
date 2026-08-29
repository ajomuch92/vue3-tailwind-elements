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

/* Three states, the same three the library has: follow the OS, or force one.
   `null` is "follow", which is what the components do with no class at all. */
const theme = ref(localStorage.getItem('te-theme'));

const applyTheme = () => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme.value === 'dark');
  root.classList.toggle('light', theme.value === 'light');
  if (theme.value) localStorage.setItem('te-theme', theme.value);
  else localStorage.removeItem('te-theme');
};

const cycleTheme = () => {
  theme.value = theme.value === null ? 'dark' : theme.value === 'dark' ? 'light' : null;
  applyTheme();

const themeLabel = computed(() => ({ dark: '🌙 Dark', light: '☀️ Light' }[theme.value] ?? '💻 System'));
};

applyTheme();

const themeLabel = computed(() => ({ dark: '🌙 Dark', light: '☀️ Light' }[theme.value] ?? '💻 System'));

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
  <div class="te-surface te-text-soft flex h-screen flex-col md:flex-row">
    <header class="te-surface te-border flex items-center gap-3 border-b p-3 md:hidden">
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
      <button type="button" class="btn light small ml-auto" @click="cycleTheme">{{ themeLabel }}</button>
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
      class="te-sunken te-border fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r p-3
             transition-transform duration-200
             md:visible md:static md:w-56 md:translate-x-0"
      :class="menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'"
    >
      <a
        href="#"
        class="te-hover-strong mb-3 block rounded px-2 py-1 text-sm font-semibold"
        :class="current ? '' : 'bg-blue-500 text-white hover:bg-blue-500'"
        @click="menuOpen = false"
      >Home</a>

      <div class="mb-3 hidden md:block">
        <button type="button" class="btn light small w-full" @click="cycleTheme">{{ themeLabel }}</button>
      </div>

      <h1 class="te-text-faint mb-1 px-2 text-xs font-bold uppercase tracking-wide">Components</h1>
      <a
        v-for="item in stories"
        :key="item.slug"
        :href="`#${item.slug}`"
        class="te-hover-strong block rounded px-2 py-1 text-sm capitalize"
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
