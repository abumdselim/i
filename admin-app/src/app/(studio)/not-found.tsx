import Link from 'next/link';
import { Icon } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="wrap wrap--narrow">
      <div className="page-head">
        <div>
          <p className="eyebrow">404</p>
          <h1>No such screen</h1>
          <p>
            The route is not in the studio: pages are addressed as <code className="mono">/pages/&lt;route&gt;</code>,
            content as <code className="mono">/content/&lt;capability|product&gt;/&lt;slug&gt;</code>.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link className="btn btn--primary" href="/pages">
          <Icon name="pages" size={15} /> All pages
        </Link>
        <Link className="btn" href="/">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
