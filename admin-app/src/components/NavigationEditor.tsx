'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDirty } from '@/lib/dirty';
import { toast } from '@/lib/toast';
import type { NavItem } from '@/lib/types';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';

export function NavigationEditor({ nav }: { nav: NavItem[] }) {
  const router = useRouter();
  const initial = useMemo(() => JSON.stringify(nav), [nav]);
  const [rows, setRows] = useState<NavItem[]>(nav);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(rows) !== initial;

  useEffect(() => {
    setDirty(dirty, 'The navigation has unsaved changes.');
    return () => setDirty(false);
  }, [dirty]);

  function update(index: number, patch: Partial<NavItem>) {
    setRows((list) => list.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  }

  function add() {
    let n = rows.length + 1;
    while (rows.some((row) => row.key === `link-${n}`)) n += 1;
    setRows([...rows, { label: 'New link', href: '/', key: `link-${n}` }]);
  }

  function remove(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setIssues({});
    try {
      const response = await fetch('/api/nav', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nav: rows }),
      });
      const data = (await response.json()) as { ok: boolean; issues?: { path: string; message: string }[]; message?: string };
      if (!response.ok || !data.ok) {
        const map: Record<string, string> = {};
        for (const issue of data.issues ?? []) map[issue.path] = issue.message;
        setIssues(map);
        toast('bad', data.message ?? 'The navigation was not saved — check the marked fields.');
        return;
      }
      toast('ok', 'Navigation saved. The header and the mobile menu both read it.');
      setDirty(false);
      router.refresh();
    } catch (error) {
      toast('bad', `Could not save: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Site</p>
          <h1>Navigation</h1>
          <p>
            The seven primary links in the header and the mobile menu. Order, label and destination are yours; the key
            decides which page a link marks as current.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={SITE_URL} target="_blank" rel="noreferrer">
            See the header <Icon name="external" size={14} />
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save navigation'}
          </button>
        </div>
      </div>

      <section className="card">
        <div className="card__head">
          <h2>Primary links</h2>
          <span className="badge">{rows.length}</span>
          <div className="spacer" />
          <button type="button" className="btn btn--sm" onClick={add}>
            <Icon name="plus" size={14} /> Add link
          </button>
        </div>
        <div className="card__body">
          <div className="rows">
            {rows.map((row, index) => (
              <div className="row" key={`${row.key}-${index}`}>
                <span className="row__index">{String(index + 1).padStart(2, '0')}</span>
                <label>
                  <span className="sr-only">Label {index + 1}</span>
                  <input
                    className="input"
                    value={row.label}
                    aria-invalid={Boolean(issues[`nav[${index}].label`])}
                    onChange={(event) => update(index, { label: event.target.value })}
                  />
                </label>
                <label>
                  <span className="sr-only">Destination {index + 1}</span>
                  <input
                    className="input input--href"
                    value={row.href}
                    aria-invalid={Boolean(issues[`nav[${index}].href`])}
                    onChange={(event) => update(index, { href: event.target.value })}
                  />
                </label>
                <label>
                  <span className="sr-only">Key {index + 1}</span>
                  <input
                    className="input input--key"
                    value={row.key}
                    aria-invalid={Boolean(issues[`nav[${index}].key`])}
                    onChange={(event) => update(index, { key: event.target.value })}
                  />
                </label>
                <div className="row__actions">
                  <button
                    type="button"
                    className="iconbtn iconbtn--bare"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${row.label} up`}
                  >
                    <Icon name="up" size={15} />
                  </button>
                  <button
                    type="button"
                    className="iconbtn iconbtn--bare"
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label={`Move ${row.label} down`}
                  >
                    <Icon name="down" size={15} />
                  </button>
                  <button
                    type="button"
                    className="iconbtn iconbtn--bare"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${row.label}`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {issues['nav'] ? <p className="field__error" style={{ marginTop: 12 }}>{issues['nav']}</p> : null}

          <p className="field__hint" style={{ marginTop: 14 }}>
            Label · destination · key. The key is the manifest&apos;s <code className="mono">navKey</code> it matches to
            mark a link current — it is not shown on the site.
          </p>
        </div>
      </section>

      <div className="dirty-bar">
        <span className="dirty-bar__text">{dirty ? 'Unsaved navigation changes.' : 'All changes saved.'}</span>
        <div className="dirty-bar__actions">
          <button type="button" className="btn" onClick={() => setRows(nav)} disabled={!dirty || saving}>
            Reset
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save navigation'}
          </button>
        </div>
      </div>
    </div>
  );
}
