import Link from 'next/link';
import { Icon } from '@/components/icons';
import { recentCommits, workingTree } from '@/lib/git';

export const dynamic = 'force-dynamic';

const STATUS: Record<string, { label: string; tone: string }> = {
  M: { label: 'modified', tone: 'badge--warn' },
  A: { label: 'added', tone: 'badge--ok' },
  D: { label: 'deleted', tone: 'badge--bad' },
  R: { label: 'renamed', tone: 'badge' },
  '??': { label: 'untracked', tone: 'badge--accent' },
};

export default async function ChangesPage() {
  const [tree, log] = await Promise.all([workingTree(), recentCommits(8)]);

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Changes</h1>
          <p>
            What the studio has written since the last commit, and what the last commits were. Read-only: changes are
            committed in a terminal, and published only after <code className="mono">npm run verify</code> is green.
          </p>
        </div>
      </div>

      <div className="split-2">
        <section className="card">
          <div className="card__head">
            <h2>Working tree</h2>
            <span className={`badge ${tree.files.length === 0 ? 'badge--ok' : 'badge--warn'}`}>
              {tree.files.length === 0 ? 'clean' : `${tree.files.length} file${tree.files.length === 1 ? '' : 's'}`}
            </span>
            <div className="spacer" />
            <span className="mono" style={{ color: 'var(--muted)' }}>
              git status
            </span>
          </div>

          {tree.error ? (
            <p className="empty">{tree.error}</p>
          ) : tree.files.length === 0 ? (
            <p className="empty">Nothing uncommitted. The panel&apos;s saves are all in the last commit.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>File</th>
                    <th className="col-area">Area</th>
                    <th aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  {tree.files.map((file) => {
                    const status = STATUS[file.code] ?? { label: file.code, tone: 'badge' };
                    return (
                      <tr key={file.path}>
                        <td>
                          <span className={`badge ${status.tone}`}>{status.label}</span>
                        </td>
                        <td className="mono file">{file.path}</td>
                        <td className="col-area">{file.label}</td>
                        <td style={{ textAlign: 'right' }}>
                          {file.href ? (
                            <Link className="table__link" href={file.href}>
                              Open
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Recent commits</h2>
            <div className="spacer" />
            <span className="mono" style={{ color: 'var(--muted)' }}>
              git log
            </span>
          </div>
          <div className="card__body">
            {log.error ? (
              <p className="empty">{log.error}</p>
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
      </div>

      <div className="rule" />

      <section className="card">
        <div className="card__body callout">
          <Icon name="alert" size={18} />
          <div>
            <b>The studio edits; it does not build or deploy.</b>
            <p>
              Before publishing, run <code className="mono">npm run verify</code> in <code className="mono">next-app</code>:
              it exports the site and compares every route with the frozen reference. A red gate means the change is not
              approved yet — <code className="mono">scripts/approve.py</code> is the only way to move the baseline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
