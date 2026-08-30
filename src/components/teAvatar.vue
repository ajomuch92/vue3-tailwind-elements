<template>
  <span
    class="avatar"
    :class="[type, size, { square }]"
    :role="named && !showsImage ? 'img' : undefined"
    :aria-label="named && !showsImage ? (alt || name) : undefined"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <img
      v-if="showsImage"
      class="avatar-image"
      :src="src"
      :alt="alt || name"
      @error="failed = true"
    />
    <slot v-else :initials="initials">
      <span v-if="initials" class="avatar-initials" aria-hidden="true">{{ initials }}</span>
      <svg v-else class="avatar-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 9c-2.67 0-8 1.34-8 4v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.66-5.33-4-8-4Z" />
      </svg>
    </slot>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import { oneOf, SIZES, VARIANTS } from '../types';

defineOptions({ name: 'TeAvatar' });

const slots = useSlots();

const props = defineProps({
  /** Image URL. Falls back to the initials, and then to the icon, if it fails to load. */
  src: { type: String, default: '' },
  /** Whose avatar this is. Drawn as initials when there is no image, and read out either way. */
  name: { type: String, default: '' },
  /** Overrides what a screen reader hears; defaults to `name`. */
  alt: { type: String, default: '' },
  /* 'light' would put white initials on a pale grey; 'normal' is the
     neutral that stays readable. */
  type: { ...oneOf(VARIANTS), default: 'normal' },
  size: { ...oneOf(SIZES), default: 'medium' },
  /** Rounded square instead of a circle. */
  square: { type: Boolean, default: false },
});

/* A broken URL is the common case for an avatar — a deleted upload, a
   hot-linked profile picture — so it falls through to the initials rather than
   leaving the browser's broken-image glyph. */
const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });

const showsImage = computed(() => !!props.src && !failed.value);

const named = computed(() => !!(props.alt || props.name));

/* Nobody to name: what is left is the generic icon, which says nothing a
   screen reader can use. An unnamed `role="img"` is worse than no role at all,
   so the whole thing steps out of the accessibility tree — unless the caller
   put something of their own in the slot, which is theirs to describe. */
const decorative = computed(() => !showsImage.value && !named.value && !slots.default);

/* First letter of the first two words: "Ada Lovelace" is AL. Array.from, not
   [0], so an emoji or a surrogate pair is not cut in half. */
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0].toUpperCase())
    .join('')
);
</script>
