// Fails the docs build when a page uses a component the installed library does
// not register.
//
// The docs install vue3-tailwind-elements from npm rather than from this
// checkout, and VitePress renders an unresolved component as *nothing* instead
// of failing. That combination already shipped a documentation site whose
// modals, tooltips and every other component after `te-loading` were silently
// missing, because the lockfile still pinned 1.0.0. A build that cannot render
// a page should say so rather than deploy a blank one.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const { default: install } = await import('vue3-tailwind-elements');

/* The plugin registers by calling app.component(name, …); collect the names it
   asks for rather than reaching into the bundle's internals. */
const registered = new Set();
install({ component: (name) => registered.add(name), directive: () => {} });

const used = new Map();
for (const dir of ['components', 'guide']) {
  for (const file of readdirSync(join(here, dir)).filter((f) => f.endsWith('.md'))) {
    const path = join(dir, file);
    const markdown = readFileSync(join(here, path), 'utf8')
      // Fenced examples are printed, never rendered.
      .replace(/```[\s\S]*?```/g, '');
    for (const [, tag] of markdown.matchAll(/<(te-[a-z-]+)[\s/>]/g)) {
      if (!used.has(tag)) used.set(tag, path);
    }
  }
}

const missing = [...used].filter(([tag]) => !registered.has(tag));
if (missing.length) {
  const { version } = JSON.parse(
    readFileSync(join(here, 'node_modules/vue3-tailwind-elements/package.json'), 'utf8')
  );
  console.error(`\nvue3-tailwind-elements ${version} is installed here and does not register:\n`);
  for (const [tag, path] of missing) console.error(`  ${tag.padEnd(20)} used in docs/${path}`);
  console.error(
    '\nThose pages would build and deploy empty. Publish the release first, then'
    + '\nrun `npm install` in docs/ to pick it up.\n'
  );
  process.exit(1);
}

console.log(`docs: all ${used.size} components used in the pages are registered by the installed library.`);
