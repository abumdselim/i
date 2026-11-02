import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons';
import { SectionHead } from '@/components/sections/Blocks';
import { css } from '@/lib/css';

/**
 * The studio page (/about). The on-page index, the studio-at-a-glance rows,
 * the four principles, the declined list and the working-together tags are
 * typed arrays below.
 */

interface IndexLink {
  href: string;
  icon: IconName;
  label: string;
}

const PAGE_INDEX: IndexLink[] = [
  { href: '#why', icon: 'i-compass', label: 'Why this way' },
  { href: '#principles', icon: 'i-flag', label: 'Principles' },
  { href: '#boundaries', icon: 'i-ban', label: 'Boundaries' },
  { href: '#working', icon: 'i-link', label: 'Working together' },
];

/** One row of the studio-at-a-glance rail in the contact card. */
interface GlanceRow {
  icon: IconName;
  label: string;
  value: string;
}

const GLANCE: GlanceRow[] = [
  { icon: 'i-users', label: 'Team', value: 'Senior engineers and designers' },
  { icon: 'i-clock', label: 'Cadence', value: 'Two-week increments' },
  { icon: 'i-globe', label: 'Footprint', value: 'Distributed, overlapping hours' },
  { icon: 'i-doc', label: 'Language', value: 'English' },
  { icon: 'i-calendar', label: 'Working with us', value: 'Discovery first, fixed fee' },
];

interface Principle {
  icon: IconName;
  num: string;
  title: string;
  body: string;
  delay?: string;
}

const PRINCIPLES: Principle[] = [
  { icon: 'i-layers', num: 'P/01', title: 'Architecture before tooling', body: 'The stack is the last decision, not the first. We model the domain, then choose the smallest set of tools that can carry it.' },
  { icon: 'i-approval', num: 'P/02', title: 'Every automation needs an exit', body: 'A human checkpoint, an audit trail and a switch that turns the feature off without taking the system down.', delay: '.05s' },
  { icon: 'i-database', num: 'P/03', title: 'Boring where it counts', body: 'Postgres, queues, logs, backups. Reliability is the part of the product nobody demos and everybody notices.', delay: '.1s' },
  { icon: 'i-doc', num: 'P/04', title: 'Handover is part of the build', body: 'Documentation, runbooks and a recorded walkthrough ship with the software, not after it, and not as an upsell.', delay: '.15s' },
];

interface SpecItem {
  icon: IconName;
  text: string;
}

/** What the studio declines; every row carries the same close mark. */
const DECLINED: SpecItem[] = [
  { icon: 'i-close', text: 'Sell staff by the head without owning the outcome.' },
  { icon: 'i-close', text: 'Ship an automated decision that nobody can review.' },
  { icon: 'i-close', text: 'Lock a client into our hosting, our licence or our accounts.' },
  { icon: 'i-close', text: 'Take a build we cannot staff with people you have already met.' },
  { icon: 'i-close', text: 'Quote a number before we have read the system.' },
];

const WORKING_TAGS: string[] = ['Fixed-scope discovery', 'Milestone billing', 'Named lead', 'Your accounts'];

export function AboutBody() {
  return (
    <>
      <main id="main">

        <section className="page-head" data-od-id="page-head" aria-labelledby="studio-title">
          <div className="shell">
            <div className="page-head__grid">
              <div>
                <div className="page-head__mark"><Icon name="i-building" /></div>
                <p className="eyebrow eyebrow--i" data-reveal><Icon name="i-building" /> Studio</p>
                <h1 className="display" id="studio-title" data-reveal style={css({ '--d': '.05s' })}>A small studio for systems that matter.</h1>
              </div>
              <div data-reveal style={css({ '--d': '.1s' })}>
                <p className="lead">Intactic is a software engineering studio. We take on a limited number of builds at a time, so the people who scope the work are the people who ship it, and the person who answers your call knows the codebase.</p>
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

        <section className="section" id="why" data-od-id="why">
          <div className="shell">
            <div className="split">
              <div data-reveal>
                <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-compass" /> Why we work this way</p>
                <h2 className="h2" style={css({ marginBottom: '22px' })}>Small enough to be accountable.</h2>
                <p className="body" style={css({ marginBottom: '16px' })}>Large agencies sell a team you meet once and a document you cannot use without them. We have seen how that ends: a system that works, a client who cannot change it, and an invoice that never quite stops.</p>
                <p className="body" style={css({ marginBottom: '16px' })}>So we stay small and senior. One build per lead, an architecture written before the first line of code, and a handover that leaves your team independent. It limits how quickly we can grow. It is also why clients keep the systems we build.</p>
                <p className="body">Our work has one thing in common: the software sits close to the money, the stock or the customer record. That is not a place for experiments dressed as products.</p>
              </div>
              <div className="contact-card" data-reveal style={css({ '--d': '.08s' })}>
                <div className="card-head">
                  <span className="tile tile--sm"><Icon name="i-building" /></span>
                  <h2 className="h2 card-head__title">Studio at a glance</h2>
                </div>
                <dl className="contact-lines">
                  {GLANCE.map((row) => (
                    <div key={row.label}><dt><Icon name={row.icon} /><span>{row.label}</span></dt><dd>{row.value}</dd></div>
                  ))}
                </dl>
                <p style={css({ marginTop: '22px' })}><a className="linkarrow" href="/contact">Start a conversation
                  <Icon name="i-arrow" /></a></p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tint" id="principles" data-od-id="principles">
          <div className="shell">
            <SectionHead
              eyebrowIcon="i-flag"
              eyebrow="Principles"
              title="Four positions we do not trade."
              lead="These are working rules, not values on a wall. They decide what gets built, what gets cut and when we say no."
            />

            <div className="principles">
              {PRINCIPLES.map((principle) => (
                <div className="principle" data-reveal style={principle.delay ? css({ '--d': principle.delay }) : undefined} key={principle.num}>
                  <div className="principle__id"><Icon name={principle.icon} /><span className="mono">{principle.num}</span></div>
                  <h3 className="h4">{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="boundaries" data-od-id="boundaries">
          <div className="shell">
            <div className="split">
              <div data-reveal>
                <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-ban" /> Boundaries</p>
                <h2 className="h2" style={css({ marginBottom: '26px' })}>What we don’t do.</h2>
                <ul className="speclist speclist--no">
                  {DECLINED.map((item) => (
                    <li key={item.text}><Icon name={item.icon} /><span>{item.text}</span></li>
                  ))}
                </ul>
              </div>
              <div id="working" data-reveal style={css({ '--d': '.08s' })}>
                <p className="eyebrow eyebrow--i" style={css({ marginBottom: '20px' })}><Icon name="i-link" /> Working together</p>
                <h2 className="h2" style={css({ marginBottom: '22px' })}>Visible from the first week.</h2>
                <p className="body" style={css({ marginBottom: '16px' })}>An engagement starts with a short call and a written scope. From there we work in public: a shared repository, a visible board, and working software demoed at the end of every increment. You always know what is built, what is next and what is at risk.</p>
                <p className="body" style={css({ marginBottom: '26px' })}>We keep the team stable across the engagement. The person who designs the architecture is on the call when it goes to production, and the same people write the handover.</p>
                <div className="svc__stack" style={css({ marginBottom: '24px' })}>
                  {WORKING_TAGS.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <a className="linkarrow" href="/services">See the capabilities
                  <Icon name="i-arrow" /></a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
