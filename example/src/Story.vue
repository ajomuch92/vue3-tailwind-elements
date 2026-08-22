<script setup>
import { computed, reactive, ref } from 'vue';

const props = defineProps({
  story: { type: Object, required: true },
  name: { type: String, required: true },
});

const tag = computed(() => props.story.tag ?? `te-${props.name}`);
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/* A control is declared by its default value: `false` → checkbox, `5` → number,
   `'hi'` → text, `{ options: [...] }` → select. */
const controls = Object.entries(props.story.props ?? {}).map(([key, raw]) => {
  const spec = raw !== null && typeof raw === 'object' ? raw : { value: raw };
  const value = spec.value ?? (spec.options ? spec.options[0] : spec.value);
  return { key, options: spec.options, value, kind: spec.options ? 'select' : typeof value };
});

const state = reactive(Object.fromEntries(controls.map((c) => [c.key, c.value])));
const model = ref(props.story.model);
const hasModel = 'model' in props.story;

const attrs = computed(() => {
  const bound = controls.map((c) => {
    const value = state[c.key];
    if (value === false || value === '' || value === null || value === undefined) return '';
    if (value === true) return ` ${kebab(c.key)}`;
    if (typeof value === 'number') return ` :${kebab(c.key)}="${value}"`;
    return ` ${kebab(c.key)}="${value}"`;
  });
  const vModel = hasModel ? ` v-model${props.story.modelName ? `:${props.story.modelName}` : ''}="model"` : '';
  return vModel + bound.join('');
});

const code = computed(() =>
  props.story.template
    ? props.story.template(attrs.value)
    : props.story.slot
      ? `<${tag.value}${attrs.value}>${props.story.slot}</${tag.value}>`
      : `<${tag.value}${attrs.value} />`
);

/* Same string, compiled. `story.data` and `model` are exposed as refs, so the
   preview writes back to the panel below instead of owning its own copy. */
const preview = computed(() => ({
  setup: () => ({ model, setTimeout, ...(props.story.data ?? {}) }),
  template: `<div>${code.value}</div>`,
}));
</script>

<template>
  <div class="flex flex-col gap-6 xl:flex-row">
    <div class="min-w-0 flex-1 space-y-4">
      <div class="rounded-lg border border-gray-200 bg-white p-8">
        <component :is="preview" />
      </div>

      <pre class="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100"><code>{{ code }}</code></pre>
    </div>

    <aside class="w-full shrink-0 space-y-4 xl:w-72">
      <div v-if="controls.length" class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Props</h3>
        <div class="space-y-3">
          <label v-for="control in controls" :key="control.key" class="block text-sm">
            <span class="mb-1 block font-medium text-gray-600">{{ control.key }}</span>

            <select v-if="control.kind === 'select'" v-model="state[control.key]" class="w-full rounded border border-gray-300 px-2 py-1">
              <option v-for="option in control.options" :key="option" :value="option">{{ option }}</option>
            </select>

            <input v-else-if="control.kind === 'boolean'" v-model="state[control.key]" type="checkbox" class="h-4 w-4" />

            <input v-else-if="control.kind === 'number'" v-model.number="state[control.key]" type="number" class="w-full rounded border border-gray-300 px-2 py-1" />

            <input v-else v-model="state[control.key]" type="text" class="w-full rounded border border-gray-300 px-2 py-1" />
          </label>
        </div>
      </div>

      <div v-if="hasModel" class="rounded-lg border border-gray-200 p-4">
        <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">v-model</h3>
        <pre class="overflow-x-auto text-sm text-gray-600">{{ model ?? 'null' }}</pre>
      </div>

      <p v-if="story.note" class="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{{ story.note }}</p>
    </aside>
  </div>
</template>
