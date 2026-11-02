import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons.generated';
import { SectionHead } from '@/components/sections/Blocks';
import { css } from '@/lib/css';

/**
 * The process page: the four phases of a build, the weekly working rhythm and
 * the first month after launch. Each phase is one `svc` article driven by the
 * `phases` array. The rhythm rows keep local markup — `RulesList` numbers its
 * items `A/…` or `D/…`, and here the prefix is `W/…`.
 */

/** One link in the page-head index. */
interface PageLink {
  href: string;
  icon: IconName;
  label: string;
}

/** One row of the `eng__spec` list that closes each phase. */
interface SpecRow {
  term: string;
  def: string;
}

/** One phase of the process — one `svc` article per entry. */
interface Phase {
  id: string;
  num: string;
  name: string;
  title: string;
  icon: IconName;
  tag: string;
  lead: string;
  happens: string[];
  spec: SpecRow[];
  note: string;
  /** Set on the last phase, which drops the article bottom margin. */
  flush?: boolean;
}

/** One habit in the working-rhythm `rules` block. */
interface RuleItem {
  icon: IconName;
  num: string;
  title: string;
  body: string;
}

/** One row of the handover pack checklist. */
interface PackItem {
  icon: IconName;
  text: string;
}

const toc: PageLink[] = [
  { href: '#phase-frame', icon: 'i-search', label: 'Frame' },
  { href: '#phase-architect', icon: 'i-layers', label: 'Architect' },
  { href: '#phase-build', icon: 'i-custom', label: 'Build' },
  { href: '#phase-operate', icon: 'i-pulse', label: 'Operate' },
  { href: '#ceremonies', icon: 'i-clock', label: 'Rhythm' },
  { href: '#after-launch', icon: 'i-doc', label: 'Handover' },
];

const phases: Phase[] = [
  {
    id: 'phase-frame',
    num: '01',
    name: 'Frame',
    title: 'Understand the system as it is.',
    icon: 'i-search',
    tag: '1–2 weeks',
    lead: 'Workshops with the people who do the work, an audit of what already exists, and a written definition of success that both sides sign. This phase is where a project is usually saved.',
    happens: [
      'Interviews with operators, not only sponsors',
      'Audit of the current system, data and contracts',
      'Constraints: regulatory, commercial, technical',
      'Success measures that can be checked later',
      'A written brief and a go or no-go decision',
    ],
    spec: [
      { term: 'You get', def: 'A written brief' },
      { term: 'Your time', def: '4–6 hours' },
      { term: 'Fee', def: 'Fixed' },
    ],
    note: 'If we are not the right team for the problem, we say so here. It is cheaper for both of us than discovering it in month three.',
  },
  {
    id: 'phase-architect',
    num: '02',
    name: 'Architect',
    title: 'Decide before building.',
    icon: 'i-layers',
    tag: '2–3 weeks',
    lead: 'Domain model, integrations, interface direction, risk register and an estimate. The output is a document another team could build from, which is the test of whether it is finished.',
    happens: [
      'Domain model and state transitions',
      'Integration map with failure behaviour',
      'Interface direction and two key screens',
      'Risk register, ranked by cost of being wrong',
      'A fixed-scope proposal with milestones',
    ],
    spec: [
      { term: 'You get', def: 'An architecture pack' },
      { term: 'Your time', def: '6–10 hours' },
      { term: 'Fee', def: 'Fixed, credited' },
    ],
    note: 'Most disagreements surface here, while they are still cheap to settle. The fee is credited against the build if you continue.',
  },
  {
    id: 'phase-build',
    num: '03',
    name: 'Build',
    title: 'Ship in two-week increments.',
    icon: 'i-custom',
    tag: '6–16 weeks',
    lead: 'Working software on a staging environment at the end of every increment, reviewed live with your team. Tests and documentation move with the code, not after it.',
    happens: [
      'Two-week increments with a demo on Friday',
      'A staging environment you can reach at any time',
      'Automated tests for the rules that cost money',
      'Accessibility and performance checks per increment',
      'Documentation written alongside the feature',
    ],
    spec: [
      { term: 'You get', def: 'Working software' },
      { term: 'Your time', def: '2–3 hours a week' },
      { term: 'Cadence', def: 'Two weeks' },
    ],
    note: 'No status meeting that could have been a demo. If a date moves, you hear it the week we know, not the week it lands.',
  },
  {
    id: 'phase-operate',
    num: '04',
    name: 'Operate',
    title: 'Keep it working, then hand it over.',
    icon: 'i-pulse',
    tag: 'Ongoing',
    lead: 'Monitoring, iteration and a handover pack your next team can use. Most clients keep a light retainer afterwards; some take the keys and run it themselves.',
    happens: [
      'Monitoring, alerts and an on-call rota for launch',
      'Monthly iteration against a prioritised list',
      'Model and workflow evaluation, where relevant',
      'Runbooks for the failures we have already seen',
      'A recorded walkthrough and a handover session',
    ],
    spec: [
      { term: 'You get', def: 'A system you can run' },
      { term: 'Support', def: '30 days included' },
      { term: 'Retainer', def: 'Optional, monthly' },
    ],
    note: 'The handover is not an upsell. It is part of the build, priced into the milestone it belongs to.',
    flush: true,
  },
];

