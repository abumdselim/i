/**
 * The bridge between the route manifest and the tooling outside the bundler.
 *
 * `data/pages.json` is the only source of route data (admin phase 1). The site
 * reads it through the validating loader in src/lib/content; plain Node cannot
 * import that module (its JSON import needs the bundler), so this bridge reads
 * the file directly and re-checks the minimal shape the tools rely on — the
 * full schema runs in every site build. Keeping one accessor means a route is
 * added in one place and every checker sees it.
 */
import { readFileSync } from 'node:fs';

const PAGES = JSON.parse(readFileSync(new URL('../data/pages.json', import.meta.url), 'utf8'));

if (
  !Array.isArray(PAGES) ||
  !PAGES.every(
    (page) =>
      page && typeof page === 'object' &&
      typeof page.route === 'string' &&
      typeof page.file === 'string' &&
      typeof page.title === 'string',
  )
) {
  console.error('manifest: data/pages.json is not a valid page list');
  process.exit(1);
}

export { PAGES };

const invokedDirectly = (process.argv[1] ?? '').endsWith('manifest.mjs');
if (invokedDirectly && process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify({ pages: PAGES }));
}
