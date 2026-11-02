import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons.generated';
import { Figure } from '@/components/sections/Figure';
import { SectionHead } from '@/components/sections/Blocks';
import { PRODUCTS } from '@/lib/content';
import { INDUSTRIES, STACK, type FigureName } from '@/lib/content/figures';
import { css } from '@/lib/css';

/* ------------------------------------------------------------------ cards */

interface CapabilityCard {
  href: string;
  num: string;
  figure: FigureName;
  title: string;
  body: string;
  tags: string[];
}

const CAPABILITY_CARDS: CapabilityCard[] = [
  {
    href: '/custom-software',
    num: 'C/01',
    figure: 'cap-custom',
    title: 'Custom software',
    body: 'Systems shaped around how your business operates, not around what a template can do.',
    tags: ['Domain modelling', 'APIs', 'Legacy migration'],
  },
  {
    href: '/ecommerce',
    num: 'C/02',
    figure: 'cap-commerce',
    title: 'Multi-vendor commerce',
    body: 'Marketplaces where vendors, commissions, payouts and fulfilment are first-class parts of the system.',
    tags: ['Payouts', 'Catalog', 'Checkout'],
  },
  {
    href: '/erp',
    num: 'C/03',
    figure: 'cap-erp',
    title: 'ERP and operations',
    body: 'One reconciled record across finance, inventory, purchasing and people.',
    tags: ['Finance', 'Inventory', 'Reporting'],
  },
  {
    href: '/web-platforms',
    num: 'C/04',
    figure: 'cap-web',
    title: 'Web platforms',
    body: 'Sites, portals and dashboards that carry the brand and hold up under real traffic.',
    tags: ['Design systems', 'CMS', 'Accessibility'],
  },
  {
    href: '/mobile-apps',
    num: 'C/05',
    figure: 'cap-mobile',
    title: 'Mobile products',
    body: 'iOS and Android apps that stay in step with the core system, online or off.',
    tags: ['Offline sync', 'Push', 'Store release'],
  },
  {
    href: '/automation',
    num: 'C/06',
    figure: 'cap-ai',
    title: 'Automation and models',
    body: 'Model-assisted workflows where the work is repetitive and measurable, with a review step built in.',
    tags: ['Retrieval', 'Workflows', 'Evaluation'],
  },
];

const LAYERS = [
  {
    icon: 'i-ai' as const,
    label: 'Model layer',
    text: 'Chosen against a sample of your real work, evaluated against your edge cases, with a fallback that is tested before launch.',
  },
  {
    icon: 'i-workflow' as const,
    label: 'Workflow layer',
    text: 'Volume goes to the machine. Exceptions come to a person, with the context to decide and a record of what was decided.',
  },
  {
    icon: 'i-web' as const,
    label: 'Interface layer',
    text: 'Answers show their sources. Suggestions stay editable. The screen says plainly what it does not know.',
  },
];

const STEPS = [
  { icon: 'i-search' as const, n: '01', title: 'Frame', body: 'Workshops, a system audit and a written definition of what success looks like.', meta: '1–2 weeks' },
  { icon: 'i-layers' as const, n: '02', title: 'Architect', body: 'Data model, integrations, interface direction and a scope you can budget against.', meta: '2–3 weeks' },
  { icon: 'i-custom' as const, n: '03', title: 'Build', body: 'Working software in two-week increments, reviewed live with your team.', meta: '6–16 weeks' },
  { icon: 'i-pulse' as const, n: '04', title: 'Operate', body: 'Monitoring, iteration and a handover your next team can actually use.', meta: 'Ongoing' },
];

interface Engagement {
  figure: FigureName;
  icon: IconName;
  num: string;
  title: string;
  body: string;
  spec: { label: string; value: string }[];
  delay?: string;
}

const ENGAGEMENTS: Engagement[] = [
  {
    figure: 'platform',
    icon: 'i-layers',
    num: 'M/01',
    title: 'Platform build',
    body: 'A complete system, from architecture to first release, owned end to end.',
    spec: [
      { label: 'Best for', value: 'New products, replacements' },
      { label: 'Team', value: '3–6 people' },
      { label: 'Length', value: '3–6 months' },
    ],
  },
  {
    figure: 'embedded',
    icon: 'i-users',
    num: 'M/02',
    title: 'Embedded team',
    body: 'Our engineers and designers inside your product organisation, working to your roadmap.',
    spec: [
      { label: 'Best for', value: 'Scaling delivery' },
      { label: 'Team', value: '1–4 people' },
      { label: 'Length', value: 'Rolling, monthly' },
    ],
    delay: '.06s',
  },
  {
    figure: 'ai',
    icon: 'i-gauge',
    num: 'M/03',
    title: 'Assessment and augmentation',
    body: 'A short, fixed-scope look at a system that already runs, and one improvement shipped.',
    spec: [
      { label: 'Best for', value: 'Existing platforms' },
      { label: 'Team', value: '2–3 people' },
      { label: 'Length', value: '4–10 weeks' },
    ],
    delay: '.12s',
  },
];

