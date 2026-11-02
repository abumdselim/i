import Link from 'next/link';
import { Icon } from '@/components/icons';
import { PageTable, type PageRow } from '@/components/PageTable';
import { paramForRoute } from '@/lib/routes';
import { lastBuild, readConfig, readPages, readSections, sectionsOf } from '@/lib/site';
import { PREVIEW_URL, SITE_URL } from '@/lib/urls';

export const dynamic = 'force-dynamic';

const BUILD_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function Dashboard() {
  const [pages, sections, config, build] = await Promise.all([
    readPages(),
    readSections(),
    readConfig(),
    lastBuild(),
  ]);

  const hiddenOn = (route: string) =>
    config.hidden.filter((entry) => entry.route === route).length;

  const rows: PageRow[] = pages.map((page) => ({
    param: paramForRoute(page.route),
    route: page.route,
    title: page.title,
    kind: page.kind,
    sections: sectionsOf(sections, page.route).length,
    hidden: hiddenOn(page.route),
  }));

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Intactic Studio</h1>
          <p>
            Everything the site renders comes from <code className="mono">next-app/data</code>. Edit here, build there,
            and the gate decides whether the change is safe.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={SITE_URL} target="_blank" rel="noreferrer">
            Site dev server <Icon name="external" size={14} />
          </a>
          <a className="btn" href={PREVIEW_URL} target="_blank" rel="noreferrer">
            Built preview <Icon name="external" size={14} />
          </a>
          <Link className="btn btn--primary" href="/build">
            <Icon name="play" size={14} /> Build &amp; verify
          </Link>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <p className="stat__label">Pages</p>
          <p className="stat__value">{pages.length}</p>
          <p className="stat__note">Nineteen routes in the manifest</p>
        </div>
        <div className="stat">
          <p className="stat__label">Sections</p>
          <p className="stat__value">{sections.length}</p>
          <p className="stat__note">Registered blocks across those routes</p>
        </div>
        <div className="stat">
          <p className="stat__label">Hidden</p>
          <p className="stat__value">{config.hidden.length}</p>
          <p className="stat__note">Sections switched off in site-config</p>
        </div>
        <div className="stat">
          <p className="stat__label">Last build</p>
          <p className="stat__value" style={{ fontSize: '1.125rem', paddingTop: 10 }}>
            {build.at ? BUILD_FORMAT.format(new Date(build.at)) : 'Not built yet'}
          </p>
          <p className="stat__note">{build.exists ? 'next-app/out/index.html' : 'Run a build to export the site'}</p>
        </div>
      </div>

      <PageTable rows={rows} />

      <div className="rule" />

      <div className="split-2">
        <section className="card">
          <div className="card__head">
            <h2>How a change travels</h2>
          </div>
          <div className="card__body hint-list">
            <p>
              <b>1 · Edit.</b> Pages, sections, navigation and footer write straight into the site&apos;s data files.
              Every write is validated, atomic, and keeps a <code className="mono">.bak</code>.
            </p>
            <p>
              <b>2 · Build.</b> The build panel runs <code className="mono">npm run verify</code>: export, parity gate,
              lint. The gate compares text and markup against the frozen reference.
            </p>
            <p>
              <b>3 · Review.</b> An intended copy change will fail the gate until the change is approved — that is the
              design, not a fault.
            </p>
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Where to go</h2>
          </div>
          <div className="card__body stack">
            <Link className="btn" href="/pages">
              <Icon name="pages" size={15} /> Page meta &amp; sections
            </Link>
            <Link className="btn" href="/navigation">
              <Icon name="nav" size={15} /> Primary navigation
            </Link>
            <Link className="btn" href="/footer">
              <Icon name="footer" size={15} /> Footer columns
            </Link>
            <Link className="btn" href="/content">
              <Icon name="content" size={15} /> Capability &amp; product copy
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
