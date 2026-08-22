/* Renders the home page and every story once. Catches a bad prop, a bad slot
   or a template that references something the story never exposed. */
import { readdirSync } from 'node:fs';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const plugin = (await vite.ssrLoadModule('vue3-tailwind-elements')).default;
const Story = (await vite.ssrLoadModule('/src/Story.vue')).default;
const Home = (await vite.ssrLoadModule('/src/Home.vue')).default;

let failed = 0;
const pages = readdirSync('./src/stories').sort();

const render = async (label, vnode) => {
  const app = createSSRApp({ render: () => vnode });
  app.use(plugin);
  app.config.warnHandler = (msg) => { throw new Error(msg); };
  await renderToString(app);
  console.log(`ok   ${label}`);
};

try {
  await render('home', h(Home, { stories: pages.map((f) => ({ slug: f.replace(/\.js$/, ''), title: f })) }));
} catch (error) {
  failed++;
  console.error(`FAIL home: ${error.message.split('\n')[0]}`);
}

for (const file of pages) {
  const name = file.replace(/\.js$/, '');
  try {
    const { default: story } = await vite.ssrLoadModule(`/src/stories/${file}`);
    await render(name, h(Story, { name, story }));
  } catch (error) {
    failed++;
    console.error(`FAIL ${name}: ${error.message.split('\n')[0]}`);
  }
}
await vite.close();
console.log(failed ? `\n${failed} page(s) failed` : '\nall pages render');
process.exit(failed ? 1 : 0);
