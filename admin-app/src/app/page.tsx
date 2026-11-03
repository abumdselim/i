import Link from 'next/link';
import { Icon } from '@/components/icons';
import { PageTable, type PageRow } from '@/components/PageTable';
import { recentCommits } from '@/lib/git';
import { paramForRoute } from '@/lib/routes';
import { readConfig, readPages, readSections, sectionsOf } from '@/lib/site';
import { SITE_URL } from '@/lib/urls';

export const dynamic = 'force-dynamic';

interface Attention {
  route: string;
  param: string;
  label: string;
}

const TITLE_LIMIT = 70;
const DESCRIPTION_LIMIT = 180;

export default async function Dashboard() {
  const [pages, sections, config, log] = await Promise.all([
    readPages(),
    readSections(),
    readConfig(),
    recentCommits(4),
  ]);

  const hiddenOn = (route: string) => config.hidden.filter((entry) => entry.route === route).length;

  const rows: PageRow[] = pages.map((page) => ({
    param: paramForRoute(page.route),
    route: page.route,
    title: page.title,
    kind: page.kind,
    sections: sectionsOf(sections, page.route).length,
    hidden: hiddenOn(page.route),
    cta: page.showCta,
  }));

  const attention: Attention[] = [];
  for (const page of pages) {
    const param = paramForRoute(page.route);
    if (page.title.length > TITLE_LIMIT) {
      attention.push({ route: page.route, param, label: `title is ${page.title.length} characters — limit ${TITLE_LIMIT}` });
    }
    if (page.description.length > DESCRIPTION_LIMIT) {
      attention.push({
        route: page.route,
        param,
        label: `description is ${page.description.length} characters — limit ${DESCRIPTION_LIMIT}`,
      });
    }
    const hidden = hiddenOn(page.route);
    if (hidden > 0) {
      attention.push({ route: page.route, param, label: `${hidden} section${hidden === 1 ? '' : 's'} hidden` });
    }
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Intactic Studio</h1>
          <p>
            Every page, every section, and the copy behind them. Saves land in{' '}
            <code className="mono">next-app/data</code>; publishing is still a build and a gate in the terminal.
          </p>
        </div>
        <div className="page-head__actions">
          <Link className="btn" href="/changes">
            <Icon name="changes" size={15} /> Changes
          </Link>
          <a className="btn" href={SITE_URL} target="_blank" rel="noreferrer">
            Open the site <Icon name="external" size={14} />
          </a>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <p className="stat__label">Pages</p>
          <p className="stat__value">{pages.length}</p>
          <p className="stat__note">Routes in the manifest</p>
        </div>
        <div className="stat">
          <p className="stat__label">Sections</p>
          <p className="stat__value">{sections.length}</p>
          <p className="stat__note">Registered blocks across them</p>
        </div>
        <div className="stat">
          <p className="stat__label">Hidden</p>
          <p className="stat__value">{config.hidden.length}</p>
          <p className="stat__note">Switched off in site-config</p>
        </div>
        <div className="stat">
          <p className="stat__label">Needs attention</p>
          <p className="stat__value" style={attention.length > 0 ? { color: 'var(--warn)' } : undefined}>
            {attention.length}
          </p>
          <p className="stat__note">{attention.length > 0 ? 'Reachable from the list below' : 'Every page looks clean'}</p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="card__head">
          <h2>Needs attention</h2>
          <span className={`badge ${attention.length === 0 ? 'badge--ok' : 'badge--warn'}`}>{attention.length}</span>
          <div className="spacer" />
          <span className="mono" style={{ color: 'var(--muted)' }}>
            meta limits · hidden sections
          </span>
        </div>
        {attention.length === 0 ? (
          <p className="empty">
            Nothing to fix. Titles are under {TITLE_LIMIT} characters, descriptions under {DESCRIPTION_LIMIT}, and no
            section is hidden.
          </p>
        ) : (
          <ul className="attention">
            {attention.slice(0, 8).map((item, index) => (
              <li key={`${item.route}-${index}`}>
                <Link href={`/pages/${item.param}`}>
                  <span className="route mono">{item.route}</span>
                  <span>{item.label}</span>
                  <Icon name="chevron" size={14} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PageTable rows={rows} />

      <div className="rule" />

      <div className="split-2">
        <section className="card">
          <div className="card__head">
            <h2>Recent commits</h2>
            <div className="spacer" />
            <Link className="table__link" href="/changes">
              All changes
            </Link>
          </div>
          <div className="card__body">
            {log.commits.length === 0 ? (
              <p className="empty">{log.error ?? 'No commits yet.'}</p>
            ) : (
              <ol className="commits">
                {log.commits.map((commit) => (
                  <li key={commit.hash}>
                    <span className="mono commit__hash">{commit.hash}</span>
                    <span className="commit__subject">{commit.subject}</span>
                    <span className="mono commit__date">{commit.date}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Edit</h2>
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
