import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { SectionSlots } from '@/components/sections/SectionSlots';
import { PRODUCTS } from '@/lib/content';
import { css } from '@/lib/css';

/**
 * /products — the hub. Rendered from the same typed product content as the four
 * product pages, so a product cannot exist on one surface and be missing on the
 * other.
 */
export function ProductsHub() {
  const sections = {
    head: (
      <section className="page-head" data-od-id="page-head" aria-labelledby="prods-title">
        <div className="shell">
          <div className="page-head__grid">
            <div>
              <div className="page-head__mark">
                <Icon name="i-cube" />
              </div>
              <p className="eyebrow eyebrow--i" data-reveal>
                <Icon name="i-cube" /> Products
              </p>
              <h1 className="display" id="prods-title" data-reveal style={css({ '--d': '.05s' })}>
                Four products, built and run in-house.
              </h1>
            </div>
            <div data-reveal style={css({ '--d': '.1s' })}>
              <p className="lead">
                Each one started as a specific operational problem: a counter that cannot go offline, a pharmacy that
                needs the generic, a chamber that cannot miss a date, a document that must not leave the building.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    cards: (
      <section className="section">
        <div className="shell">
          <div className="prods">
            {PRODUCTS.map((product) => (
              <article className="prod" data-reveal key={product.slug}>
                <div className="prod__top">
                  <span className="tile tile--sm">
                    <Icon name={product.icon} />
                  </span>
                  <span className="prod__domain">{product.domain}</span>
                </div>
                <h3 className="h3">{product.name}</h3>
                <p className="prod__line">{product.card}</p>
                <div className="svc__stack" style={css({ marginTop: '6px' })}>
                  {product.items.slice(0, 3).map((item) => (
                    <span className="tag" key={item.title}>
                      {item.title}
                    </span>
                  ))}
                </div>
                <div className="prod__links">
                  <Link className="linkarrow" href={`/${product.slug}`}>
                    Read more
                    <Icon name="i-arrow" />
                  </Link>
                  <a
                    className="linkarrow"
                    href={`https://${product.domain}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Visit {product.domain}
                    <Icon name="i-arrow-ur" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    standard: (
      <section className="section">
        <div className="shell">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}>
                <Icon name="i-shield" /> One standard
              </p>
              <h2 className="h2" style={css({ marginBottom: '22px' })}>
                Products and client work share the same rules.
              </h2>
              <p className="body" style={css({ marginBottom: '16px' })}>
                A product is not a side project here. It is the same discipline applied to a problem we own: a written
                architecture, a fixed scope, and a system that has to survive its first thousand users without a
                rewrite.
              </p>
              <p className="body">
                That is also why the products are honest about their limits. Each one does a narrow set of things
                properly, and says so on its own page.
              </p>
            </div>
            <div className="contact-card" data-reveal style={css({ '--d': '.08s' })}>
              <h2 className="h2" style={css({ fontSize: 'var(--text-h4)', letterSpacing: '0', marginBottom: '14px' })}>
                What every product has in common
              </h2>
              <ul className="speclist speclist--tight" style={css({ borderTop: '0' })}>
                <li>
                  <Icon name="i-database" />
                  <span>Owner-operated infrastructure, with the data in our own accounts.</span>
                </li>
                <li>
                  <Icon name="i-sync" />
                  <span>Offline or degraded-network behaviour designed in, not bolted on.</span>
                </li>
                <li>
                  <Icon name="i-globe" />
                  <span>A published domain and a real support address.</span>
                </li>
                <li>
                  <Icon name="i-doc" />
                  <span>No feature that cannot be explained in one sentence.</span>
                </li>
              </ul>
              <p style={css({ marginTop: '22px' })}>
                <Link className="linkarrow" href="/approach">
                  Read the approach <Icon name="i-arrow" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main id="main">
      <SectionSlots route="/products" nodes={sections} />
    </main>
  );
}
