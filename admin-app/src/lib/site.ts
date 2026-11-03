import type {
  CapabilityContent,
  CaseStudiesData,
  ContentType,
  PageEntry,
  PlannedSection,
  ProductContent,
  SectionDefinition,
  SiteConfig,
  SpriteIcon,
} from './types';
import { CLOUD } from './mode';
import { githubStore } from './github-store';
import type { CommitFile, ContentStore, DataFile } from './store';

/**
 * Everything the studio knows about the site's content, on top of a
 * ContentStore. Local mode owns a checkout and writes `../next-app/data`
 * directly (FsStore, dynamically imported so the deployed worker never
 * bundles `node:fs`); cloud mode — the deployed studio (D-21) — commits
 * through the GitHub API and the repository is the database.
 *
 * Validation stays here, before the store sees anything: an invalid file
 * never reaches disk in local mode, and never becomes a commit in cloud
 * mode. Every file name is from this module's whitelist — nothing from a
 * request path or a form field is ever joined onto the data directory.
 */

let storePromise: Promise<ContentStore> | null = null;

function getStore(): Promise<ContentStore> {
  if (!storePromise) {
    storePromise = CLOUD
      ? Promise.resolve(githubStore)
      : import('./fs-store').then(({ fsStore }) => fsStore);
  }
  return storePromise;
}

async function readJson<T>(name: DataFile): Promise<T> {
  const store = await getStore();
  try {
    return JSON.parse(await store.readJsonText(name)) as T;
  } catch (error) {
    throw new Error(`studio: cannot read ${name} — ${(error as Error).message}`);
  }
}

/**
 * The one write path. Validation happens in `rules.ts` at the caller before
 * this runs; a save that spans two files (page meta + section arrangement)
 * is one call so cloud mode can make it one commit.
 */
export async function commitData(files: CommitFile[], message: string) {
  const store = await getStore();
  return store.commit(files, message);
}

/* ------------------------------------------------------------------- reads */

export function readPages(): Promise<PageEntry[]> {
  return readJson<PageEntry[]>('pages.json');
}

export function readSections(): Promise<SectionDefinition[]> {
  return readJson<SectionDefinition[]>('sections.json');
}

export function readConfig(): Promise<SiteConfig> {
  return readJson<SiteConfig>('site-config.json');
}

export function readCapabilities(): Promise<CapabilityContent[]> {
  return readJson<CapabilityContent[]>('capabilities.json');
}

export function readProducts(): Promise<ProductContent[]> {
  return readJson<ProductContent[]>('products.json');
}

export function readCaseStudies(): Promise<CaseStudiesData> {
  return readJson<CaseStudiesData>('case-studies.json');
}

export async function readContent(type: ContentType, slug: string): Promise<CapabilityContent | ProductContent> {
  const list = type === 'capability' ? await readCapabilities() : await readProducts();
  const found = list.find((entry) => entry.slug === slug);
  if (!found) throw new Error(`studio: no ${type} "${slug}"`);
  return found;
}

/* ------------------------------------------------------------------ writes */

export function writePages(pages: PageEntry[], message: string) {
  return commitData([{ file: 'pages.json', value: pages }], message);
}

export function writeConfig(config: SiteConfig, message: string) {
  return commitData([{ file: 'site-config.json', value: config }], message);
}

export async function writeContent(
  type: ContentType,
  slug: string,
  content: CapabilityContent | ProductContent,
) {
  const [file, list, label] =
    type === 'capability'
      ? (['capabilities.json', await readCapabilities(), `capability ${slug}`] as const)
      : (['products.json', await readProducts(), `product ${slug}`] as const);
  const index = list.findIndex((entry) => entry.slug === slug);
  if (index < 0) throw new Error(`studio: no ${type} "${slug}"`);
  list[index] = content as CapabilityContent & ProductContent;
  return commitData([{ file, value: list }], `studio: update ${label}`);
}

export function writeCaseStudies(data: CaseStudiesData, message: string) {
  return commitData([{ file: 'case-studies.json', value: data }], message);
}

/* --------------------------------------------------------------- selectors */

export function sectionsOf(sections: SectionDefinition[], route: string): SectionDefinition[] {
  return sections.filter((section) => section.page === route);
}

/**
 * The registry's render order for one route, with the config applied.
 *
 * Mirrors `next-app/src/lib/config.ts` exactly: locked sections keep their
 * registry place, movable ones follow `order` (ids the list does not mention
 * keep registry order after it), and `hidden` removes a section. The studio
 * shows this plan; the site renders this plan.
 */
export function sectionPlan(sections: SectionDefinition[], config: SiteConfig, route: string): PlannedSection[] {
  const defs = sectionsOf(sections, route);
  const hiddenIds = new Set(config.hidden.filter((entry) => entry.route === route).map((entry) => entry.id));

  const movable = defs.filter((def) => !def.locked);
  const order = config.order[route];
  if (order) {
    const rank = new Map(order.map((id, index) => [id, index]));
    const fallback = new Map(movable.map((def, index) => [def.id, index]));
    movable.sort((a, b) => {
      const rankA = rank.get(a.id) ?? order.length + (fallback.get(a.id) ?? 0);
      const rankB = rank.get(b.id) ?? order.length + (fallback.get(b.id) ?? 0);
      return rankA - rankB;
    });
  }

  const queue = [...movable];
  return defs.map((def) => {
    if (def.locked) return { ...def, hidden: false };
    const next = queue.shift() as SectionDefinition;
    return { ...next, hidden: hiddenIds.has(next.id) };
  });
}

/* ------------------------------------------------------------------- icons */

/**
 * The 68 icons, read from the site's sprite (the source of `IconName`).
 *
 * The studio must not offer a name the sprite does not define — that would be
 * a build failure waiting for a save — so the picker is built from the same
 * file the site compiles. Read-only: nothing here writes to `icons.ts`.
 */
export async function readIcons(): Promise<SpriteIcon[]> {
  const store = await getStore();
  const text = await store.readIconsSource();
  const sprite = /SPRITE = `([\s\S]*?)`;/.exec(text)?.[1] ?? '';

  const icons: SpriteIcon[] = [];
  const pattern = /<symbol id="([a-z0-9-]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(sprite)) !== null) {
    icons.push({ name: match[1], viewBox: match[2], body: match[3] });
  }
  if (icons.length === 0) throw new Error('studio: could not read any icon from the site sprite');
  return icons;
}
