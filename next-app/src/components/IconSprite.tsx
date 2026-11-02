import { SPRITE } from './icons.generated';

/**
 * The 68 symbols, rendered once per document from the root layout.
 *
 * The layout sits outside every Suspense boundary and is not re-rendered on
 * client navigation, so exactly one copy reaches each page. Injecting it from
 * an effect (or from a per-page component) would duplicate the ids and let
 * <use> resolve against the wrong symbol.
 */
export function IconSprite() {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'contents' }}
      dangerouslySetInnerHTML={{ __html: SPRITE }}
    />
  );
}
