import type { PropType } from 'vue';

/** Shared literal unions. The arrays double as the runtime prop validators. */
export const SIZES = ['small', 'medium', 'large'] as const;
export type Size = (typeof SIZES)[number];

export const VARIANTS = ['normal', 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'pink', 'purple', 'light', 'dark'] as const;
export type Variant = (typeof VARIANTS)[number];

export const ALERT_TYPES = ['normal', 'primary', 'success', 'info', 'warning', 'danger'] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const BADGE_TYPES = ['normal', 'primary', 'success', 'info', 'warning', 'danger', 'pink', 'purple'] as const;
export type BadgeType = (typeof BADGE_TYPES)[number];

export const SPINNER_TYPES = ['normal', 'growing'] as const;
export type SpinnerType = (typeof SPINNER_TYPES)[number];

/** `type: oneOf(SIZES)` — runtime validator + compile-time union in one call. */
export function oneOf<T extends string>(values: readonly T[]) {
  return {
    type: String as unknown as PropType<T>,
    validator: (value: unknown) => values.includes(value as T),
  };
}

export interface CustomIconFamily {
  prefix: string;
  icons: Record<string, string>;
}

export interface TeOptions {
  customIcons?: Record<string, CustomIconFamily>;
}

export interface BreadcrumbOption {
  label: string;
  href?: string;
  to?: string | Record<string, unknown>;
}

export interface ListGroupItem {
  label?: string;
  name?: string;
  disabled?: boolean;
}