const STANDARDS = [
  { icon: 'i-users' as const, label: 'Accessibility', title: 'WCAG 2.2 AA is the floor', body: 'Keyboard, screen reader and contrast checks before anything ships.', delay: undefined },
  { icon: 'i-gauge' as const, label: 'Performance', title: 'Measured, not assumed', body: 'Budgets per page, tested on real devices rather than a desktop score.', delay: '.05s' },
  { icon: 'i-key' as const, label: 'Ownership', title: 'Yours from day one', body: 'Repositories, cloud accounts and keys are opened in your name.', delay: '.1s' },
  { icon: 'i-doc' as const, label: 'Handover', title: 'Documentation that works', body: 'Architecture notes, runbooks and a recorded walkthrough with every build.', delay: '.15s' },
];

const STACK_ICON: Record<string, IconName> = {
  Languages: 'i-custom',
  'Frameworks & runtimes': 'i-layers',
  'Data & storage': 'i-database',
  Infrastructure: 'i-plug',
};

/* --------------------------------------------------------------- sections */

export function Capabilities() {
  return (
    <section className="section" id="capabilities" data-od-id="capabilities" aria-labelledby="cap-title">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-layers"
          eyebrow="Capabilities"
          title="Six disciplines, one engineering standard."
          titleId="cap-title"
          lead="Most engagements combine several. A marketplace that needs an ERP bridge. An ERP that needs a field app. A product that needs its support desk relieved."
        >
          <Link className="linkarrow" href="/services">
            Read the capability notes <Icon name="i-arrow" />
          </Link>
        </SectionHead>

        <div className="caps" data-reveal>
          {CAPABILITY_CARDS.map((card) => (
            <Link className="cap" href={card.href} key={card.href}>
              <div className="cap__fig">
                <span className="cap__num">{card.num}</span>
                <Figure name={card.figure} />
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
                Read the capability
                <Icon name="i-arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Intelligence() {
  return (
    <section className="section ink-block" id="approach" data-od-id="intelligence" aria-labelledby="approach-title">
      <div className="shell">
        <div className="ai-grid">
          <div className="ai-copy">
            <p className="eyebrow eyebrow--i" data-reveal>
              <Icon name="i-ai" /> Where intelligence belongs
            </p>
            <h2 className="h2" id="approach-title" data-reveal style={css({ '--d': '.05s' })}>
              Intelligence belongs in the system, not in the pitch.
            </h2>
            <p className="body" data-reveal style={css({ '--d': '.1s' })}>
              A model earns its place where the work is repetitive, text-heavy and measurable. That is a narrower set of
              problems than the market suggests, and it is where we spend our effort: document handling, triage, search,
              drafting and first-line support.
            </p>
            <p className="body" data-reveal style={css({ '--d': '.14s' })}>
              The rest is ordinary engineering: clean data, a workflow with an exit, and an interface that shows where an
              answer came from. The model is rarely the difficult part. The system around it is.
            </p>
            <Link className="linkarrow" href="/approach" data-reveal style={css({ '--d': '.18s' })}>
              Read our approach <Icon name="i-arrow" />
            </Link>
          </div>

          <div
            className="stack"
            data-reveal
            style={css({ '--d': '.1s' })}
            role="img"
            aria-label="Three layers of a working system: model, workflow and interface, moving from automated to human-checked."
          >
            {LAYERS.map((layer) => (
              <div className="stack__row" key={layer.label}>
                <div className="stack__mark">
                  <i />
                </div>
                <div>
                  <div className="stack__label">
                    <Icon name={layer.icon} /> {layer.label}
                  </div>
                  <p className="stack__text">{layer.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductStrip() {
  return (
    <section className="section section--tint" id="products" data-od-id="products">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-cube"
          eyebrow="Products"
          title="Four products we build, run and own."
          lead="Each one started as a specific operational problem and now runs in production. They keep the studio honest about what software has to survive."
        >
          <Link className="linkarrow" href="/products">
            See all products <Icon name="i-arrow" />
          </Link>
        </SectionHead>
        <div className="prods">
          {PRODUCTS.map((product) => (
            <Link className="prod" href={`/${product.slug}`} data-reveal key={product.slug}>
              <div className="prod__top">
                <span className="tile tile--sm">
                  <Icon name={product.icon} />
                </span>
              </div>
              <h3 className="h3">{product.name}</h3>
              <p className="prod__line">{product.card}</p>
              <span className="cap__more" style={css({ marginTop: '18px' })}>
                Read more
                <Icon name="i-arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section className="section" id="industries" data-od-id="industries">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-building"
          eyebrow="Industries"
          title="Where our work sits today."
          lead="The sector changes the vocabulary and the regulation, not the engineering. These are the places our products and builds already run."
        />
        <div className="inds" data-reveal>
          {INDUSTRIES.map((industry) => (
            <div className="ind" key={industry.num}>
              <div className="ind__top">
                <Icon name={industry.icon as IconName} />
                <span className="mono">{industry.num}</span>
              </div>
              <h3>{industry.title}</h3>
              <p>{industry.body}</p>
            </div>
          ))}
          <div className="ind ind--cta">
            <div className="ind__top">
              <Icon name="i-help" />
            </div>
            <h3>Is your industry here?</h3>
            <p>If the problem is operational, it can be scoped. Tell us where the work piles up.</p>
            <Link className="linkarrow" href="/contact">
              Start a conversation
              <Icon name="i-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StackSection() {
  return (
    <section className="section section--tint" id="stack" data-od-id="stack">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-database"
          eyebrow="Stack"
          title="The tools we reach for."
          lead="A stack is a consequence of the problem, not an identity. We pick the smallest set of tools that can carry the system for the next five years, and we work in yours when it already fits."
        >
          <Link className="linkarrow" href="/approach">
            Why architecture comes first <Icon name="i-arrow" />
          </Link>
        </SectionHead>
        <div className="stackgroups" data-reveal>
          {STACK.map((group) => (
            <div className="stackgroup" key={group.group}>
              <h3 className="stackgroup__label">
                <Icon name={STACK_ICON[group.group] ?? 'i-layers'} /> {group.group}
              </h3>
              <div className="stackgrid">
                {group.items.map((item) => (
                  <div className="stackcell" key={`${group.group}-${item.label}`}>
                    <svg className="slogo" aria-hidden="true">
                      <use href={`#s-${item.slug}`} />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="section" id="process" data-od-id="process" aria-labelledby="process-title">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-workflow"
          eyebrow="Process"
          title="A short path from brief to production."
          titleId="process-title"
          lead="Discovery is fixed-scope. You leave the first phase with an architecture and a number, whether or not we build it together."
        >
          <Link className="linkarrow" href="/process">
            See the full process <Icon name="i-arrow" />
          </Link>
        </SectionHead>

        <ol className="steps">
          {STEPS.map((step, index) => (
            <li
              className="step"
              data-reveal
              style={index === 0 ? undefined : css({ '--d': `.${String(index * 6).padStart(2, '0')}s` })}
              key={step.n}
            >
              <div className="step__head">
                <span className="tile tile--sm">
                  <Icon name={step.icon} />
                </span>
                <span className="step__n">{step.n}</span>
              </div>
              <h3 className="h3">{step.title}</h3>
              <p>{step.body}</p>
              <span className="step__meta">{step.meta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Engagements() {
  return (
    <section className="section section--tint" id="engagements" data-od-id="engagements" aria-labelledby="eng-title">
      <div className="shell">
        <SectionHead
          eyebrowIcon="i-card"
          eyebrow="Engagements"
          title="Three ways to work with the studio."
          titleId="eng-title"
          lead="We keep the studio small on purpose. Every engagement has a named lead who also designs or writes code."
        >
          <Link className="linkarrow" href="/engagements">
            Compare the three <Icon name="i-arrow" />
          </Link>
        </SectionHead>

        <div className="engs">
          {ENGAGEMENTS.map((engagement) => (
            <article className="eng" data-reveal style={engagement.delay ? css({ '--d': engagement.delay }) : undefined} key={engagement.num}>
              <div className="eng__fig">
                <Figure name={engagement.figure} />
              </div>
              <div className="eng__body">
                <div className="eng__top">
                  <span className="tile tile--sm">
                    <Icon name={engagement.icon} />
                  </span>
                  <span className="mono">{engagement.num}</span>
                </div>
                <h3 className="h3">{engagement.title}</h3>
                <p>{engagement.body}</p>
                <dl className="eng__spec">
                  {engagement.spec.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link className="eng__link linkarrow" href="/engagements">
                  Read the model <Icon name="i-arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="standards" data-od-id="standards" style={css({ marginTop: 'clamp(48px,6vw,80px)' })}>
          {STANDARDS.map((standard) => (
            <div className="std" data-reveal style={standard.delay ? css({ '--d': standard.delay }) : undefined} key={standard.label}>
              <div className="std__top">
                <Icon name={standard.icon} />
                <span className="mono">{standard.label}</span>
              </div>
              <h3 className="h4">{standard.title}</h3>
              <p>{standard.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
