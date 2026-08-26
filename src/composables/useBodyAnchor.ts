import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Fixed-position style tracking `anchor`'s box, for panels teleported to <body>.
 * Teleporting escapes `overflow: hidden` / stacking contexts, but also drops the
 * panel out of the anchor's containing block — so it has to be positioned by hand.
 */
export function useBodyAnchor(anchor: Ref<HTMLElement | null>, open: Ref<boolean>, enabled: () => boolean) {
  const anchorStyle = ref<Record<string, string>>({});

  const update = () => {
    const el = anchor.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    anchorStyle.value = {
      position: 'fixed',
      top: `${rect.bottom}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      margin: '0',
    };
  };

  const listen = (on: boolean) => {
    if (typeof window === 'undefined') return;
    // capture: true so scrolling any ancestor container repositions too, not just the window
    if (on) {
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
    } else {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    }
  };

  watch(() => open.value && enabled(), (active) => {
    listen(active);
    if (active) update();
  });

  onBeforeUnmount(() => listen(false));

  return { anchorStyle, updateAnchor: update };
}

export default useBodyAnchor;
