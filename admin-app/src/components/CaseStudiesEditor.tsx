'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDirty } from '@/lib/dirty';
import { toast } from '@/lib/toast';
import type { CaseStudiesData, CaseStudy, SpriteIcon } from '@/lib/types';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';
import { IconSelect } from './IconPicker';
import { Area, RowTools, StringRows, Text, moveItem } from './fields';

/**
 * The home page's case-study section, edited as one document.
 *
 * This is the first home section whose copy is data rather than a literal, so
 * the studio can edit it the same way it edits capability pages: every field
 * the section renders is here, the save is validated before it writes, and the
 * section's show/hide and position stay in Pages → Home like every other
 * section (docs/admin.md §6, phase 9).
 *
 * Order is meaning here: the live case reads first, so the list's move controls
 * reorder the page itself.
 */

const EMPTY_CASE = (index: number): CaseStudy => ({
  id: `case-${index + 1}`,
  kind: 'illustrative',
  num: `CS/${String(index + 1).padStart(2, '0')}`,
  client: '',
  line: '',
  icon: 'i-custom',
  logo: null,
  summary: [''],
  note: '',
  tags: [],
  spec: [{ label: 'Sector', value: '' }],
  link: { label: 'Read the capability', href: '/services', external: false },
});

export function CaseStudiesEditor({
  data,
  icons,
}: {
  data: CaseStudiesData;
  icons: SpriteIcon[];
}) {
  const router = useRouter();
  const initial = useMemo(() => JSON.stringify(data), [data]);
  const [draft, setDraft] = useState<CaseStudiesData>(data);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(draft) !== initial;

  useEffect(() => {
    setDirty(dirty, 'This section has unsaved changes.');
    return () => setDirty(false);
  }, [dirty]);

  const err = (path: string) => issues[path];

  function patch(next: Partial<CaseStudiesData>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function patchCase(index: number, next: Partial<CaseStudy>) {
    setDraft((current) => ({
      ...current,
      cases: current.cases.map((item, i) => (i === index ? { ...item, ...next } : item)),
    }));
  }

  async function save() {
    setSaving(true);
    setIssues({});
    try {
      const response = await fetch('/api/case-studies', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: draft }),
      });
      const body = (await response.json()) as { ok: boolean; issues?: { path: string; message: string }[]; message?: string };
      if (!response.ok || !body.ok) {
        const map: Record<string, string> = {};
        for (const issue of body.issues ?? []) map[issue.path] = issue.message;
        setIssues(map);
        toast('bad', body.message ?? `${body.issues?.length ?? 1} validation problem(s) — nothing was written.`);
        return;
      }
      toast('ok', 'Saved. Build to let the gate judge the home page.');
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
          <p className="eyebrow">Home section</p>
          <h1>Case studies</h1>
          <p>
            The proof block on the home page: one live platform and the representative engagements after it. Copy,
            cards, order and links are edited here; the section&apos;s visibility and position live under Pages → Home.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={`${SITE_URL}/#case-studies`} target="_blank" rel="noreferrer">
            Open section <Icon name="external" size={14} />
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save section'}
          </button>
        </div>
      </div>

      {Object.keys(issues).length > 0 ? (
        <div className="card" style={{ marginBottom: 16, borderColor: 'var(--bad)' }}>
          <div className="card__head">
            <h2 style={{ color: 'var(--bad)' }}>Not saved — {Object.keys(issues).length} problem(s)</h2>
          </div>
          <div className="card__body">
            <ul className="hint-list">
              {Object.entries(issues).map(([path, message]) => (
                <li key={path}>
                  <code className="mono">{path}</code> — {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="split-2">
        <div className="stack">
          <section className="card">
            <div className="card__head">
              <h2>Section head</h2>
              <div className="spacer" />
              <span className="badge">/#case-studies</span>
            </div>
            <div className="card__body">
              <div className="grid-2">
                <Text label="Eyebrow" value={draft.head.eyebrow} onChange={(value) => patch({ head: { ...draft.head, eyebrow: value } })} error={err('head.eyebrow')} />
                <Text label="Title" value={draft.head.title} onChange={(value) => patch({ head: { ...draft.head, title: value } })} error={err('head.title')} />
              </div>
              <Area label="Lead" rows={4} value={draft.head.lead} onChange={(value) => patch({ head: { ...draft.head, lead: value } })} error={err('head.lead')} />
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Closing card</h2>
              <div className="spacer" />
              <span className="badge">accent</span>
            </div>
            <div className="card__body">
              <div className="grid-2">
                <Text label="Title" value={draft.cta.title} onChange={(value) => patch({ cta: { ...draft.cta, title: value } })} error={err('cta.title')} />
                <Text label="Button label" value={draft.cta.label} onChange={(value) => patch({ cta: { ...draft.cta, label: value } })} error={err('cta.label')} />
              </div>
              <Area label="Body" rows={2} value={draft.cta.body} onChange={(value) => patch({ cta: { ...draft.cta, body: value } })} error={err('cta.body')} />
              <Text
                label="Link"
                value={draft.cta.href}
                onChange={(value) => patch({ cta: { ...draft.cta, href: value } })}
                error={err('cta.href')}
                hint="A site path like /contact, or an https: address."
              />
            </div>
          </section>

          {draft.cases.map((item, index) => (
            <section className="card" id={`case-${item.id}`} key={`${item.id}-${index}`}>
              <div className="card__head">
                <h2>
                  {item.num || 'CS'} · {item.client || 'Untitled case'}
                </h2>
                <span className="badge">{item.kind}</span>
                <div className="spacer" />
                <RowTools
                  index={index}
                  total={draft.cases.length}
                  label={`case ${index + 1}`}
                  onMove={(direction) => patch({ cases: moveItem(draft.cases, index, direction) })}
                  onRemove={() => patch({ cases: draft.cases.filter((_, i) => i !== index) })}
                />
              </div>
              <div className="card__body">
                <div className="grid-2">
                  <Text
                    label="Id"
                    value={item.id}
                    onChange={(value) => patchCase(index, { id: value })}
                    error={err(`cases[${index}].id`)}
                    hint="Key only — no spaces needed."
                  />
                  <Text label="Index" value={item.num} onChange={(value) => patchCase(index, { num: value })} error={err(`cases[${index}].num`)} />
                </div>

                <div className="grid-2">
                  <label className="field">
                    <span className="field__label">Kind</span>
                    <select
                      className="select"
                      value={item.kind}
                      onChange={(event) => patchCase(index, { kind: event.target.value as CaseStudy['kind'] })}
                    >
                      <option value="live">live — a platform in production</option>
                      <option value="illustrative">illustrative — representative work</option>
                    </select>
                    <span className="field__hint">Shown on the card as “Live platform” or “Illustrative”.</span>
                  </label>
                  <IconSelect
                    label="Card icon"
                    value={item.icon}
                    icons={icons}
                    onChange={(name) => patchCase(index, { icon: name })}
                  />
                </div>

                <Text label="Client" value={item.client} onChange={(value) => patchCase(index, { client: value })} error={err(`cases[${index}].client`)} />
                <Text label="Line" value={item.line} onChange={(value) => patchCase(index, { line: value })} error={err(`cases[${index}].line`)} />

                <div className="field">
                  <span className="field__label">
                    Wordmark <span className="field__count">{item.logo ? 'set' : 'none'}</span>
                  </span>
                  {item.logo ? (
                    <>
                      <div className="grid-2">
                        <Text
                          label="Source"
                          value={item.logo.src}
                          onChange={(value) => patchCase(index, { logo: { ...item.logo!, src: value } })}
                          error={err(`cases[${index}].logo.src`)}
                          hint="A local file under /assets/ — never a remote URL."
                        />
                        <Text
                          label="Alt text"
                          value={item.logo.alt}
                          onChange={(value) => patchCase(index, { logo: { ...item.logo!, alt: value } })}
                          error={err(`cases[${index}].logo.alt`)}
                        />
                      </div>
                      <div className="grid-2">
                        <label className="field">
                          <span className="field__label">Width (px)</span>
                          <input
                            className="input"
                            type="number"
                            min={1}
                            value={item.logo.width}
                            onChange={(event) => patchCase(index, { logo: { ...item.logo!, width: Number(event.target.value) } })}
                          />
                        </label>
                        <label className="field">
                          <span className="field__label">Height (px)</span>
                          <input
                            className="input"
                            type="number"
                            min={1}
                            value={item.logo.height}
                            onChange={(event) => patchCase(index, { logo: { ...item.logo!, height: Number(event.target.value) } })}
                          />
                        </label>
                      </div>
                      <button type="button" className="btn btn--sm" onClick={() => patchCase(index, { logo: null })}>
                        <Icon name="trash" size={14} /> Remove wordmark
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="field__hint">
                        Illustrative cards show the icon above instead. A live case needs the client wordmark — a
                        white-on-transparent file reads on the section&apos;s ink plate.
                      </p>
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() =>
                          patchCase(index, { logo: { src: '/assets/img/', alt: item.client, width: 720, height: 184 } })
                        }
                      >
                        <Icon name="plus" size={14} /> Add wordmark
                      </button>
                    </>
                  )}
                </div>

                <StringRows
                  label="Summary paragraphs"
                  values={item.summary}
                  addLabel="Add paragraph"
                  onChange={(values) => patchCase(index, { summary: values })}
                />

                <div className="grid-2">
                  <StringRows label="Tags" values={item.tags} addLabel="Add tag" onChange={(values) => patchCase(index, { tags: values })} />
                </div>

                <div className="field">
                  <span className="field__label">
                    Spec rows <span className="field__count">{item.spec.length}</span>
                  </span>
                  <div className="rows">
                    {item.spec.map((row, rowIndex) => (
                      <div className="link-row link-row--pair" key={rowIndex}>
                        <input
                          className="input"
                          value={row.label}
                          placeholder="Sector"
                          aria-label={`Spec ${rowIndex + 1} label`}
                          onChange={(event) =>
                            patchCase(index, {
                              spec: item.spec.map((cell, i) => (i === rowIndex ? { ...cell, label: event.target.value } : cell)),
                            })
                          }
                        />
                        <input
                          className="input"
                          value={row.value}
                          placeholder="Retail and electronics"
                          aria-label={`Spec ${rowIndex + 1} value`}
                          onChange={(event) =>
                            patchCase(index, {
                              spec: item.spec.map((cell, i) => (i === rowIndex ? { ...cell, value: event.target.value } : cell)),
                            })
                          }
                        />
                        <RowTools
                          index={rowIndex}
                          total={item.spec.length}
                          label={`spec ${rowIndex + 1}`}
                          onMove={(direction) => patchCase(index, { spec: moveItem(item.spec, rowIndex, direction) })}
                          onRemove={() => patchCase(index, { spec: item.spec.filter((_, i) => i !== rowIndex) })}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => patchCase(index, { spec: [...item.spec, { label: '', value: '' }] })}
                  >
                    <Icon name="plus" size={14} /> Add row
                  </button>
                </div>

                <Area
                  label="Attribution note"
                  rows={2}
                  value={item.note}
                  onChange={(value) => patchCase(index, { note: value })}
                  error={err(`cases[${index}].note`)}
                />

                <div className="grid-2">
                  <Text
                    label="Link label"
                    value={item.link.label}
                    onChange={(value) => patchCase(index, { link: { ...item.link, label: value } })}
                    error={err(`cases[${index}].link.label`)}
                  />
                  <Text
                    label="Link href"
                    value={item.link.href}
                    onChange={(value) => patchCase(index, { link: { ...item.link, href: value } })}
                    error={err(`cases[${index}].link.href`)}
                    hint="A site path, or https: for a live platform."
                  />
                </div>
                <div className="field">
                  <span className="field__label">External link</span>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={item.link.external}
                      onChange={(event) => patchCase(index, { link: { ...item.link, external: event.target.checked } })}
                    />
                    <span>Open in a new tab (https: links only)</span>
                  </label>
                </div>
              </div>
            </section>
          ))}

          <section className="card">
            <div className="card__head">
              <h2>Add a case</h2>
            </div>
            <div className="card__body">
              <p className="field__hint">
                A new card starts as illustrative with an empty summary. Give it a client, a line and at least one
                paragraph — the save will refuse it otherwise.
              </p>
              <button type="button" className="btn" onClick={() => patch({ cases: [...draft.cases, EMPTY_CASE(draft.cases.length)] })}>
                <Icon name="plus" size={14} /> Add case card
              </button>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card__head">
              <h2>Cards</h2>
              <span className="badge">{draft.cases.length}</span>
            </div>
            <div className="card__body">
              <div className="rows">
                {draft.cases.map((item, index) => (
                  <a className="case-row" href={`#case-${item.id}`} key={`${item.id}-${index}`}>
                    <span className="mono">{item.num || '—'}</span>
                    <span>{item.client || 'Untitled case'}</span>
                    <span className="badge">{item.kind === 'live' ? 'live' : 'illustrative'}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Rules of the section</h2>
            </div>
            <div className="card__body">
              <ul className="hint-list">
                <li>
                  <strong>Live</strong> cards describe a platform in production and carry its wordmark; <strong>illustrative</strong>{' '}
                  ones are labelled as such on the page — never dress a demo as a client.
                </li>
                <li>Every figure in a note must be attributable to its source; the live card cites the operator&apos;s own published numbers.</li>
                <li>The wordmark comes from the client, unaltered. Put the file under <code className="mono">next-app/public/assets/img/</code> and reference it as <code className="mono">/assets/img/…</code>.</li>
                <li>Order is the story: keep the live case first. Showing, hiding or moving the whole section is on Pages → Home.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <div className="dirty-bar">
        <span className="dirty-bar__text">{dirty ? 'Unsaved section changes.' : 'All changes saved.'}</span>
        <div className="dirty-bar__actions">
          <button type="button" className="btn" onClick={() => setDraft(data)} disabled={!dirty || saving}>
            Reset
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save section'}
          </button>
        </div>
      </div>
    </div>
  );
}
