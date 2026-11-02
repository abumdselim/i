'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from '@/lib/toast';
import { PREVIEW_URL } from '@/lib/urls';
import { Icon } from './icons';

interface BuildState {
  running: boolean;
  exitCode: number | null;
  startedAt: string | null;
  finishedAt: string | null;
}

const WIDTHS = [
  { label: '1440', width: 1440 },
  { label: '834', width: 834 },
  { label: '390', width: 390 },
];

interface GateRow {
  route: string;
  file: string;
  legacy: number;
  port: number;
  status: 'unchanged' | 'changed' | 'error';
}

interface GateResult {
  rows: GateRow[];
  ported: string | null;
  errors: number;
  warnings: number;
}

/**
 * The gate's own table, read back from its output: one row per route with the
 * two text lengths it compared, plus its ERR lines. The studio does not decide
 * whether a change is fine — it shows which routes the judge flagged.
 */
function parseGate(lines: string[]): GateResult | null {
  const rows: GateRow[] = [];
  const failed = new Set<string>();
  let ported: string | null = null;
  let errors = 0;
  let warnings = 0;

  for (const line of lines) {
    const row = /^(\/\S*)\s+(\S+\.html)\s+(\d+)\s+(\d+)\s*$/.exec(line);
    if (row) {
      rows.push({
        route: row[1],
        file: row[2],
        legacy: Number(row[3]),
        port: Number(row[4]),
        status: Number(row[3]) === Number(row[4]) ? 'unchanged' : 'changed',
      });
      continue;
    }
    const failure = /^\s*ERR\s+(\S+\.html):/.exec(line);
    if (failure) failed.add(failure[1]);

    const summary = /^ported:\s*(\S+)\s+warnings:\s*(\d+)\s+errors:\s*(\d+)/.exec(line.trim());
    if (summary) {
      ported = summary[1];
      warnings = Number(summary[2]);
      errors = Number(summary[3]);
    }
  }

  if (rows.length === 0 && !ported) return null;
  for (const row of rows) if (failed.has(row.file)) row.status = 'error';
  return { rows, ported, errors, warnings };
}

