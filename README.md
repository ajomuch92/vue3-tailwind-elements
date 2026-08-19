# Vue Tailwind Elements
A light library of components based on [Tailwind Elements](https://tailwind-elements.com/) and [Tailwind](https://tailwindcss.com/) for Vuejs 3.
Requires **Vue 3.5+** and **Tailwind CSS v4**.
For Vuejs 2, refer to [this package](https://www.npmjs.com/package/vue-tailwind-elements).

### Components
`te-accordion` · `te-alert` · `te-badge` · `te-breadcrumb` · `te-button` ·
`te-button-group` · `te-card` · `te-checkbox` · `te-chip` · `te-date-picker` ·
`te-file` · `te-icon` · `te-input` · `te-list-group` · `te-loading` ·
`te-spinner`

Plus the `v-click-outside` directive. All of them are registered globally by
the plugin and can also be imported by name.
# Installation

1. Install Tailwind v4 following [this guide](https://tailwindcss.com/docs/installation/using-vite).

2. Install the package:
```bash
npm install vue3-tailwind-elements
```

3. Register the plugin in your `main.ts` (or `main.js`):

```ts
import { createApp } from 'vue';
import App from './App.vue';
import Vue3TailwindElements from 'vue3-tailwind-elements';
import 'vue3-tailwind-elements/style.css';
import './style.css';

createApp(App)
  .use(Vue3TailwindElements)
  .mount('#app');
```

4. Add one import to your stylesheet:

```css
@import "tailwindcss";
@import "vue3-tailwind-elements/css";
```

### Icons

`te-icon` renders [Bootstrap Icons](https://icons.getbootstrap.com/) class
names (`bi bi-*`) by default, so install the font if you use it:

```bash
npm install bootstrap-icons
```
```css
@import "bootstrap-icons/font/bootstrap-icons.css";
```

`social` icons are inline SVG and need no font. To use a different set, pass
`family` and register it when installing the plugin:

```ts
app.use(Vue3TailwindElements, {
  customIcons: {
    fa: { prefix: 'fa-', icons: { star: 'star' } },
  },
});
```

That is the whole setup. There is no `tailwind.config.js` and no `content`
array to maintain — the stylesheet carries its own `@source`, so Tailwind
finds the classes this library uses on its own.

## TypeScript

Types ship with the package. Global components are typed too, so
`<te-button type="primary">` is checked and autocompleted in templates with
no extra setup. Individual components can also be imported directly:

```ts
import { TeButton, TeDatePicker } from 'vue3-tailwind-elements';
import type { Variant, Size } from 'vue3-tailwind-elements';
```

## Upgrading from 0.0.x

1.0.0 requires Tailwind v4 and replaces the JavaScript plugin with a
stylesheet. In short:

```diff
  /* tailwind.config.js — usually deletable now */
- content: ['./node_modules/vue3-tailwind-elements/**/*.{js,ts,vue}'],
- plugins: [require('vue3-tailwind-elements/dist/plugin')],
```
```diff
  /* your stylesheet */
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
+ @import "vue3-tailwind-elements/css";
```
```diff
  /* main.ts */
- import 'vue3-tailwind-elements/dist/style.css';
+ import 'vue3-tailwind-elements/style.css';
```

`vue` and `tailwindcss` are peer dependencies now, and the bundled Bootstrap 5
stylesheet (`.modal`, `.offcanvas`, `.navbar`, `--bs-*`, …) has been removed.
See the [CHANGELOG](./CHANGELOG.md) for the full list of breaking changes and
fixes.

See an example [here](https://github.com/ajomuch92/vue3-tailwind-elements/tree/main/example) or documentation [here](https://vue-tailwind-elements.netlify.app/).

## Nuxt:
Put the plugin registration into a plugin file and use it in `nuxt.config.ts` like this:

```javascript
...
  plugins: [
    { src: '~/plugins/vue-tailwind-elements.js', mode: 'client' }
  ],
...

```

## Author

This library is created by [Aarón Montes](https://ajomuch92.site/ "Aarón Montes"). 
**Support me to improve and maintain this library**
<a href="https://www.buymeacoffee.com/ajomuch92" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Contribution

Want to contribute? Great!. Open a [new PR here](https://github.com/ajomuch92/vue3-tailwind-elements/pulls) or a [new issue here](https://github.com/ajomuch92/vue3-tailwind-elements/issues)

## License
MIT
