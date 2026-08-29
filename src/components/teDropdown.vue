<template>
  <div class="dropdown relative inline-block">
    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      class="dropdown-toggle btn"
      :class="[type, size]"
      :disabled="disabled"
      :aria-expanded="model"
      :popovertarget="panelId"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger">{{ label }}</slot>
    </button>

    <div
      :id="panelId"
      ref="panelRef"
      popover
      class="dropdown-menu"
      :aria-labelledby="triggerId"
      @toggle="onToggle"
      @click="onPanelClick"
      @keydown="onPanelKeydown"
    >
      <slot>
        <button
          v-for="(item, index) in normalizedItems"
          :key="index"
          type="button"
          class="dropdown-item"
          :disabled="item.disabled"
          @click="emit('select', item, index)"
        >
          {{ item.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import type { PropType } from 'vue';
import { SIZES, VARIANTS, oneOf } from '../types';
import { stepIndex } from '../composables/keyboard';
import type { DropdownItem } from '../types';

defineOptions({ name: 'TeDropdown' });

const emit = defineEmits<{ select: [item: DropdownItem, index: number] }>();

const model = defineModel<boolean>({ default: false });

const props = defineProps({
  items: { type: Array as PropType<(DropdownItem | string)[]>, default: () => [] },
  label: { type: String, default: '' },
  align: { ...oneOf(['start', 'end'] as const), default: 'start' },
  type: { ...oneOf(VARIANTS), default: 'light' },
  size: { ...oneOf(SIZES), default: 'medium' },
  disabled: { type: Boolean, default: false },
  closeOnSelect: { type: Boolean, default: true },
});

/* Same shape as te-list-group: plain strings or objects, normalised once. */
const normalizedItems = computed<DropdownItem[]>(() =>
  props.items.map((item) => (typeof item === 'string' ? { label: item } : item))
);

const triggerId = useId();
const panelId = useId();
const triggerRef = ref<HTMLButtonElement>();
const panelRef = ref<HTMLElement>();

/* The panel is a native popover, so light dismiss (a click anywhere else),
   Escape, and the top layer — nothing clips it, no z-index to lose — are the
   browser's job rather than a v-click-outside plus a stack of listeners.
   `popovertarget` even opens it with no JS at all; everything below is only
   about where the panel lands. */

/* What the browser currently has open, so the model watcher and the toggle
   event cannot bounce off each other. */
let nativelyOpen = false;

const GAP = 4;

/* ponytail: hand-rolled placement. Replace the whole of place() with
   `position-anchor` + `position-area` in the stylesheet once CSS anchor
   positioning is Baseline across the supported browsers. */
function place() {
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger || !panel) return;

  const rect = trigger.getBoundingClientRect();
  const { offsetWidth: width, offsetHeight: height } = panel;

  /* Prefer below; flip up only when below overflows and above actually fits. */
  const fitsBelow = rect.bottom + GAP + height <= window.innerHeight;
  const fitsAbove = rect.top - GAP - height >= 0;
  const top = fitsBelow || !fitsAbove ? rect.bottom + GAP : rect.top - GAP - height;

  const wanted = props.align === 'end' ? rect.right - width : rect.left;
  const left = Math.max(GAP, Math.min(wanted, window.innerWidth - width - GAP));

  panel.style.top = `${top}px`;
  panel.style.left = `${left}px`;
  panel.style.minWidth = `${rect.width}px`;
}

/* A popover is positioned against the viewport, so it has to follow the
   trigger while the page moves under it. Capture catches scrolling in any
   ancestor, not just the document. */
function watchViewport(on: boolean) {
  const method = on ? 'addEventListener' : 'removeEventListener';
  window[method]('scroll', place, true);
  window[method]('resize', place);
}

function onToggle(event: Event) {
  nativelyOpen = (event as Event & { newState: string }).newState === 'open';
  model.value = nativelyOpen;
  watchViewport(nativelyOpen);
  if (nativelyOpen) {
    place();
    if (focusOnOpen) focusItem(focusOnOpen === 1 ? 0 : items().length - 1);
  }
  focusOnOpen = 0;
}

/* Every item a menu can move to, slot content included — the default items are
   buttons, but the panel takes whatever the caller renders. */
function items() {
  const selector = 'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';
  return [...(panelRef.value?.querySelectorAll<HTMLElement>(selector) ?? [])];
}

const focusItem = (index: number) => items()[index]?.focus();

/* Which end to land on when the menu opens from the keyboard. A mouse click
   leaves focus where it is: pulling it into the menu would be a surprise. */
let focusOnOpen: 0 | 1 | -1 = 0;

function onTriggerClick(event: MouseEvent) {
  /* `popovertarget` opens the panel by itself, and Enter or Space on a button
     arrives here as a click with no pointer behind it — detail 0. */
  if (event.detail === 0) focusOnOpen = 1;
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const step = event.key === 'ArrowDown' ? 1 : -1;
  if (model.value) focusItem(step === 1 ? 0 : items().length - 1);
  else {
    focusOnOpen = step;
    model.value = true;
  }
}

function onPanelKeydown(event: KeyboardEvent) {
  const list = items();
  if (list.length === 0) return;
  const current = list.indexOf(document.activeElement as HTMLElement);

  let target: number | undefined;
  if (event.key === 'ArrowDown') target = current === -1 ? 0 : stepIndex(current, 1, list.length);
  else if (event.key === 'ArrowUp') target = current === -1 ? list.length - 1 : stepIndex(current, -1, list.length);
  else if (event.key === 'Home') target = 0;
  else if (event.key === 'End') target = list.length - 1;
  else if (event.key === 'Tab') {
    /* Tabbing away closes the menu, the way a menu button is expected to
       behave — a popover on its own would stay open behind the focus. */
    panelRef.value?.hidePopover();
    return;
  }
  if (target === undefined) return;

  event.preventDefault();
  list[target]?.focus();
}

function onPanelClick(event: MouseEvent) {
  if (!props.closeOnSelect) return;
  /* Only a real command closes the menu — not a click on the panel's own
     padding, and not one on a disabled item. */
  const hit = (event.target as HTMLElement | null)?.closest('button, a');
  if (hit && !(hit as HTMLButtonElement).disabled) panelRef.value?.hidePopover();
}

watch(model, (open) => {
  const panel = panelRef.value;
  /* No popover support (or no DOM yet) means no programmatic control; the
     `popovertarget` button is still the primary way in. */
  if (!panel?.isConnected || typeof panel.showPopover !== 'function') return;
  if (open === nativelyOpen) return;
  if (open) panel.showPopover();
  else panel.hidePopover();
}, { flush: 'post' });

onBeforeUnmount(() => watchViewport(false));
</script>
