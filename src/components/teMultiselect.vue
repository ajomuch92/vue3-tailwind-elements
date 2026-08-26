<template>
  <div ref="wrapper" class="multiselect-wrapper relative cursor-pointer inline-block" :class="{'opacity-50': disabled}" v-click-outside="outsideOptions" :style="varCss">
    <input
      type="text"
      readonly
      :placeholder="placeholder"
      :value="textValue"
      :disabled="disabled"
      class="pl-1 bg-clip-padding border border-solid border-gray-300 h-10 cursor-pointer transition ease-in-out duration-200 outline-none"
      :class="{'rounded-md': !open, 'rounded-tl-md rounded-tr-md': open, 'bg-white': !disabled, 'bg-gray-200 cursor-not-allowed': disabled, 'pr-10': clearable&&textValue, 'pr-6': !clearable}"
      @click="open=!open"
    />
    <span class="icon absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
      <button v-if="clearable&&textValue" class="clear h-4 w-4" :class="{'cursor-not-allowed': disabled}" :disabled="disabled" @click="clear">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-5 w-5 transition ease-in-out duration-200"
          :class="{'transform rotate-180': open}">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd" />
        </svg>
    </span>
    <Teleport to="body" :disabled="!appendToBody">
      <transition name="zoom">
        <div
          v-show="open"
          ref="dropdown"
          class="absolute z-50 border border-gray-300 shadow-sm w-full bg-white"
          :style="appendToBody ? { ...varCss, ...anchorStyle } : undefined">
          <div v-if="searchable" class="search p-2">
            <input v-model="search" type="search" class="border border-gray-100 w-full h-8 outline-none px-2" :placeholder="placeholderSearch" />
          </div>
          <div class="list-container flex flex-col px-2">
            <template v-if="singleSelect">
              <div v-for="(option, key) in filteredOptions"
                :key="key"
                class="hover:bg-gray-100 rounded-md px-1 py-2 cursor-pointer"
                :class="{'bg-blue-500 text-white hover:bg-blue-600': optionValue(option) === model}"
                @click="selectSingleValue(optionValue(option))"
              >
                <slot name="item" v-bind="{option, key}">
                  {{ option[displayField] }}
                </slot>
              </div>
            </template>
            <template v-else>
              <te-checkbox v-if="showSelectAll&&search.length===0" v-model="selectAll" class="py-2 px-1 cursor-pointer rounded-md hover:bg-gray-100">
                Select all
              </te-checkbox>
              <te-checkbox v-for="(option, key) in filteredOptions" :key="key" v-model="checkedValues" :native-value="optionValue(option)" class="py-2 px-1 cursor-pointer rounded-md hover:bg-gray-100">
                <slot name="item" v-bind="{option, key}">
                  {{ option[displayField] }}
                </slot>
              </te-checkbox>
            </template>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
/* Was './directives/v-outside' — relative to src/components/, a path that
   does not exist. The directive lives in src/directives. */
import { clickOutside as vClickOutside } from '../directives';
import { useBodyAnchor } from '../composables/useBodyAnchor';
import teCheckbox from './teCheckbox.vue';

defineOptions({ name: 'TeMultiselect' });

type OptionValue = string | number;
type Option = Record<string, unknown>;

const model = defineModel<OptionValue | OptionValue[] | undefined>({ default: undefined });

const props = defineProps({
  singleSelect: { type: Boolean, default: false },
  options: { type: Array as PropType<Option[]>, default: () => [] },
  displayField: { type: String, default: 'text' },
  valueField: { type: String, default: 'value' },
  placeholder: { type: String, default: '' },
  searchable: { type: Boolean, default: true },
  visibleItems: { type: Number, default: 3, validator: (v: unknown) => typeof v === 'number' && v > 0 },
  placeholderSearch: { type: String, default: 'Search...' },
  disabled: { type: Boolean, default: false },
  showSelectAll: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  minWidth: { type: [String, Number], default: '250px' },
  listHeight: { type: [String, Number], default: '250px' },
  appendToBody: { type: Boolean, default: false },
});

const open = ref(false);
const search = ref('');
const wrapper = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const { anchorStyle } = useBodyAnchor(wrapper, open, () => props.appendToBody);

/* Teleported, the list is no longer inside the wrapper, so a click on it would
   read as an outside click. Swallow those explicitly. */
const outsideOptions = {
  handler: () => { open.value = false; },
  middleware: (event: MouseEvent) => !dropdown.value?.contains(event.target as Node),
};

const selection = computed<OptionValue[]>(() =>
  Array.isArray(model.value) ? model.value : model.value === undefined ? [] : [model.value]
);

const selectAll = computed({
  get: () => props.options.length > 0 && selection.value.length === props.options.length,
  set: (value: boolean) => {
    model.value = value ? props.options.map(optionValue) : [];
  },
});

const textValue = computed(() => {
  if (props.singleSelect) {
    const match = props.options.find((o) => o[props.valueField] === model.value);
    return match ? String(match[props.displayField] ?? '') : '';
  }
  const labels = props.options
    .filter((o) => selection.value.includes(o[props.valueField] as OptionValue))
    .map((o) => String(o[props.displayField] ?? ''));
  if (labels.length > props.visibleItems) return `${labels.length} options selected`;
  /* Intl.ListFormat is not in every runtime (and not in SSR by default), so
     fall back to a plain join rather than throwing. */
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  try {
    return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(labels);
  } catch {
    return labels.join(', ');
  }
});

const filteredOptions = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return props.options;
  return props.options.filter((o) => String(o[props.displayField] ?? '').toLowerCase().includes(term));
});

const optionValue = (option: Option) => option[props.valueField] as OptionValue;

/** te-checkbox groups bind an array; the model may also hold a single value. */
const checkedValues = computed({
  get: () => selection.value,
  set: (value: OptionValue[]) => { model.value = value; },
});

const size = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

const varCss = computed(() => ({
  '--min-width': size(props.minWidth),
  '--height': size(props.listHeight),
}));

function selectSingleValue(newValue: OptionValue) {
  model.value = newValue;
  open.value = false;
}

function clear() {
  model.value = props.singleSelect ? undefined : [];
  open.value = true;
}

watch(() => props.singleSelect, (single) => {
  model.value = single ? undefined : [];
});
</script>

<style scoped>
  .multiselect-wrapper, input[type="text"] {
    min-width: var(--min-width);
  }
  
  .zoom-enter-active,
  .zoom-leave-active {
    transition: all 100ms ease;
  }

  .zoom-enter-from,
  .zoom-leave-to {
    transform: scale(0.5);
    opacity: 0;
  }

  .list-container {
    overflow-y: scroll;
    height: var(--height);
  }
</style>