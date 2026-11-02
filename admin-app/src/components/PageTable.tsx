'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from './icons';

export interface PageRow {
  param: string;
  route: string;
  title: string;
  kind: string;
  sections: number;
  hidden: number;
}

export function PageTable({ rows }: { rows: PageRow[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (row) =>
        row.route.toLowerCase().includes(needle) ||
        row.title.toLowerCase().includes(needle) ||
        row.kind.toLowerCase().includes(needle),
    );
  }, [rows, query]);

  return (
    <div className="card">
      <div className="card__head">
        <h2>Pages</h2>
        <span className="badge">{filtered.length}</span>
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
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Title</th>
              <th>Kind</th>
              <th>Sections</th>
              <th>Hidden</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.route}>
                <td className="route">{row.route}</td>
                <td className="title">{row.title}</td>
                <td>
                  <span className="badge">{row.kind}</span>
                </td>
                <td>{row.sections}</td>
                <td>{row.hidden > 0 ? <span className="badge badge--warn">{row.hidden}</span> : <span className="badge">0</span>}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link className="table__link" href={`/pages/${row.param}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 ? <p className="empty">No page matches “{query}”.</p> : null}
    </div>
  );
}
