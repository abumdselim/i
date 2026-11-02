import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { DeliverableGrid, Panel, RelatedLinks, RulesList, SectionHead, TagList } from '@/components/sections/Blocks';
import { PageHead } from '@/components/sections/PageHead';
import { SystemMap } from '@/components/sections/SystemMap';
import { productBySlug } from '@/lib/content';
import { css } from '@/lib/css';

/**
 * The product page — four routes, one template.
 *
 * Same skeleton as the capability page, with three product-specific pieces: the
 * external domain action, the "Built for" list in place of the start note, and
 * the series tag (P/01).
 */
export function ProductPage({ slug }: { slug: string }) {
  const page = productBySlug(slug);

  return (
    <>
      <PageHead
        titleId="prod-title"
        mark={page.icon}
        eyebrowIcon={page.icon}
        eyebrow="Product"
        eyebrowTag={`P/${page.num}`}
        title={page.h1}
        lead={page.lead}
        meta={page.meta}
        actions={
          <div className="prod-head__actions">
            <a className="btn btn--primary" href={`https://${page.domain}`} target="_blank" rel="noopener">
              Visit {page.domain} <Icon name="i-arrow-ur" />
            </a>
            <Link className="linkarrow" href="/products">
              All products <Icon name="i-arrow" />
            </Link>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}>
                <Icon name="i-target" /> The problem
              </p>
              <h2 className="h2" style={css({ marginBottom: '22px' })}>
                {page.problemHead}
              </h2>
              {page.problem.map((paragraph) => (
                <p className="body" style={css({ marginBottom: '16px' })} key={paragraph.slice(0, 32)}>
                  {paragraph}
                </p>
              ))}
            </div>
            <SystemMap core={page.mapCore} nodes={page.mapNodes} foot={page.domain} />
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-check"
            eyebrow="Capability"
            title="What it does."
            lead="Six parts of the product that do the daily work. Everything else supports these."
          />
          <DeliverableGrid items={page.items} />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-gauge"
            eyebrow="Engineering"
            title="How it is built."
            lead="Three decisions that shape the product, and the stack that carries them."
          />
          <RulesList items={page.rules} prefix="D" />
          <div className="split" style={css({ marginTop: 'clamp(40px,5vw,64px)' })}>
            <Panel icon="i-layers" label="Stack">
              <TagList items={page.stack} />
              <p className="svc__note">{page.stackNote}</p>
            </Panel>
            <Panel icon="i-users" label="Built for" delay=".06s">
              <ul className="svc__list">
                {page.builtFor.map((entry) => (
                  <li key={entry}>
                    <Icon name="i-check" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-cube"
            eyebrow="More products"
            title="Built by the same team."
            lead="Different problems, one engineering standard. Each product runs in production today."
          />
          <RelatedLinks items={page.related} />
        </div>
      </section>
    </>
  );
}
