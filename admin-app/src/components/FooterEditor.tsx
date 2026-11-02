'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDirty } from '@/lib/dirty';
import { toast } from '@/lib/toast';
import type { FooterColumn, SiteConfig } from '@/lib/types';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';

type Footer = SiteConfig['footer'];

export function FooterEditor({ footer }: { footer: Footer }) {
  const router = useRouter();
  const initial = useMemo(() => JSON.stringify(footer), [footer]);
  const [brand, setBrand] = useState(footer.brand);
  const [columns, setColumns] = useState<FooterColumn[]>(footer.columns);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify({ brand, columns }) !== initial;

  useEffect(() => {
    setDirty(dirty, 'The footer has unsaved changes.');
    return () => setDirty(false);
  }, [dirty]);

  function updateColumn(index: number, patch: Partial<FooterColumn>) {
    setColumns((list) => list.map((column, i) => (i === index ? { ...column, ...patch } : column)));
  }

  function updateLink(column: number, link: number, patch: { label?: string; href?: string }) {
    setColumns((list) =>
      list.map((entry, i) =>
        i === column
          ? { ...entry, links: entry.links.map((row, j) => (j === link ? { ...row, ...patch } : row)) }
          : entry,
      ),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= columns.length) return;
    const next = [...columns];
    [next[index], next[target]] = [next[target], next[index]];
    setColumns(next);
  }

  async function save() {
    setSaving(true);
    setIssues({});
    try {
      const response = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ footer: { brand, columns } }),
      });
      const data = (await response.json()) as { ok: boolean; issues?: { path: string; message: string }[]; message?: string };
      if (!response.ok || !data.ok) {
        const map: Record<string, string> = {};
        for (const issue of data.issues ?? []) map[issue.path] = issue.message;
        setIssues(map);
        toast('bad', data.message ?? 'The footer was not saved — check the marked fields.');
        return;
      }
      toast('ok', 'Footer saved. It renders on every page.');
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
          <h1>Footer</h1>
          <p>
            The brand block and the four columns that close every page. Links can point anywhere the site accepts: a
            route, an anchor, <code className="mono">mailto:</code> or an https address.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={SITE_URL} target="_blank" rel="noreferrer">
            See the footer <Icon name="external" size={14} />
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save footer'}
          </button>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="card__head">
          <h2>Brand block</h2>
        </div>
        <div className="card__body">
          <label className="field">
            <span className="field__label">Blurb</span>
            <textarea
              className="textarea"
              value={brand.blurb}
              aria-invalid={Boolean(issues['footer.brand.blurb'])}
              onChange={(event) => setBrand({ ...brand, blurb: event.target.value })}
            />
            {issues['footer.brand.blurb'] ? (
              <span className="field__error">{issues['footer.brand.blurb']}</span>
            ) : null}
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="input"
              value={brand.email}
              aria-invalid={Boolean(issues['footer.brand.email'])}
              onChange={(event) => setBrand({ ...brand, email: event.target.value })}
            />
            {issues['footer.brand.email'] ? (
              <span className="field__error">{issues['footer.brand.email']}</span>
            ) : null}
          </label>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {columns.map((column, index) => (
          <section className="col" key={index}>
            <div className="col__head">
              <input
                className="input"
                value={column.title}
                aria-label={`Column ${index + 1} title`}
                aria-invalid={Boolean(issues[`footer.columns[${index}].title`])}
                onChange={(event) => updateColumn(index, { title: event.target.value })}
              />
              <button
                type="button"
                className="iconbtn iconbtn--bare"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${column.title} left`}
              >
                <Icon name="up" size={15} />
              </button>
              <button
                type="button"
                className="iconbtn iconbtn--bare"
                onClick={() => move(index, 1)}
                disabled={index === columns.length - 1}
                aria-label={`Move ${column.title} right`}
              >
                <Icon name="down" size={15} />
              </button>
              <button
                type="button"
                className="iconbtn iconbtn--bare"
                onClick={() => setColumns(columns.filter((_, i) => i !== index))}
                aria-label={`Remove ${column.title}`}
              >
                <Icon name="trash" size={15} />
              </button>
            </div>

            <div className="rows">
              {column.links.map((link, linkIndex) => (
                <div className="link-row" key={linkIndex}>
                  <input
                    className="input"
                    value={link.label}
                    aria-label={`${column.title} link ${linkIndex + 1} label`}
                    onChange={(event) => updateLink(index, linkIndex, { label: event.target.value })}
                  />
                  <input
                    className="input input--href"
                    value={link.href}
                    aria-label={`${column.title} link ${linkIndex + 1} destination`}
                    aria-invalid={Boolean(issues[`footer.columns[${index}].links[${linkIndex}].href`])}
                    onChange={(event) => updateLink(index, linkIndex, { href: event.target.value })}
                  />
                  <button
                    type="button"
                    className="iconbtn iconbtn--bare"
                    onClick={() =>
                      updateColumn(index, { links: column.links.filter((_, j) => j !== linkIndex) })
                    }
                    aria-label={`Remove ${link.label}`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn--sm"
              onClick={() => updateColumn(index, { links: [...column.links, { label: 'New link', href: '/' }] })}
            >
              <Icon name="plus" size={14} /> Add link
            </button>

            {issues[`footer.columns[${index}].links`] ? (
              <p className="field__error">{issues[`footer.columns[${index}].links`]}</p>
            ) : null}
          </section>
        ))}
      </div>

      <p style={{ marginTop: 16 }}>
        <button
          type="button"
          className="btn btn--sm"
          onClick={() => setColumns([...columns, { title: 'New column', links: [{ label: 'Home', href: '/' }] }])}
        >
          <Icon name="plus" size={14} /> Add column
        </button>
      </p>

      <div className="dirty-bar">
        <span className="dirty-bar__text">{dirty ? 'Unsaved footer changes.' : 'All changes saved.'}</span>
        <div className="dirty-bar__actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setBrand(footer.brand);
              setColumns(footer.columns);
            }}
            disabled={!dirty || saving}
          >
            Reset
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save footer'}
          </button>
        </div>
      </div>
    </div>
  );
}
