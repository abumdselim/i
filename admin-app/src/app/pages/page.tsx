import { PageTable, type PageRow } from '@/components/PageTable';
import { paramForRoute } from '@/lib/routes';
import { readConfig, readPages, readSections, sectionsOf } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function PagesIndex() {
  const [pages, sections, config] = await Promise.all([readPages(), readSections(), readConfig()]);

  const rows: PageRow[] = pages.map((page) => ({
    param: paramForRoute(page.route),
    route: page.route,
    title: page.title,
    kind: page.kind,
    sections: sectionsOf(sections, page.route).length,
    hidden: config.hidden.filter((entry) => entry.route === page.route).length,
  }));

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Site</p>
          <h1>Pages</h1>
          <p>
            Every route in the manifest, with its meta, its sections and how many of them are hidden. Open a page to
            edit its title, description, robots and section order.
          </p>
        </div>
      </div>

      <PageTable rows={rows} />
    </div>
  );
}
