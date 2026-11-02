import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons.generated';
import { SectionHead } from '@/components/sections/Blocks';
import { css } from '@/lib/css';

/**
 * The capabilities index — /services.
 *
 * One page, six doors. The card titles below are this page's own copy and are
 * kept exactly as the legacy page worded them, even where a capability route
 * uses a different h1. The combinations rules use X/nn numbering, so they
 * cannot go through `RulesList` (A/D prefixes) and are rendered locally.
 */

interface CapabilityCard {
  href: string;
  num: string;
  icon: IconName;
  title: string;
  body: string;
  tags: string[];
}

const CAPABILITY_CARDS: CapabilityCard[] = [
  {
    href: '/custom-software',
    num: 'C/01',
    icon: 'i-custom',
    title: 'Custom software',
    body: 'For the process that no product can hold: a domain model, a service architecture, and internal tools that match how the business actually runs.',
    tags: ['Domain modelling', 'APIs', 'Legacy migration'],
  },
  {
    href: '/ecommerce',
    num: 'C/02',
    icon: 'i-commerce',
    title: 'Multi-vendor commerce',
    body: 'Marketplaces where vendors, commissions, payouts and fulfilment are first-class parts of the system, and the ledger reconciles before the storefront is drawn.',
    tags: ['Payouts', 'Catalogue', 'Checkout'],
  },
  {
    href: '/erp',
    num: 'C/03',
    icon: 'i-erp',
    title: 'ERP and operations',
    body: 'Finance, inventory, purchasing and people in one reconciled record, with reporting people open every morning rather than a quarterly project.',
    tags: ['Ledger', 'Inventory', 'Reporting'],
  },
  {
    href: '/web-platforms',
    num: 'C/04',
    icon: 'i-web',
    title: 'Web platforms',
    body: 'Sites, portals and dashboards where the design system is real, the content team can publish without a ticket, and the page weight was measured before launch.',
    tags: ['Design systems', 'CMS', 'Accessibility'],
  },
  {
    href: '/mobile-apps',
    num: 'C/05',
    icon: 'i-mobile',
    title: 'Mobile products',
    body: 'iOS and Android apps designed around the offline case first, with a sync policy, a release plan and monitoring that catches failures before users report them.',
    tags: ['Offline sync', 'Push', 'Release'],
  },
  {
    href: '/automation',
    num: 'C/06',
    icon: 'i-ai',
    title: 'Automation and models',
    body: 'Document handling, triage, search and drafting, placed inside the systems your team already uses, with review steps, evaluation and a way back.',
    tags: ['Retrieval', 'Workflows', 'Evaluation'],
  },
];

interface CombinationRule {
  icon: IconName;
  num: string;
  title: string;
  body: string;
}

const COMBINATION_RULES: CombinationRule[] = [
  {
    icon: 'i-ledger',
    num: 'X/01',
    title: 'Marketplace, with a real ledger',
    body: 'Vendor payouts, tax treatment and refunds modelled before the storefront. The commerce engine writes to an accounting structure your finance team recognises.',
  },
  {
    icon: 'i-mobile',
    num: 'X/02',
    title: 'ERP, with a field application',
    body: 'Stock, pricing and approvals that work in a warehouse with no signal, then reconcile when the device comes back online.',
  },
  {
    icon: 'i-doc',
    num: 'X/03',
    title: 'Portal, with document handling',
    body: 'A customer or partner portal where documents arrive, get read, and route to a person who decides. The review queue is part of the product, not an inbox.',
  },
];

interface PageIndexLink {
  href: string;
  icon: IconName;
  label: string;
}

const PAGE_INDEX: PageIndexLink[] = [
  { href: '#disciplines', icon: 'i-layers', label: 'Disciplines' },
  { href: '#combinations', icon: 'i-plug', label: 'Combinations' },
];

export function ServicesBody() {
  return (
    <>
      <main id="main">
        <section className="page-head" data-od-id="page-head" aria-labelledby="cap-title">
          <div className="shell">
            <div className="page-head__grid">
              <div>
                <div className="page-head__mark">
                  <Icon name="i-layers" />
                </div>
                <p className="eyebrow eyebrow--i" data-reveal>
                  <Icon name="i-layers" /> Capabilities
                </p>
                <h1 className="display" id="cap-title" data-reveal style={css({ '--d': '.05s' })}>
                  Six disciplines, one standard of work.
                </h1>
              </div>
              <div data-reveal style={css({ '--d': '.1s' })}>
                <p className="lead">
                  Each capability has its own page, because the questions inside them are different. Most engagements
                  combine two or three, and the seams between them are where the real work sits.
                </p>
              </div>
            </div>
            <nav className="page-index" aria-label="On this page">
              <span className="page-index__label mono">On this page</span>
              <ul>
                {PAGE_INDEX.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <Icon name={link.icon} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="section" id="disciplines" data-od-id="disciplines">
          <div className="shell">
            <div className="caps caps--2" data-reveal>
              {CAPABILITY_CARDS.map((card) => (
                <a className="cap cap--lg" href={card.href} key={card.href}>
                  <div className="cap__top">
                    <span className="tile">
                      <Icon name={card.icon} />
                    </span>
                    <span className="cap__num">{card.num}</span>
                  </div>
                  <h3 className="h3">{card.title}</h3>
                  <p>{card.body}</p>
                  <div className="cap__tags">
                    {card.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="cap__more">
                    Read the capability <Icon name="i-arrow" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tint" id="combinations" data-od-id="combinations">
          <div className="shell">
            <SectionHead
              eyebrowIcon="i-plug"
              eyebrow="Combinations"
              title="The seams are where projects fail."
              lead="Most systems are not one capability but three, joined badly. These are the combinations we are asked for most often."
            />
            <div className="rules" data-reveal>
              {COMBINATION_RULES.map((rule) => (
                <div className="rule" key={rule.num}>
                  <div className="rule__id">
                    <Icon name={rule.icon} />
                    <span className="mono">{rule.num}</span>
                  </div>
                  <h3 className="h4">{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
