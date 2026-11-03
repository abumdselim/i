'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap wrap--narrow">
      <div className="page-head">
        <div>
          <p className="eyebrow">Error</p>
          <h1>That screen could not load</h1>
          <p>
            The data file may be mid-write, or the route asked for something the manifest does not have. Nothing was
            changed by this error.
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card__body stack">
          <p className="mono" style={{ color: 'var(--bad)' }}>
            {error.message}
            {error.digest ? ` · ${error.digest}` : ''}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn--primary" onClick={reset}>
              <Icon name="refresh" size={14} /> Try again
            </button>
            <Link className="btn" href="/">
              Back to the dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