export function BuildPanel() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const terminal = useRef<HTMLPreElement>(null);
  const gate = useMemo(() => parseGate(lines), [lines]);

  const [previewOn, setPreviewOn] = useState(false);
  const [width, setWidth] = useState(1440);
  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const state = (await (await fetch('/api/build', { cache: 'no-store' })).json()) as BuildState;
        setRunning(state.running);
        setExitCode(state.exitCode);
        if (state.running) setLines(['A build is already running in another tab…']);
      } catch {
        /* the panel still works; the button will report the failure */
      }
      try {
        const status = (await (await fetch('/api/preview', { cache: 'no-store' })).json()) as { running: boolean };
        setPreviewOn(status.running);
      } catch {
        /* preview stays off */
      }
    })();
  }, []);

  useEffect(() => {
    const node = terminal.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  async function run() {
    if (running) return;
    setRunning(true);
    setExitCode(null);
    setLines(['$ npm run verify', '']);

    try {
      const response = await fetch('/api/build', { method: 'POST' });
      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        toast('bad', data.message ?? `Build refused (${response.status}).`);
        setRunning(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop() ?? '';

        const next: string[] = [];
        for (const part of parts) {
          if (part.startsWith('__EXIT__')) {
            const code = Number(part.replace('__EXIT__', '').trim());
            setExitCode(code);
            toast(code === 0 ? 'ok' : 'bad', code === 0 ? 'Gate green: 19/19 routes, no drift.' : `Build failed (exit ${code}).`);
            continue;
          }
          next.push(part);
        }
        if (next.length > 0) setLines((current) => [...current, ...next]);
      }

      if (buffer) setLines((current) => [...current, buffer]);
    } catch (error) {
      toast('bad', `Could not run the build: ${(error as Error).message}`);
    } finally {
      setRunning(false);
      setPreviewOn((on) => on);
      setFrameKey((key) => key + 1);
    }
  }

  async function togglePreview(next: boolean) {
    try {
      const response = await fetch('/api/preview', { method: next ? 'POST' : 'DELETE' });
      const data = (await response.json()) as { ok?: boolean; external?: boolean };
      setPreviewOn(Boolean(data.ok ?? next));
      if (next && data.external) toast('ok', 'A preview server was already running on 8080.');
      setFrameKey((key) => key + 1);
    } catch (error) {
      toast('bad', `Preview: ${(error as Error).message}`);
    }
  }

  const badge =
    exitCode === null ? (
      <span className="badge">{running ? 'running' : 'not run yet'}</span>
    ) : exitCode === 0 ? (
      <span className="badge badge--ok">exit 0 · green</span>
    ) : (
      <span className="badge badge--bad">exit {exitCode} · failed</span>
    );

  return (
    <div className="stack">
      <section className="card">
        <div className="card__head">
          <h2>Build &amp; verify</h2>
          {badge}
          <div className="spacer" />
          <span className="mono" style={{ color: 'var(--muted)' }}>
            next-app · npm run verify
          </span>
          <button type="button" className="btn btn--primary btn--sm" onClick={run} disabled={running}>
            <Icon name={running ? 'stop' : 'play'} size={14} /> {running ? 'Running…' : 'Run build'}
          </button>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <div className="terminal">
            <div className="terminal__bar">
              <span className="dot dot--ok" /> build · parity gate · lint
            </div>
            <pre className="terminal__body" ref={terminal}>
              {lines.length === 0 ? (
                <span className="terminal__empty">
                  No output yet. Run the build to export the site and compare every route with the frozen reference.
                </span>
              ) : (
                lines.map((line, index) => (
                  <span
                    key={index}
                    className={
                      /ERR|error|failed|✗/i.test(line)
                        ? 'terminal__line--err'
                        : /ported: 19\/19|0 errors/i.test(line)
                          ? 'terminal__line--ok'
                          : undefined
                    }
                  >
                    {line}
                    {'\n'}
                  </span>
                ))
              )}
            </pre>
          </div>
        </div>
      </section>

      {gate ? (
        <section className="card">
          <div className="card__head">
            <h2>Gate result</h2>
            <span className={`badge ${gate.errors === 0 ? 'badge--ok' : 'badge--bad'}`}>
              {gate.errors} error{gate.errors === 1 ? '' : 's'}
            </span>
            {gate.ported ? <span className="badge">ported {gate.ported}</span> : null}
            {gate.warnings > 0 ? <span className="badge badge--warn">{gate.warnings} warnings</span> : null}
            <div className="spacer" />
            <span className="mono" style={{ color: 'var(--muted)' }}>
              {gate.rows.filter((row) => row.status === 'unchanged').length}/{gate.rows.length} unchanged
            </span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>File</th>
                  <th>Legacy chars</th>
                  <th>Port chars</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {gate.rows
                  .filter((row) => row.status !== 'unchanged')
                  .map((row) => (
                    <tr key={row.route}>
                      <td className="route">{row.route}</td>
                      <td className="mono">{row.file}</td>
                      <td>{row.legacy}</td>
                      <td>{row.port}</td>
                      <td>
                        <span className={`badge ${row.status === 'error' ? 'badge--bad' : 'badge--warn'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {gate.rows.every((row) => row.status === 'unchanged') ? (
            <p className="empty">Every route matched the frozen reference. Nothing to review.</p>
          ) : (
            <p className="field__hint" style={{ padding: '0 18px 16px' }}>
              A changed row is an intended or unintended copy change; the gate refuses it until the baseline is approved
              (<code className="mono">scripts/approve.py</code>).
            </p>
          )}
        </section>
      ) : null}

      <section className="card">
        <div className="card__head">
          <h2>Built preview</h2>
          <span className={`badge ${previewOn ? 'badge--ok' : ''}`}>{previewOn ? 'serving' : 'stopped'}</span>
          <div className="spacer" />
          <div className="seg" role="group" aria-label="Viewport width">
            {WIDTHS.map((option) => (
              <button
                type="button"
                key={option.label}
                aria-pressed={width === option.width}
                onClick={() => setWidth(option.width)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--sm" onClick={() => setFrameKey((key) => key + 1)}>
            <Icon name="refresh" size={14} /> Refresh
          </button>
          <a className="btn btn--sm" href={PREVIEW_URL} target="_blank" rel="noreferrer">
            Open <Icon name="external" size={14} />
          </a>
          {previewOn ? (
            <button type="button" className="btn btn--sm btn--danger" onClick={() => togglePreview(false)}>
              Stop server
            </button>
          ) : (
            <button type="button" className="btn btn--sm" onClick={() => togglePreview(true)}>
              Start server
            </button>
          )}
        </div>
        <div className="card__body">
          {previewOn ? (
            <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
              <iframe
                key={frameKey}
                className="preview__frame"
                src={`${PREVIEW_URL}/?v=${frameKey}`}
                title="Built site preview"
                style={{ width, maxWidth: '100%' }}
              />
            </div>
          ) : (
            <div className="empty">
              <p>The preview server serves <code className="mono">next-app/out</code> on port 8080.</p>
              <p style={{ marginTop: 8 }}>
                <button type="button" className="btn btn--sm" onClick={() => togglePreview(true)}>
                  Start the preview server
                </button>
              </p>
            </div>
          )}
          <p className="field__hint" style={{ marginTop: 12 }}>
            The frame is the exported artefact, not the dev server. Its theme is the site&apos;s own toggle, inside the
            frame.
          </p>
        </div>
      </section>
    </div>
  );
}
