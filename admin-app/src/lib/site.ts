import { promises as fs } from 'node:fs';
import path from 'node:path';
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

/**
 * The site's data folder, and the only code in the studio that touches disk
 * (docs/admin.md §6.4). Reads are plain; writes are atomic and keep one
 * backup: the new text goes to `<file>.tmp`, the old file is copied to
 * `<file>.bak`, and only then is the temp renamed over the target. A failed
 * write therefore leaves the previous file intact.
 *
 * Every file name is from this module's whitelist — nothing from a request
 * path or a form field is ever joined onto the data directory.
 */

const SITE_ROOT = path.resolve(process.cwd(), '..', 'next-app');
export const DATA_DIR = path.join(SITE_ROOT, 'data');

type DataFile = 'pages.json' | 'sections.json' | 'site-config.json' | 'capabilities.json' | 'products.json' | 'case-studies.json';

async function readJson<T>(name: DataFile): Promise<T> {
  const file = path.join(DATA_DIR, name);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch (error) {
    throw new Error(`studio: cannot read ${file} — ${(error as Error).message}`);
  }
}

async function writeJson(name: DataFile, value: unknown): Promise<void> {
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.tmp`;
  const text = `${JSON.stringify(value, null, 2)}\n`;

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.copyFile(file, `${file}.bak`).catch(() => undefined);
  await fs.writeFile(tmp, text, 'utf8');
  await fs.rename(tmp, file);
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

export function writePages(pages: PageEntry[]): Promise<void> {
  return writeJson('pages.json', pages);
}

export function writeConfig(config: SiteConfig): Promise<void> {
  return writeJson('site-config.json', config);
}

export function writeCapabilities(capabilities: CapabilityContent[]): Promise<void> {
  return writeJson('capabilities.json', capabilities);
}

export function writeProducts(products: ProductContent[]): Promise<void> {
  return writeJson('products.json', products);
}

export function writeCaseStudies(data: CaseStudiesData): Promise<void> {
  return writeJson('case-studies.json', data);
}

export async function writeContent(
  type: ContentType,
  slug: string,
  content: CapabilityContent | ProductContent,
): Promise<void> {
  if (type === 'capability') {
    const list = await readCapabilities();
    const index = list.findIndex((entry) => entry.slug === slug);
    if (index < 0) throw new Error(`studio: no capability "${slug}"`);
    list[index] = content as CapabilityContent;
    await writeCapabilities(list);
    return;
  }

  const list = await readProducts();
  const index = list.findIndex((entry) => entry.slug === slug);
  if (index < 0) throw new Error(`studio: no product "${slug}"`);
  list[index] = content as ProductContent;
  await writeProducts(list);
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
  const file = path.join(SITE_ROOT, 'src', 'components', 'icons.ts');
  const text = await fs.readFile(file, 'utf8');
  const sprite = /SPRITE = `([\s\S]*?)`;/.exec(text)?.[1] ?? '';

  const icons: SpriteIcon[] = [];
  const pattern = /<symbol id="([a-z0-9-]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(sprite)) !== null) {
    icons.push({ name: match[1], viewBox: match[2], body: match[3] });
  }
  if (icons.length === 0) throw new Error(`studio: could not read any icon from ${file}`);
  return icons;
}
