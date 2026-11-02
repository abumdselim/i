import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons';
import { SectionHead } from '@/components/sections/Blocks';
import { css } from '@/lib/css';

/**
 * The argument page (/approach): how the studio decides what to build. The
 * repeated rows — the on-page index, the "before we start" list, the two fit
 * columns, the three layers and the five rules — are typed arrays below.
 */

interface IndexLink {
  href: string;
  icon: IconName;
  label: string;
}

const PAGE_INDEX: IndexLink[] = [
  { href: '#system', icon: 'i-compass', label: 'System first' },
  { href: '#fit', icon: 'i-target', label: 'Fit' },
  { href: '#layers', icon: 'i-layers', label: 'Three layers' },
  { href: '#rules', icon: 'i-flag', label: 'Rules' },
];

interface SpecItem {
  icon: IconName;
  text: string;
}

const LOOK_FOR: SpecItem[] = [
  { icon: 'i-users', text: 'A problem that someone in the business owns, with the authority to change it.' },
  { icon: 'i-link', text: 'Access to the people who do the work today, not only the people who sponsor it.' },
  { icon: 'i-calendar', text: 'A deadline you can name, even if it is uncomfortable.' },
  { icon: 'i-workflow', text: 'Permission to change the process, not just the software around it.' },
];

interface FitEntry {
  icon: IconName;
  term: string;
  body: string;
}

/** One column of the fit section; the second carries the hollow mark, the muted variant and the stagger. */
interface FitColumn {
  title: string;
  hollow?: boolean;
  muted?: boolean;
  delay?: string;
  entries: FitEntry[];
}

const FIT_COLUMNS: FitColumn[] = [
  {
    title: 'Worth building',
    entries: [
      { icon: 'i-upload', term: 'Reading and routing documents', body: 'Invoices, claims, applications. High volume, consistent format, a person checking exceptions.' },
      { icon: 'i-search', term: 'Search across your own material', body: 'Contracts, policies, support history. The answer has to cite the passage it came from.' },
      { icon: 'i-pen', term: 'Drafting a first version', body: 'Proposals, replies, summaries. A person edits, and nothing leaves the building without review.' },
      { icon: 'i-help', term: 'First-line support', body: 'Repetitive questions with known answers, and escalation rules that stay explicit.' },
    ],
  },
  {
    title: 'Better solved another way',
    hollow: true,
    muted: true,
    delay: '.06s',
    entries: [
      { icon: 'i-shield', term: 'Decisions with money or safety attached', body: 'Pricing exceptions, credit, clinical or legal judgement. A person decides, and signs their name.' },
      { icon: 'i-gauge', term: 'Problems nobody can score', body: 'If the team cannot describe a good answer, there is no way to know whether the system works.' },
      { icon: 'i-workflow', term: 'Anything that must repeat exactly', body: 'Deterministic rules belong in code, where they can be tested and audited line by line.' },
      { icon: 'i-key', term: 'Data you would not show a new hire', body: 'Permission problems are not solved by a prompt, and access is not a feature we can add later.' },
    ],
  },
];

/** The square mark in a layer-card header: solid, half or outline. */
type LayerMark = 'sq' | 'sq sq--solid' | 'sq sq--half';

interface Layer {
  num: string;
  mark: LayerMark;
  title: string;
  body: string;
  points: string[];
  delay?: string;
}

const LAYERS: Layer[] = [
  {
    num: '01',
    mark: 'sq sq--solid',
    title: 'Model',
    body: 'Chosen against a sample of your real work, not a demo dataset. Evaluated on the cases your team already knows are hard, and replaced without a rewrite when something better arrives.',
    points: ['Model selection and cost modelling', 'Evaluation set with known answers', 'Fallback for outages and refusals'],
  },
  {
    num: '02',
    mark: 'sq sq--half',
    title: 'Workflow',
    body: 'Decides what happens next: queue, retry, review, escalate. Every automated path has an owner, a record, and a switch that turns it off without taking the system down.',
    points: ['Review queues and escalation', 'Audit trail per decision', 'Kill switch and rollback'],
    delay: '.06s',
  },
  {
    num: '03',
    mark: 'sq',
    title: 'Interface',
    body: 'Shows the work and its provenance. Sources, confidence and edit history are visible, and the screen never pretends to know more than the system does.',
    points: ['Citations and confidence cues', 'Editable output, kept as a draft', 'Empty and failure states written first'],
    delay: '.12s',
  },
];

interface Rule {
  icon: IconName;
  num: string;
  title: string;
  body: string;
}

const RULES: Rule[] = [
  { icon: 'i-approval', num: 'R/01', title: 'No decision without a reviewer', body: 'If a person cannot inspect an automated decision and reverse it, that decision does not go live. The reviewer sees the input, the reasoning and the record.' },
  { icon: 'i-gauge', num: 'R/02', title: 'Evaluation before launch', body: 'A set of cases with known correct answers, written with your team, run on every change. If the score drops, the release stops.' },
  { icon: 'i-database', num: 'R/03', title: 'Data before models', body: 'If the source records disagree, the first work is reconciliation. A better model over inconsistent data produces confident nonsense.' },
  { icon: 'i-sync', num: 'R/04', title: 'A fallback that has run', body: 'A path that has never been exercised in production is not a fallback. We test the failure case on purpose, during working hours.' },
  { icon: 'i-coin', num: 'R/05', title: 'Cost is a design constraint', body: 'Token cost and latency decide which approaches are viable. We model both before choosing, so the system is still affordable at ten times the volume.' },
];

