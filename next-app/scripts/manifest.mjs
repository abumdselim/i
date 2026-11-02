/**
 * The bridge between the typed route manifest and the tooling outside the bundler.
 *
 * `src/lib/content/pages.ts` is the only source of route data. The capture and
 * asset-sync scripts import PAGES from here; the Python gate and the reference
 * freezer ask for it with `--json`, since they cannot read TypeScript. Keeping one
 * accessor means a route is added in one place and every checker sees it.
 */
import { PAGES } from '../src/lib/content/pages.ts';

export { PAGES };

const invokedDirectly = (process.argv[1] ?? '').endsWith('manifest.mjs');
if (invokedDirectly && process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify({ pages: PAGES }));
}
