'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDirty } from '@/lib/dirty';
import { toast } from '@/lib/toast';
import type {
  CapabilityContent,
  ContentItem,
  ContentType,
  MetaItem,
  ProductContent,
  RelatedItem,
  SpriteIcon,
} from '@/lib/types';
import { SITE_URL } from '@/lib/urls';
import { Icon } from './icons';
import { IconPicker, IconSelect } from './IconPicker';
import { Area, RowTools, StringRows, Text, moveItem } from './fields';

type Draft = CapabilityContent & ProductContent;

export function ContentEditor({
  type,
  content,
  icons,
}: {
  type: ContentType;
  content: CapabilityContent | ProductContent;
  icons: SpriteIcon[];
}) {
  const router = useRouter();
  const initial = useMemo(() => JSON.stringify(content), [content]);
  // The union is narrowed by `type` at every use site; the draft keeps every
  // field the two shapes can carry so one form can edit both.
  const [draft, setDraft] = useState<Draft>(() => content as unknown as Draft);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(draft) !== initial;

  useEffect(() => {
    setDirty(dirty, 'This content has unsaved changes.');
    return () => setDirty(false);
  }, [dirty]);

  function patch(next: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  const err = (path: string) => issues[path];

  async function save() {
    setSaving(true);
    setIssues({});
    try {
      const response = await fetch(`/api/content/${type}/${draft.slug}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      const data = (await response.json()) as { ok: boolean; issues?: { path: string; message: string }[]; message?: string };
      if (!response.ok || !data.ok) {
        const map: Record<string, string> = {};
        for (const issue of data.issues ?? []) map[issue.path] = issue.message;
        setIssues(map);
        toast('bad', data.message ?? `${data.issues?.length ?? 1} validation problem(s) — nothing was written.`);
        return;
      }
      toast('ok', 'Saved. Build to let the gate judge the page.');
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
          <p className="eyebrow">{type === 'capability' ? 'Capability' : 'Product'}</p>
          <h1>{draft.h1}</h1>
          <p>
            Every field the page renders. The build validates the same file: an icon name, a required field or a broken
            meta entry stops it before a page is emitted.
          </p>
        </div>
        <div className="page-head__actions">
          <a className="btn" href={`${SITE_URL}/${draft.slug}`} target="_blank" rel="noreferrer">
            Open page <Icon name="external" size={14} />
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save content'}
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
              <h2>Head</h2>
              <div className="spacer" />
              <span className="badge">/{draft.slug}</span>
            </div>
            <div className="card__body">
              <div className="grid-2">
                <Text label="Series number" value={draft.num} onChange={(value) => patch({ num: value })} error={err('num')} />
                {type === 'capability' ? (
                  <Text label="Nav label" value={draft.nav} onChange={(value) => patch({ nav: value })} error={err('nav')} />
                ) : (
                  <Text label="Product name" value={draft.name} onChange={(value) => patch({ name: value })} error={err('name')} />
                )}
              </div>

              <IconPicker label="Page icon" value={draft.icon} icons={icons} onChange={(name) => patch({ icon: name })} />

              <Text label="H1" value={draft.h1} onChange={(value) => patch({ h1: value })} error={err('h1')} />
              <Area label="Lead" value={draft.lead} onChange={(value) => patch({ lead: value })} error={err('lead')} rows={4} />

              {type === 'product' ? (
                <div className="grid-2">
                  <Text label="Domain" value={draft.domain} onChange={(value) => patch({ domain: value })} error={err('domain')} />
                  <Text label="Card line" value={draft.card} onChange={(value) => patch({ card: value })} error={err('card')} />
                </div>
              ) : null}
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Meta rail</h2>
              <span className="badge">{draft.meta.length}</span>
              <div className="spacer" />
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => patch({ meta: [...draft.meta, { key: 'New field', value: { kind: 'text', value: '' } }] })}
              >
                <Icon name="plus" size={14} /> Add row
              </button>
            </div>
            <div className="card__body">
              <div className="rows">
                {draft.meta.map((item: MetaItem, index) => (
                  <div className="link-row" key={index} style={{ gridTemplateColumns: 'minmax(110px,1fr) 110px minmax(130px,1.4fr) auto' }}>
                    <input
                      className="input"
                      value={item.key}
                      aria-label={`Meta ${index + 1} key`}
                      onChange={(event) =>
                        patch({
                          meta: draft.meta.map((row, i) => (i === index ? { ...row, key: event.target.value } : row)),
                        })
                      }
                    />
                    <select
                      className="select"
                      value={item.value.kind}
                      aria-label={`Meta ${index + 1} kind`}
                      onChange={(event) =>
                        patch({
                          meta: draft.meta.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  value:
                                    event.target.value === 'link'
                                      ? { kind: 'link', href: '/contact', label: '' }
                                      : { kind: 'text', value: '' },
                                }
                              : row,
                          ),
                        })
                      }
                    >
                      <option value="text">text</option>
                      <option value="link">link</option>
                    </select>
                    {item.value.kind === 'link' ? (
                      <span className="link-row" style={{ gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <input
                          className="input"
                          value={item.value.label}
                          placeholder="Label"
                          aria-label={`Meta ${index + 1} label`}
                          onChange={(event) =>
                            patch({
                              meta: draft.meta.map((row, i) =>
                                i === index && row.value.kind === 'link'
                                  ? { ...row, value: { ...row.value, label: event.target.value } }
                                  : row,
                              ),
                            })
                          }
                        />
                        <input
                          className="input"
                          value={item.value.href}
                          placeholder="/contact"
                          aria-label={`Meta ${index + 1} link`}
                          onChange={(event) =>
                            patch({
                              meta: draft.meta.map((row, i) =>
                                i === index && row.value.kind === 'link'
                                  ? { ...row, value: { ...row.value, href: event.target.value } }
                                  : row,
                              ),
                            })
                          }
                        />
                      </span>
                    ) : (
                      <input
                        className="input"
                        value={item.value.value}
                        aria-label={`Meta ${index + 1} value`}
                        onChange={(event) =>
                          patch({
                            meta: draft.meta.map((row, i) =>
                              i === index && row.value.kind === 'text'
                                ? { ...row, value: { ...row.value, value: event.target.value } }
                                : row,
                            ),
                          })
                        }
                      />
                    )}
                    <RowTools
                      index={index}
                      total={draft.meta.length}
                      label={`meta ${index + 1}`}
                      onMove={(direction) => patch({ meta: moveItem(draft.meta, index, direction) })}
                      onRemove={() => patch({ meta: draft.meta.filter((_, i) => i !== index) })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Problem</h2>
            </div>
            <div className="card__body">
              <Text label="Headline" value={draft.problemHead} onChange={(value) => patch({ problemHead: value })} error={err('problemHead')} />
              <StringRows
                label="Paragraphs"
                values={draft.problem}
                addLabel="Add paragraph"
                onChange={(values) => patch({ problem: values })}
              />
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>System map</h2>
            </div>
            <div className="card__body">
              <Text label="Core label" value={draft.mapCore} onChange={(value) => patch({ mapCore: value })} error={err('mapCore')} />
              <StringRows
                label="Nodes"
                values={draft.mapNodes}
                addLabel="Add node"
                onChange={(values) => patch({ mapNodes: values })}
              />
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>{type === 'capability' ? 'Deliverables' : 'Capability'}</h2>
              <span className="badge">{draft.items.length}</span>
              <div className="spacer" />
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => patch({ items: [...draft.items, { icon: 'i-check', title: '', body: '' }] })}
              >
                <Icon name="plus" size={14} /> Add item
              </button>
            </div>
            <div className="card__body">
              <div className="rows">
                {draft.items.map((item: ContentItem, index) => (
                  <div className="col" key={index}>
                    <div className="col__head">
                      <IconSelect
                        label={`Item ${index + 1} icon`}
                        value={item.icon}
                        icons={icons}
                        onChange={(name) =>
                          patch({ items: draft.items.map((row, i) => (i === index ? { ...row, icon: name } : row)) })
                        }
                      />
                      <div className="spacer" style={{ marginLeft: 'auto' }} />
                      <RowTools
                        index={index}
                        total={draft.items.length}
                        label={`item ${index + 1}`}
                        onMove={(direction) => patch({ items: moveItem(draft.items, index, direction) })}
                        onRemove={() => patch({ items: draft.items.filter((_, i) => i !== index) })}
                      />
                    </div>
                    <input
                      className="input"
                      value={item.title}
                      placeholder="Title"
                      aria-label={`Item ${index + 1} title`}
                      onChange={(event) =>
                        patch({ items: draft.items.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                      }
                    />
                    <textarea
                      className="textarea"
                      rows={2}
                      value={item.body}
                      placeholder="Body"
                      aria-label={`Item ${index + 1} body`}
                      onChange={(event) =>
                        patch({ items: draft.items.map((row, i) => (i === index ? { ...row, body: event.target.value } : row)) })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Rules</h2>
              <span className="badge">{draft.rules.length}</span>
              <div className="spacer" />
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => patch({ rules: [...draft.rules, { icon: 'i-flag', title: '', body: '' }] })}
              >
                <Icon name="plus" size={14} /> Add rule
              </button>
            </div>
            <div className="card__body">
              <div className="rows">
                {draft.rules.map((item: ContentItem, index) => (
                  <div className="col" key={index}>
                    <div className="col__head">
                      <IconSelect
                        label={`Rule ${index + 1} icon`}
                        value={item.icon}
                        icons={icons}
                        onChange={(name) =>
                          patch({ rules: draft.rules.map((row, i) => (i === index ? { ...row, icon: name } : row)) })
                        }
                      />
                      <div className="spacer" style={{ marginLeft: 'auto' }} />
                      <RowTools
                        index={index}
                        total={draft.rules.length}
                        label={`rule ${index + 1}`}
                        onMove={(direction) => patch({ rules: moveItem(draft.rules, index, direction) })}
                        onRemove={() => patch({ rules: draft.rules.filter((_, i) => i !== index) })}
                      />
                    </div>
                    <input
                      className="input"
                      value={item.title}
                      placeholder="Title"
                      aria-label={`Rule ${index + 1} title`}
                      onChange={(event) =>
                        patch({ rules: draft.rules.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                      }
                    />
                    <textarea
                      className="textarea"
                      rows={2}
                      value={item.body}
                      placeholder="Body"
                      aria-label={`Rule ${index + 1} body`}
                      onChange={(event) =>
                        patch({ rules: draft.rules.map((row, i) => (i === index ? { ...row, body: event.target.value } : row)) })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Related</h2>
              <span className="badge">{draft.related.length}</span>
              <div className="spacer" />
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => patch({ related: [...draft.related, { href: '/', label: '', num: '' }] })}
              >
                <Icon name="plus" size={14} /> Add link
              </button>
            </div>
            <div className="card__body">
              <div className="rows">
                {draft.related.map((item: RelatedItem, index) => (
                  <div className="link-row" key={index} style={{ gridTemplateColumns: '90px 1fr 1.2fr auto' }}>
                    <input
                      className="input"
                      value={item.num}
                      placeholder="C/02"
                      aria-label={`Related ${index + 1} number`}
                      onChange={(event) =>
                        patch({ related: draft.related.map((row, i) => (i === index ? { ...row, num: event.target.value } : row)) })
                      }
                    />
                    <input
                      className="input"
                      value={item.label}
                      placeholder="Label"
                      aria-label={`Related ${index + 1} label`}
                      onChange={(event) =>
                        patch({ related: draft.related.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)) })
                      }
                    />
                    <input
                      className="input"
                      value={item.href}
                      placeholder="/ecommerce"
                      aria-label={`Related ${index + 1} link`}
                      onChange={(event) =>
                        patch({ related: draft.related.map((row, i) => (i === index ? { ...row, href: event.target.value } : row)) })
                      }
                    />
                    <RowTools
                      index={index}
                      total={draft.related.length}
                      label={`related ${index + 1}`}
                      onMove={(direction) => patch({ related: moveItem(draft.related, index, direction) })}
                      onRemove={() => patch({ related: draft.related.filter((_, i) => i !== index) })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card__head">
              <h2>Stack</h2>
            </div>
            <div className="card__body">
              <StringRows
                label="Tags"
                values={draft.stack}
                addLabel="Add tag"
                onChange={(values) => patch({ stack: values })}
              />
              <Area label="Stack note" value={draft.stackNote} onChange={(value) => patch({ stackNote: value })} error={err('stackNote')} />
            </div>
          </section>

          {type === 'capability' ? (
            <section className="card">
              <div className="card__head">
                <h2>How it starts</h2>
              </div>
              <div className="card__body">
                <Area label="Start note" value={draft.start} onChange={(value) => patch({ start: value })} error={err('start')} />
              </div>
            </section>
          ) : (
            <section className="card">
              <div className="card__head">
                <h2>Built for</h2>
              </div>
              <div className="card__body">
                <StringRows
                  label="Entries"
                  values={draft.builtFor}
                  addLabel="Add entry"
                  onChange={(values) => patch({ builtFor: values })}
                />
              </div>
            </section>
          )}

          <section className="card">
            <div className="card__head">
              <h2>Slug</h2>
            </div>
            <div className="card__body">
              <p className="field__hint">
                <code className="mono">{draft.slug}</code> is the route and cannot change here — renaming a route moves a
                page and needs a redirect.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="dirty-bar">
        <span className="dirty-bar__text">{dirty ? 'Unsaved content changes.' : 'All changes saved.'}</span>
        <div className="dirty-bar__actions">
          <button type="button" className="btn" onClick={() => setDraft(content as unknown as Draft)} disabled={!dirty || saving}>
            Reset
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
            <Icon name="save" size={14} /> {saving ? 'Saving…' : 'Save content'}
          </button>
        </div>
      </div>
    </div>
  );
}
