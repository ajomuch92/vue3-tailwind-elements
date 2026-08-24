# Playground

A Storybook-shaped playground with no Storybook. Runs the components straight
from `../src` — Vite aliases `vue3-tailwind-elements` to the source, so there is
no `npm run build` in the library and no stale `dist`. Edit a component and the
page hot-reloads.

```bash
npm install
npm run dev      # localhost:5173
npm run check    # SSR-renders the home page and every story; fails on a broken prop or slot
npm run deploy   # build + publish to Cloudflare Pages
```

## Deploying

`npm run deploy` builds to `dist/` and publishes it with Wrangler, the same way
`docs/` does:

```bash
wrangler pages deploy dist --project-name=vue3-tailwind-elements-playground
```

First time on a new machine, authenticate once with `npx wrangler login`. The
project is created on first deploy if it does not exist. Routing is hash-based
(`/#button`), so the site is a single `index.html` and needs no `_redirects`
rule or SPA fallback.

## Adding a story

The layout is responsive: below `md` the component list collapses into a drawer
opened from the top bar, and the prop controls sit under the preview instead of
beside it.

One file per component in `src/stories/`. Drop a new `.js` in there and it shows
up in the sidebar and on the home page — there is no list to update. The
filename becomes the tag, so `button.js` renders `<te-button>`.

```js
export default {
  // Each prop's default value picks its control:
  //   false → checkbox   5 → number   'hi' → text   { options: [...] } → select
  props: {
    type: { options: VARIANTS, value: 'primary' },
    rounded: false,
  },
  slot: 'Click me',           // inner content, for the default template
  model: 0,                   // adds v-model and shows the live value
  modelName: 'visible',       // for v-model:visible
  data: { items: [...] },     // extra bindings the template can reference
  template: (attrs) => `...`, // full control when the default won't do
  note: 'Shown in the sidebar.',
};
```

The code panel is not generated *alongside* the preview — it **is** the preview.
Vite aliases `vue` to the full build, so that exact string is compiled and
rendered. The two cannot drift.
