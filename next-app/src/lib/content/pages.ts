/**
 * The route manifest's TypeScript face (admin phase 1, docs/admin.md §6).
 *
 * The data lives in `data/pages.json`; `loader.ts` validates it and re-exports
 * `PAGES` from here. The types moved to `types.ts` beside the rest of the
 * content schema. Tooling outside the bundler (gate, capture, freezer) reads
 * the JSON through `scripts/manifest.mjs` — plain Node cannot import this
 * module's loader chain.
 */
export { PAGES } from './loader';
export type { PageEntry, PageKind } from './types';
