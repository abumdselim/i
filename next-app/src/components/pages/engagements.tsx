import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons';
import { SectionHead } from '@/components/sections/Blocks';
import { SectionSlots } from '@/components/sections/SectionSlots';
import { css } from '@/lib/css';

/**
 * The engagements page: three ways to work together, how pricing works, what
 * both sides need to bring, and the questions asked before contracts. Each
 * model is one `svc` article driven by the `models` array. The pricing rows
 * keep local markup — `RulesList` numbers its items `A/…` or `D/…`, and here
 * the prefix is `P/…`.
 */

/** One link in the page-head index. */
interface PageLink {
  href: string;
  icon: IconName;
  label: string;
}

/** One row of the `eng__spec` list that closes each model. */
interface SpecRow {
  term: string;
  def: string;
}

/** One engagement model — one `svc` article per entry. */
interface Model {
  odId: string;
  num: string;
  name: string;
  title: string;
  icon: IconName;
  tag: string;
  lead: string;
  includes: string[];
  spec: SpecRow[];
  note: string;
  /** Set on the last model, which drops the article bottom margin. */
  flush?: boolean;
}

/** One pricing rule in the `rules` block. */
interface RuleItem {
  icon: IconName;
  num: string;
  title: string;
  body: string;
}

/** One question in the FAQ list; the details stay uncontrolled. */
interface FaqItem {
  q: string;
  a: string;
}

const toc: PageLink[] = [
  { href: '#models', icon: 'i-layers', label: 'Models' },
  { href: '#pricing', icon: 'i-coin', label: 'Pricing' },
  { href: '#expectations', icon: 'i-users', label: 'Expectations' },
  { href: '#eng-faq', icon: 'i-help', label: 'Questions' },
];

const models: Model[] = [
  {
    odId: 'model-build',
    num: '01',
    name: 'Platform build',
    title: 'A complete system, owned end to end.',
    icon: 'i-layers',
    tag: '3–6 months',
    lead: 'For a new product, or a replacement of the thing that has become the constraint. We take it from discovery to the first month in production, then hand over a system your team can run.',
    includes: [
      'Discovery, domain model and architecture',
      'Interface design and a working design system',
      'Engineering in two-week increments',
      'Testing, accessibility and performance checks',
      'Launch, migration and a support window',
      'Documentation, runbooks and a recorded walkthrough',
    ],
    spec: [
      { term: 'Team', def: '3–6 people' },
      { term: 'Length', def: '3–6 months' },
      { term: 'Billing', def: 'Milestones' },
      { term: 'Best for', def: 'New products, replacements' },
    ],
    note: 'The most common first engagement, and the one where we carry the most risk. We price it accordingly and put a named lead on it.',
  },
  {
    odId: 'model-embedded',
    num: '02',
    name: 'Embedded team',
    title: 'Our people inside your product organisation.',
    icon: 'i-users',
    tag: 'Monthly',
    lead: 'For a team that already has a roadmap and needs senior hands on it, without a procurement cycle for every decision. We join your rituals and work to your priorities.',
    includes: [
      'One to four engineers or designers',
      'Code review and architecture support',
      'Release ownership, where you want it',
      'A written update every week',
      'Your board, your standup, your definition of done',
    ],
    spec: [
      { term: 'Team', def: '1–4 people' },
      { term: 'Length', def: 'Rolling, monthly' },
      { term: 'Billing', def: 'Monthly' },
      { term: 'Best for', def: 'Scaling delivery' },
    ],
    note: 'We ask for a named technical owner on your side. Without one, embedded work quietly turns into consulting, which is a different service and a worse deal.',
  },
  {
    odId: 'model-assessment',
    num: '03',
    name: 'Assessment & augmentation',
    title: 'A short, fixed-scope look at what you run.',
    icon: 'i-gauge',
    tag: '4–10 weeks',
    lead: 'For a system in production that has become slow, expensive or difficult to change. We audit it, choose one improvement that pays for itself, and ship it.',
    includes: [
      'Architecture and running-cost audit',
      'Data quality and reconciliation review',
      'One workflow shipped to production',
      'An evaluation harness, where models are involved',
      'A written recommendation and a costed roadmap',
    ],
    spec: [
      { term: 'Team', def: '2–3 people' },
      { term: 'Length', def: '4–10 weeks' },
      { term: 'Billing', def: 'Fixed fee' },
      { term: 'Best for', def: 'Existing platforms' },
    ],
    note: 'You keep the audit whether or not you continue with us. That is the point of doing it this way.',
    flush: true,
  },
];

const pricing: RuleItem[] = [
  {
    icon: 'i-search',
    num: 'P/01',
    title: 'Discovery',
    body: 'A fixed fee for one to two weeks. Credited against the build if you continue, so the work is not paid for twice.',
  },
  {
    icon: 'i-layers',
    num: 'P/02',
    title: 'Build',
    body: 'Milestone-based against a written scope. Three or four milestones, invoiced on acceptance rather than on effort.',
  },
  {
    icon: 'i-users',
    num: 'P/03',
    title: 'Embedded',
    body: 'Monthly, with thirty days notice. Enough commitment to plan around, short enough that a stop is a decision rather than a project.',
  },
];

/** What the client side has to bring for an engagement to work. */
const needs: string[] = [
  'A decision-maker in the room, not on a mailing list',
  'Access to the people who do the work today',
  'A named technical contact for the build',
  'Repositories and documentation, where they exist',
  'Permission to cut scope that does not serve the goal',
];

