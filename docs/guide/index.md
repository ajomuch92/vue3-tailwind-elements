# Getting started

Vue Tailwind Elements is a component library for **Vue 3.5+** and **Tailwind CSS v4**.

## Install

```bash
npm install vue3-tailwind-elements
```

`vue` and `tailwindcss` are peer dependencies, so the library always uses the
copies your app already has.

## Register the plugin

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import Vue3TailwindElements from 'vue3-tailwind-elements';
import 'vue3-tailwind-elements/style.css';
import './style.css';

createApp(App)
  .use(Vue3TailwindElements)
  .mount('#app');
```

## Add the stylesheet

```css
/* style.css */
@import "tailwindcss";
@import "vue3-tailwind-elements/css";
```

That is the whole setup. The library stylesheet declares its own `@source`, so
Tailwind finds the classes the components use without a `content` array, and
`tailwind.config.js` is not needed at all.

::: tip Using Vite
Install `@tailwindcss/vite` and add it to your plugins — that is the only build
step Tailwind v4 needs.

```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
});
```
:::

## Use the components

Every component is registered globally by the plugin:

```vue
<template>
  <te-button type="primary" @click="save">Save</te-button>
</template>
```

<Demo>
  <te-button type="primary">Save</te-button>
</Demo>

## Importing components directly

If you would rather not register everything globally, import what you need:

```ts
import { TeButton, TeDatePicker } from 'vue3-tailwind-elements';
import type { Variant, Size } from 'vue3-tailwind-elements';
```

Registering the plugin is still required for the `v-click-outside` directive
and for the icon options.

## TypeScript

Types are bundled. Because the package augments Vue's `GlobalComponents`
interface, props on globally registered components are checked in templates
with no extra setup:

```vue
<!-- Type error: "hugee" is not a valid Size -->
<te-button size="hugee">Save</te-button>
```

## Requirements

| | |
|---|---|
| Vue | `^3.5.0` |
| Tailwind CSS | `^4.0.0` |
| Node (build time) | `^20.19.0 \|\| >=22.12.0` |
