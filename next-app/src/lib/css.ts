import type { CSSProperties } from 'react';

/**
 * Inline styles for values a CSSProperties object cannot express.
 *
 * The legacy markup carries motion parameters as inline custom properties —
 * `style="--d:.12s"` for the reveal stagger, `style="--i:7"` for the plate
 * cascade — and TypeScript's CSSProperties is a closed type with no index
 * signature, so a bare object literal fails to compile.
 *
 * The correct response is this helper, never deleting the property: without
 * `--d` the staggered sections all fade in as one block, and without `--i` the
 * 42 plate cells lose their diagonal.
 */
export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function css(decls: Vars): CSSProperties {
  return decls;
}
