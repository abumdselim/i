import { CaseStudiesEditor } from '@/components/CaseStudiesEditor';
import { readCaseStudies, readIcons } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * The home case-study section's editor (docs/admin.md §6, phase 9).
 *
 * The studio's first home-section content screen: the section reads
 * `next-app/data/case-studies.json`, this screen edits that one document, and
 * the same file is validated again by the site's build. Show/hide and position
 * of the section itself stay on Pages → Home, like every other section.
 */
export default async function CaseStudiesPage() {
  const [data, icons] = await Promise.all([readCaseStudies(), readIcons()]);
  return <CaseStudiesEditor data={data} icons={icons} />;
}
