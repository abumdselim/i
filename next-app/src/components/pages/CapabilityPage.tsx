import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { DeliverableGrid, Panel, RelatedLinks, RulesList, SectionHead, TagList } from '@/components/sections/Blocks';
import { PageHead } from '@/components/sections/PageHead';
import { SystemMap } from '@/components/sections/SystemMap';
import { capabilityBySlug } from '@/lib/content';
import { css } from '@/lib/css';

/**
 * The capability page — six routes, one template.
 *
 * Everything that differs between them is data (`src/lib/content/capabilities.ts`);
 * everything that repeats is this component. The
 * five section headings below are the only copy that lives in code, and it is the
 * copy that is identical on all six pages.
 */
export function CapabilityPage({ slug }: { slug: string }) {
  const page = capabilityBySlug(slug);

  return (
    <>
      <PageHead
        titleId="cat-title"
        mark={page.icon}
        eyebrowIcon={page.icon}
        eyebrow="Capability"
        eyebrowTag={`C/${page.num}`}
        title={page.h1}
        lead={page.lead}
        meta={page.meta}
        actions={
          <p style={css({ marginTop: '26px' })}>
            <Link className="linkarrow" href="/services">
              All capabilities <Icon name="i-arrow" />
            </Link>
          </p>
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
            <SystemMap core={page.mapCore} nodes={page.mapNodes} foot={page.slug} />
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-check"
            eyebrow="Deliverables"
            title="What we build."
            lead="Six pieces of work, scoped in discovery and delivered in two-week increments. Anything that does not earn its place is cut before the build starts."
          />
          <DeliverableGrid items={page.items} />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-compass"
            eyebrow="Approach"
            title="How we work on it."
            lead="Three working rules that shape the build, and the stack we usually reach for."
          />
          <RulesList items={page.rules} prefix="A" />
          <div className="split" style={css({ marginTop: 'clamp(40px,5vw,64px)' })}>
            <Panel icon="i-layers" label="Typical stack">
              <TagList items={page.stack} />
              <p className="svc__note">{page.stackNote}</p>
            </Panel>
            <Panel icon="i-calendar" label="How it starts" delay=".06s">
              <p className="body" style={css({ marginBottom: '22px' })}>
                {page.start}
              </p>
              <Link className="linkarrow" href="/contact">
                Scope this work <Icon name="i-arrow" />
              </Link>
            </Panel>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-plug"
            eyebrow="Related"
            title="Usually built alongside."
            lead="Most engagements combine two or three capabilities. These are the pairs we see most often."
          />
          <RelatedLinks items={page.related} />
        </div>
      </section>
    </>
  );
}