const rhythm: RuleItem[] = [
  {
    icon: 'i-web',
    num: 'W/01',
    title: 'Friday demo',
    body: 'Working software, not slides. Fifteen minutes, recorded if you cannot attend, with the next increment agreed on the call.',
  },
  {
    icon: 'i-link',
    num: 'W/02',
    title: 'One channel',
    body: 'A shared channel with the people building the work. Questions get answered by the person who knows, not by an account manager.',
  },
  {
    icon: 'i-doc',
    num: 'W/03',
    title: 'Written decisions',
    body: 'Anything that changes scope, architecture or a date is written down in the repository, with the reasoning and the date.',
  },
  {
    icon: 'i-flag',
    num: 'W/04',
    title: 'Bad news early',
    body: 'Risks are raised when they are suspected, not when they are confirmed. You will hear about a slipping date before it slips.',
  },
];

const handoverPack: PackItem[] = [
  { icon: 'i-doc', text: 'Architecture notes, written for the next engineer rather than the client.' },
  { icon: 'i-workflow', text: 'Runbooks for the failures we have seen, and the ones we expect.' },
  { icon: 'i-web', text: 'A recorded walkthrough of the system, screen by screen.' },
  { icon: 'i-key', text: 'Access, ownership and billing in your name, verified together.' },
  { icon: 'i-users', text: 'A session with the team taking over, questions included.' },
];

export function ProcessBody() {
  return (
    <>
      <main id="main">
        <section className="page-head" data-od-id="page-head" aria-labelledby="process-title">
          <div className="shell">
            <div className="page-head__grid">
              <div>
                <div className="page-head__mark"><Icon name="i-workflow" /></div>
                <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-workflow" /> Process</p>
                <h1 className="display" id="process-title" data-reveal style={css({ '--d': '.05s' })}>From first call to production.</h1>
              </div>
              <div data-reveal style={css({ '--d': '.1s' })}>
                <p className="lead">Four phases, each with a written output. You can stop at the end of any of them and keep what was produced, including the architecture.</p>
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

        <section className="section" id="phases" data-od-id="phases">
          <div className="shell">
            {phases.map((phase) => (
              <article className="svc" id={phase.id} data-od-id={phase.id} key={phase.id} style={phase.flush ? css({ marginBottom: '0' }) : undefined}>
                <div className="svc__head">
                  <div>
                    <span className="mono">{`P/${phase.num} — ${phase.name}`}</span>
                    <h2 className="h2">{phase.title}</h2>
                  </div>
                  <div className="svc__icon">
                    <span className="tile"><Icon name={phase.icon} /></span>
                    <span className="tag">{phase.tag}</span>
                  </div>
                </div>
                <p className="lead">{phase.lead}</p>
                <div className="svc__cols">
                  <div>
                    <h3 className="svc__label"><Icon name="i-check" /> What happens</h3>
                    <ul className="svc__list">
                      {phase.happens.map((item) => (
                        <li key={item}><Icon name="i-check" /><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="svc__label"><Icon name="i-doc" /> At the end</h3>
                    <dl className="eng__spec">
                      {phase.spec.map((row) => (
                        <div key={row.term}><dt>{row.term}</dt><dd>{row.def}</dd></div>
                      ))}
                    </dl>
                    <p className="svc__note">{phase.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--tint" id="ceremonies" data-od-id="ceremonies">
          <div className="shell">
            <SectionHead
              eyebrowIcon="i-clock"
              eyebrow="Working rhythm"
              title="What a week looks like."
              lead="Four habits that make a build predictable. None of them require a project manager to relay messages."
            />
            <div className="rules" data-reveal>
              {rhythm.map((rule) => (
                <div className="rule" key={rule.num}>
                  <div className="rule__id"><Icon name={rule.icon} /><span className="mono">{rule.num}</span></div>
                  <h3 className="h4">{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="after-launch" data-od-id="after-launch">
          <div className="shell">
            <div className="split">
              <div data-reveal>
                <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-pulse" /> After launch</p>
                <h2 className="h2" style={css({ marginBottom: '22px' })}>The first month decides the review.</h2>
                <p className="body" style={css({ marginBottom: '16px' })}>Every build includes thirty days of support: fixes at no cost, a monitored production environment, and someone who answers when the pager goes off.</p>
                <p className="body">After that, most clients choose between a light monthly retainer for iteration and evaluation, or the handover pack and their own team. Both are normal endings, and we plan for either from the start.</p>
              </div>
              <div className="contact-card" data-reveal style={css({ '--d': '.08s' })}>
                <div className="card-head">
                  <span className="tile tile--sm"><Icon name="i-key" /></span>
                  <h2 className="h2 card-head__title">The handover pack</h2>
                </div>
                <ul className="speclist speclist--tight" style={css({ borderTop: '0' })}>
                  {handoverPack.map((item) => (
                    <li key={item.text}><Icon name={item.icon} /><span>{item.text}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
