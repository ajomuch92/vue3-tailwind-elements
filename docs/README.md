# Documentation site

[VitePress](https://vitepress.dev/) site for `vue3-tailwind-elements`.

It installs the library **from npm**, exactly like a user would — it does not
build from `../src`. That means the docs always show what is actually
published, and a change to the library only shows up here after it is released
and `npm update vue3-tailwind-elements` is run.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> .vitepress/dist
npm run preview
```

## Deploying to Cloudflare

### Option A — connect the repository (recommended)

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
Git**, pick this repository, then set:

| Setting | Value |
|---|---|
| Framework preset | VitePress |
| Root directory | `docs` |
| Build command | `npm run build` |
| Build output directory | `.vitepress/dist` |
| Node version | `22` (set `NODE_VERSION=22` under environment variables) |

Every push to `main` then rebuilds and deploys. Because the root directory is
`docs`, Cloudflare runs `npm ci` there, so **commit `docs/package-lock.json`**.

### Option B — deploy from the CLI

```bash
npx wrangler login
npm run deploy
```

`npm run deploy` builds and then runs `wrangler pages deploy`. Change
`--project-name` in `package.json` if your Pages project is named differently.

## Notes

- `cleanUrls: true` is enabled, which Cloudflare Pages serves correctly out of
  the box — no `_redirects` file needed.
- Search is the built-in local provider, so there is nothing to configure and
  no third-party service involved.
