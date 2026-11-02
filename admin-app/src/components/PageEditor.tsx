'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { setDirty } from '@/lib/dirty';
import { toast } from '@/lib/toast';
import type { PageEntry, PlannedSection } from '@/lib/types';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';

const ROBOTS = ['index, follow', 'noindex, follow'];
const TITLE_MAX = 70;
const DESCRIPTION_MAX = 180;

interface SectionRow extends PlannedSection {
  /** Position in the editor list; reordering rewrites this array. */
  key: string;
}

function toRows(plan: PlannedSection[]): SectionRow[] {
  return plan
    .filter((section) => section.mount === 'body')
    .map((section) => ({ ...section, key: section.id }));
}

export function PageEditor({
  param,
  page,
  plan,
}: {
  param: string;
  page: PageEntry;
  plan: PlannedSection[];
}) {
  const router = useRouter();
  const rows = useMemo(() => toRows(plan), [plan]);

  const [meta, setMeta] = useState({
    title: page.title,
    description: page.description,
    robots: page.robots,
    showCta: page.showCta,
  });
  const [sections, setSections] = useState<SectionRow[]>(rows);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const snapshot = useMemo(
    () =>
      JSON.stringify({
        meta: { title: page.title, description: page.description, robots: page.robots, showCta: page.showCta },
        sections: rows.map((row) => `${row.id}:${row.hidden ? 'hidden' : 'shown'}`),
      }),
    [page, rows],
  );

  const current = JSON.stringify({
    meta,
    sections: sections.map((row) => `${row.id}:${row.hidden ? 'hidden' : 'shown'}`),
  });

  const dirty = current !== snapshot;

  useEffect(() => {
    setDirty(dirty, 'This page has unsaved changes.');
    return () => setDirty(false);
  }, [dirty]);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    if (sections[index].locked || sections[target].locked) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  }

  function toggle(id: string) {
    setSections((list) =>
      list.map((row) => (row.id === id && !row.locked ? { ...row, hidden: !row.hidden } : row)),
    );
  }

  async function save() {
    setSaving(true);
    setIssues({});
    try {
      const response = await fetch(`/api/pages/${param}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...meta,
          hidden: sections.filter((row) => row.hidden).map((row) => row.id),
          order: sections.filter((row) => !row.locked).map((row) => row.id),
        }),
      });
      const data = (await response.json()) as { ok: boolean; issues?: { path: string; message: string }[]; message?: string };
      if (!response.ok || !data.ok) {
        const map: Record<string, string> = {};
        for (const issue of data.issues ?? []) {
          const field = issue.path.split('.').pop() ?? issue.path;
          const key = issue.path.startsWith('hidden')
            ? 'hidden'
            : issue.path.startsWith('order')
              ? 'order'
              : field;
          map[key] ??= issue.message;
        }
        setIssues(map);
        toast('bad', data.message ?? `${data.issues?.length ?? 1} validation problem(s) — nothing was written.`);
        return;
      }
      toast('ok', 'Saved. Run a build to let the gate judge it.');
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
          <p className="eyebrow">{page.kind}</p>
          <h1>{page.route === '/' ? 'Home' : page.route}</h1>
          <p>
            Meta and section controls for this route. The site reads them from{' '}
            <code className="mono">data/pages.json</code> and <code className="mono">data/site-config.json</code>.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={`${SITE_URL}${page.route === '/' ? '' : page.route}`} target="_blank" rel="noreferrer">
            Open page <Icon name="external" size={14} />
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="split-2">
        <section className="card">
          <div className="card__head">
            <h2>Page meta</h2>
            <div className="spacer" />
            <span className="badge">{page.file}</span>
          </div>
          <div className="card__body">
            <label className="field">
              <span className="field__label">
                Title
                <span className="field__count">
                  {meta.title.length}/{TITLE_MAX}
                </span>
              </span>
              <input
                className="input"
                value={meta.title}
                aria-invalid={Boolean(issues.title)}
                onChange={(event) => setMeta({ ...meta, title: event.target.value })}
              />
              {issues.title ? <span className="field__error">{issues.title}</span> : null}
              <span className="field__hint">The browser tab and the search result. The gate compares it.</span>
            </label>

            <label className="field">
              <span className="field__label">
                Description
                <span className="field__count">
                  {meta.description.length}/{DESCRIPTION_MAX}
                </span>
              </span>
              <textarea
                className="textarea"
                value={meta.description}
                aria-invalid={Boolean(issues.description)}
                onChange={(event) => setMeta({ ...meta, description: event.target.value })}
              />
              {issues.description ? <span className="field__error">{issues.description}</span> : null}
            </label>

            <div className="grid-2">
              <label className="field">
                <span className="field__label">Robots</span>
                <select
                  className="select"
                  value={meta.robots}
                  onChange={(event) => setMeta({ ...meta, robots: event.target.value })}
                >
                  {ROBOTS.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {issues.robots ? <span className="field__error">{issues.robots}</span> : null}
              </label>

              <div className="field">
                <span className="field__label">Closing call to action</span>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={meta.showCta}
                    onChange={(event) => setMeta({ ...meta, showCta: event.target.checked })}
                  />
                  Show the CTA block at the end of this page
                </label>
                <span className="field__hint">The registry keeps a locked cta slot; this switch renders it.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Sections</h2>
            <span className="badge">{sections.filter((row) => !row.hidden).length} shown</span>
            <div className="spacer" />
            <span className="mono" style={{ color: 'var(--muted)' }}>
              order = top to bottom
            </span>
          </div>
          <div className="card__body">
            <div className="sections">
              {sections.map((row, index) => (
                <div className={`section-card${row.hidden ? ' section-card--hidden' : ''}`} key={row.id}>
                  <Icon name="grip" size={16} className="grip" />
                  <span className="section-card__num">{String(index + 1).padStart(2, '0')}</span>
                  <div className="section-card__body">
                    <p className="section-card__title">{row.title}</p>
                    <p className="section-card__meta">
                      <span className="mono">{row.id}</span>
                      <span className="badge">{row.kind}</span>
                      {row.locked ? <span className="badge badge--accent">locked</span> : null}
                    </p>
                  </div>
                  <div className="section-card__actions">
                    <button
                      type="button"
                      className="iconbtn iconbtn--bare"
                      onClick={() => move(index, -1)}
                      disabled={row.locked || index === 0 || sections[index - 1]?.locked}
                      aria-label={`Move ${row.title} up`}
                    >
                      <Icon name="up" size={15} />
                    </button>
                    <button
                      type="button"
                      className="iconbtn iconbtn--bare"
                      onClick={() => move(index, 1)}
                      disabled={row.locked || index === sections.length - 1 || sections[index + 1]?.locked}
                      aria-label={`Move ${row.title} down`}
                    >
                      <Icon name="down" size={15} />
                    </button>
                    <button
                      type="button"
                      className="eye"
                      aria-pressed={!row.hidden}
                      aria-label={row.hidden ? `Show ${row.title}` : `Hide ${row.title}`}
                      title={row.locked ? 'Locked sections cannot be hidden' : row.hidden ? 'Show' : 'Hide'}
                      onClick={() => toggle(row.id)}
                      disabled={row.locked}
                    >
                      <Icon name={row.hidden ? 'eyeOff' : 'eye'} size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="field__hint" style={{ marginTop: 12 }}>
              Locked rows keep their place: the head carries the h1 and cannot be hidden. The closing CTA is the switch
              in Page meta.
            </p>
          </div>
        </section>
      </div>

      {issues['hidden'] || issues['order'] ? (
        <p className="field__error" style={{ marginTop: 12 }}>
          {issues['hidden'] ?? issues['order']}
        </p>
      ) : null}

      <div className="dirty-bar">
        <span className="dirty-bar__text">
          {dirty ? 'Unsaved changes on this page.' : 'All changes saved.'}
        </span>
        <div className="dirty-bar__actions">
          <Link
            className="btn"
            href="/pages"
            onClick={(event) => {
              if (dirty && !window.confirm('Discard the unsaved changes on this page?')) event.preventDefault();
            }}
          >
            Back to pages
          </Link>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
