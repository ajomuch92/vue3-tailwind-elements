import { computed, inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';

export interface FieldContext {
  /** The id te-field's `<label for>` points at, for the control to carry. */
  id: ComputedRef<string>;
  /** id of the helper or error line, for the control's `aria-describedby`. */
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('te-field');

export const provideField = (context: FieldContext) => provide(fieldKey, context);

/**
 * The te-field wrapping this control, when there is one. Every field still
 * works on its own, so each value falls back to "nothing around me" rather
 * than requiring the wrapper.
 */
export function useField() {
  const field = inject(fieldKey, null);
  return {
    fieldId: computed(() => field?.id.value),
    fieldDescribedBy: computed(() => field?.describedBy.value),
    fieldInvalid: computed(() => field?.invalid.value ?? false),
  };
}
