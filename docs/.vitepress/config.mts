import { readdirSync } from 'node:fs';
import { defineConfig } from 'vitepress';
import tailwindcss from '@tailwindcss/vite';

const titleCase = (file: string) =>
  file.replace(/\.md$/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

const pages = (dir: string) =>
  readdirSync(new URL(`../${dir}`, import.meta.url))
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .map((f) => ({ text: titleCase(f), link: `/${dir}/${f.replace(/\.md$/, '')}` }));

export default defineConfig({
  title: 'Vue Tailwind Elements',
  description: 'Components for Vue 3 and Tailwind v4',
  cleanUrls: true,
  vite: { plugins: [tailwindcss()] },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/button' },
    ],
    sidebar: {
      '/guide/': [{ text: 'Guide', items: [{ text: 'Getting started', link: '/guide/' }, ...pages('guide')] }],
      '/components/': [{ text: 'Components', items: pages('components') }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/ajomuch92/vue3-tailwind-elements' }],
    search: { provider: 'local' },
  },
});
