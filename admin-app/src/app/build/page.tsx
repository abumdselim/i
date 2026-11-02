import { BuildPanel } from '@/components/BuildPanel';
import { lastBuild } from '@/lib/site';

export const dynamic = 'force-dynamic';

const FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export default async function BuildPage() {
  const build = await lastBuild();

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Build</p>
          <h1>Build &amp; preview</h1>
          <p>
            The build is the judge. It exports the site, compares every route with the frozen reference — text, markup,
            title, tokens — and lints. A green gate is the only proof that a change is safe.
          </p>
        </div>
      </div>

      <p className="field__hint" style={{ marginBottom: 16 }}>
        Last export: {build.at ? FORMAT.format(new Date(build.at)) : 'never'} ·{' '}
        {build.exists ? 'next-app/out is present' : 'next-app/out is missing'}
      </p>

      <BuildPanel />
    </div>
  );
}
