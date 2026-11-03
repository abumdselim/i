'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';

export interface PageRow {
  param: string;
  route: string;
  title: string;
  kind: string;
  sections: number;
  hidden: number;
  cta: boolean;
}

type Sort = 'route' | 'title' | 'sections' | 'hidden';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'route', label: 'Route, A–Z' },
  { value: 'title', label: 'Title, A–Z' },
  { value: 'sections', label: 'Most sections' },
  { value: 'hidden', label: 'Most hidden' },
];

export function PageTable({ rows }: { rows: PageRow[] }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [sort, setSort] = useState<Sort>('route');

  const kinds = useMemo(() => [...new Set(rows.map((row) => row.kind))].sort(), [rows]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (kind !== 'all' && row.kind !== kind) return false;
      if (!needle) return true;
      return `${row.route} ${row.title} ${row.kind}`.toLowerCase().includes(needle);
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'sections') return b.sections - a.sections || a.route.localeCompare(b.route);
      if (sort === 'hidden') return b.hidden - a.hidden || a.route.localeCompare(b.route);
      return a.route.localeCompare(b.route);
    });
  }, [rows, query, kind, sort]);

  const hiddenPages = rows.filter((row) => row.hidden > 0).length;

  return (
    <div className="card">
      <div className="card__head card__head--wrap">
        <h2>Pages</h2>
        <span className="badge">{visible.length}</span>
        <div className="spacer" />
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr-only">Filter pages</span>
          <input
            className="input"
            type="search"
            placeholder="Filter by route, title or kind"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="sr-only" htmlFor="page-kind">
          Kind
        </label>
        <select
          id="page-kind"
          className="select select--compact"
          value={kind}
          onChange={(event) => setKind(event.target.value)}
        >
          <option value="all">All kinds</option>
          {kinds.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="page-sort">
          Sort
        </label>
        <select
          id="page-sort"
          className="select select--compact"
          value={sort}
          onChange={(event) => setSort(event.target.value as Sort)}
        >
          {SORTS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="table table--cards">
          <thead>
            <tr>
              <th>Route</th>
              <th>Title</th>
              <th className="col-kind">Kind</th>
              <th className="col-sections">Sections</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.route}>
                <td className="route">{row.route}</td>
                <td className="title">{row.title}</td>
                <td className="col-kind">
                  <span className="badge">{row.kind}</span>
                </td>
                <td className="col-sections">{row.sections}</td>
                <td>
                  <span className="badges">
                    {row.hidden > 0 ? <span className="badge badge--warn">{row.hidden} hidden</span> : null}
                    {!row.cta ? <span className="badge">CTA off</span> : null}
                    {row.hidden === 0 && row.cta ? <span className="badge badge--ok">live</span> : null}
                  </span>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link className="table__link" href={`/pages/${row.param}`}>
                    Edit
                  </Link>
                  <a
                    className="table__icon"
                    href={`${SITE_URL}${row.route === '/' ? '' : row.route}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${row.route} on the site`}
                    title="Open on the site"
                  >
                    <Icon name="external" size={13} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? <p className="empty">No page matches those filters.</p> : null}

      <div className="card__foot card__foot--split">
        <span className="mono" style={{ color: 'var(--muted)' }}>
          {visible.length} of {rows.length} pages · {hiddenPages} with hidden sections
        </span>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => {
            setQuery('');
            setKind('all');
            setSort('route');
          }}
          disabled={!query && kind === 'all' && sort === 'route'}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