export function ApproachBody() {
  return (
    <>
      <main id="main">

        <section className="page-head" data-od-id="page-head" aria-labelledby="approach-title">
          <div className="shell">
            <div className="page-head__grid">
              <div>
                <div className="page-head__mark"><Icon name="i-compass" /></div>
                <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-compass" /> Approach</p>
                <h1 className="display" id="approach-title" data-reveal style={css({ '--d': '.05s' })}>How we decide what to build.</h1>
              </div>
              <div data-reveal style={css({ '--d': '.1s' })}>
                <p className="lead">Most software is lost before it is written: the wrong problem, the wrong boundary, a data model that cannot carry the business as it grows. We spend the first phase on those decisions, and we write them down.</p>
              </div>
            </div>
            <nav className="page-index" aria-label="On this page">
              <span className="page-index__label mono">On this page</span>
              <ul>
                {PAGE_INDEX.map((item) => (
                  <li key={item.href}><a href={item.href}><Icon name={item.icon} />{item.label}</a></li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="section" id="system" data-od-id="system">
          <div className="shell">
            <div className="split">
              <div data-reveal>
                <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-compass" /> The system comes first</p>
                <h2 className="h2" style={css({ marginBottom: '22px' })}>Architecture is a business decision.</h2>
                <p className="body" style={css({ marginBottom: '16px' })}>A system is a set of agreements: what a customer is, what an order means, which record wins when two disagree, who is allowed to reverse a decision. Those agreements outlive every framework we might choose. When they are wrong, no amount of clean code rescues the product.</p>
                <p className="body" style={css({ marginBottom: '16px' })}>So we ask uncomfortable questions early. What happens when the payment provider is unavailable for an hour? What does the warehouse team do when the stock count is wrong? Who reviews an automated decision, and what do they see on screen? A build that skips these questions does not avoid them. It postpones them to a worse moment, usually the week after launch.</p>
                <p className="body">The output of that work is short and unglamorous: a written architecture, a scope, a list of risks and a number. You can take it to another team, or to your board, without asking our permission.</p>
              </div>
              <div className="contact-card" data-reveal style={css({ '--d': '.08s' })}>
                <div className="card-head">
                  <span className="tile tile--sm"><Icon name="i-check" /></span>
                  <h2 className="h2 card-head__title">What we look for before we start</h2>
                </div>
                <ul className="speclist speclist--tight" style={css({ borderTop: '0' })}>
                  {LOOK_FOR.map((item) => (
                    <li key={item.text}><Icon name={item.icon} /><span>{item.text}</span></li>
                  ))}
                </ul>
                <p style={css({ marginTop: '22px' })}><a className="linkarrow" href="/contact">Talk to us about yours
                  <Icon name="i-arrow" /></a></p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tint" id="fit" data-od-id="fit">
          <div className="shell">
            <SectionHead
              eyebrowIcon="i-target"
              eyebrow="Fit"
              title="Where a model helps, and where it gets in the way."
              lead="We are specific about this because most disappointing projects come from applying the technology to a problem it cannot hold: no sample data, no way to score the output, no reviewer in the loop."
            />

            <div className="fit">
              {FIT_COLUMNS.map((column) => (
                <div
                  className={column.muted ? 'fit__col fit__col--muted' : 'fit__col'}
                  data-reveal
                  style={column.delay ? css({ '--d': column.delay }) : undefined}
                  key={column.title}
                >
                  <h3 className="fit__title"><span className={column.hollow ? 'dot-mark dot-mark--hollow' : 'dot-mark'} aria-hidden="true"></span>{column.title}</h3>
                  <dl className="fit__list">
                    {column.entries.map((entry) => (
                      <div key={entry.term}>
                        <dt><Icon name={entry.icon} />{entry.term}</dt>
                        <dd>{entry.body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section ink-block" id="layers" data-od-id="layers" aria-labelledby="layers-title">
          <div className="shell">
            <div className="sec-head" style={css({ marginBottom: 'clamp(32px,4vw,52px)' })}>
              <div>
                <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-layers" /> Three layers</p>
                <h2 className="h2" id="layers-title" data-reveal style={css({ '--d': '.05s' })}>Designed together, or not at all.</h2>
              </div>
              <div className="sec-head__aside" data-reveal style={css({ '--d': '.1s' })}>
                <p className="lead">A working system needs all three. Most projects build one and hope the others follow.</p>
              </div>
            </div>

            <div className="layers">
              {LAYERS.map((layer) => (
                <div className="layer-card" data-reveal style={layer.delay ? css({ '--d': layer.delay }) : undefined} key={layer.num}>
                  <div className="layer-card__top"><span className="mono">{layer.num}</span><i className={layer.mark} aria-hidden="true"></i></div>
                  <h3 className="h3">{layer.title}</h3>
                  <p>{layer.body}</p>
                  <ul className="layer-card__list">
                    {layer.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="rules" data-od-id="rules">
          <div className="shell">
            <SectionHead
              eyebrowIcon="i-flag"
              eyebrow="Rules"
              title="Five rules we apply to every build."
              lead="These are working constraints, not values on a wall. They decide what gets built, what gets cut and when we say no."
            />

            <div className="rules" data-reveal>
              {RULES.map((rule) => (
                <div className="rule" key={rule.num}>
                  <div className="rule__id"><Icon name={rule.icon} /><span className="mono">{rule.num}</span></div>
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
