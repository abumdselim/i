import type { IconName } from './icons.generated';

/**
 * A typed wrapper around the inline sprite. `name` is a union of the 68 symbol
 * ids, so a typo is a compile error instead of an empty 20x20 box: a <use> that
 * points at a missing id renders nothing, logs nothing and 404s nothing.
 */
export function Icon({ name, className = 'icon' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}