const faqs: FaqItem[] = [
  {
    q: 'Who owns the code and the infrastructure?',
    a: 'You do. Repositories, cloud accounts and keys are opened in your name from the first week. There is no licence fee to keep using what we built, and no dependency on our hosting.',
  },
  {
    q: 'What happens if the scope changes?',
    a: 'We write a change note: what is added, what it costs, what it does to the date. It needs your written approval before work starts. Scope that is removed is credited at the same rate.',
  },
  {
    q: 'Can you work alongside another agency?',
    a: 'Often. The arrangement works when the boundary is explicit: which system each team owns, how releases are coordinated, and who decides when the two disagree.',
  },
  {
    q: 'Do you take small projects?',
    a: 'Assessments start at four weeks, which is the smallest piece of work we can do properly. Below that, we are usually the wrong choice and will say so.',
  },
];

export function EngagementsBody() {
  const sections = {
    head: (
      <section className="page-head" data-od-id="page-head" aria-labelledby="eng-title">
        <div className="shell">
          <div className="page-head__grid">
            <div>
              <div className="page-head__mark"><Icon name="i-card" /></div>
              <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-card" /> Engagements</p>
              <h1 className="display" id="eng-title" data-reveal style={css({ '--d': '.05s' })}>Three ways to work together.</h1>
            </div>
            <div data-reveal style={css({ '--d': '.1s' })}>
              <p className="lead">The shape of an engagement should follow the problem, not a sales target. These are the three we run, what each one is for, and what it asks of your team as well as your budget.</p>
            </div>
          </div>
          <nav className="page-index" aria-label="On this page">
            <span className="page-index__label mono">On this page</span>
            <ul>
              {toc.map((item) => (
                <li key={item.href}><a href={item.href}><Icon name={item.icon} />{item.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    ),
    models: (
      <section className="section" id="models" data-od-id="models">
        <div className="shell">
          {models.map((model) => (
            <article className="svc" data-od-id={model.odId} key={model.odId} style={model.flush ? css({ marginBottom: '0' }) : undefined}>
              <div className="svc__head">
                <div>
                  <span className="mono">{`M/${model.num} — ${model.name}`}</span>
                  <h2 className="h2">{model.title}</h2>
                </div>
                <div className="svc__icon">
                  <span className="tile"><Icon name={model.icon} /></span>
                  <span className="tag">{model.tag}</span>
                </div>
              </div>
              <p className="lead">{model.lead}</p>
              <div className="svc__cols">
                <div>
                  <h3 className="svc__label"><Icon name="i-check" /> What is included</h3>
                  <ul className="svc__list">
                    {model.includes.map((item) => (
                      <li key={item}><Icon name="i-check" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="svc__label"><Icon name="i-gauge" /> The shape</h3>
                  <dl className="eng__spec">
                    {model.spec.map((row) => (
                      <div key={row.term}><dt>{row.term}</dt><dd>{row.def}</dd></div>
                    ))}
                  </dl>
                  <p className="svc__note">{model.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    ),
    pricing: (
      <section className="section section--tint" id="pricing" data-od-id="pricing">
        <div className="shell">
          <SectionHead
            eyebrowIcon="i-coin"
            eyebrow="Money"
            title="How pricing works."
            lead="No hourly billing for thinking, and no quote before we have read the system. Three models, each with a different risk profile."
          />
          <div className="rules" data-reveal>
            {pricing.map((rule) => (
              <div className="rule" key={rule.num}>
                <div className="rule__id"><Icon name={rule.icon} /><span className="mono">{rule.num}</span></div>
                <h3 className="h4">{rule.title}</h3>
                <p>{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    expectations: (
      <section className="section" id="expectations" data-od-id="expectations">
        <div className="shell">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-users" /> What we need</p>
              <h2 className="h2" style={css({ marginBottom: '24px' })}>Engagements that work need both sides.</h2>
              <ul className="svc__list">
                {needs.map((item) => (
                  <li key={item}><Icon name="i-check" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div data-reveal style={css({ '--d': '.08s' })}>
              <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-doc" /> Contracts</p>
              <h2 className="h2" style={css({ marginBottom: '24px' })}>Plain terms, in writing.</h2>
              <p className="body" style={css({ marginBottom: '16px' })}>We sign your NDA and your master agreement, or provide ours. Work is governed by the contract we both sign, not by a proposal deck.</p>
              <p className="body" style={css({ marginBottom: '26px' })}>Deliverables, acceptance criteria and payment terms are stated in the same document. If a change is needed, we write a change note with the cost and the effect on the date before any work starts on it.</p>
              <Link className="linkarrow" href="/process">See how a build runs<Icon name="i-arrow" /></Link>
            </div>
          </div>
        </div>
      </section>
    ),
    faq: (
      <section className="section section--tint" id="eng-faq" data-od-id="eng-faq">
        <div className="shell">
          <div className="faq">
            <div className="faq__aside">
              <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-help" /> Questions</p>
              <h2 className="h2" data-reveal style={css({ '--d': '.05s' })}>Asked before contracts.</h2>
              <p className="body" data-reveal style={css({ '--d': '.1s' })}>Something not covered here? Write to <a className="textlink" href="mailto:hello@intactic.net">hello@intactic.net</a> and you will get a direct answer.</p>
            </div>
            <div className="faq__list" data-reveal>
              {faqs.map((faq) => (
                <details className="faq__item" key={faq.q}>
                  <summary>{faq.q}<span className="pm" aria-hidden="true"></span></summary>
                  <div className="faq__body">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main id="main">
      <SectionSlots route="/engagements" nodes={sections} />
    </main>
  );
}
