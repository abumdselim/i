import Link from 'next/link';
import { readCapabilities, readProducts } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function ContentIndex() {
  const [capabilities, products] = await Promise.all([readCapabilities(), readProducts()]);

  return (
    <div className="wrap">
      <div className="page-head">
        <div>
          <p className="eyebrow">Content</p>
          <h1>Capabilities &amp; products</h1>
          <p>
            The ten templated pages. Every field the page renders is editable here — head, meta rail, problem, system
            map, deliverables, rules, stack and related links.
          </p>
        </div>
      </div>

      <div className="split-2">
        <section className="card">
          <div className="card__head">
            <h2>Capabilities</h2>
            <span className="badge">{capabilities.length}</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>H1</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {capabilities.map((page) => (
                  <tr key={page.slug}>
                    <td className="route">/{page.slug}</td>
                    <td className="title">{page.h1}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link className="table__link" href={`/content/capability/${page.slug}`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Products</h2>
            <span className="badge">{products.length}</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>H1</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {products.map((page) => (
                  <tr key={page.slug}>
                    <td className="route">/{page.slug}</td>
                    <td className="title">{page.h1}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link className="table__link" href={`/content/product/${page.slug}`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
