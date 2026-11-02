import { BriefForm } from '@/components/BriefForm';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons';
import { SectionSlots } from '@/components/sections/SectionSlots';
import { css } from '@/lib/css';

/* -------------------------------------------------------------- direct lines */

/** One row of the “Direct lines” card: an icon, a term, and a link or plain text. */
interface ContactLine {
  icon: IconName;
  term: string;
  value: string;
  /** Present only on the email row, which is a mailto link. */
  href?: string;
}

const CONTACT_LINES: ContactLine[] = [
  { icon: 'i-mail', term: 'Email', value: 'hello@intactic.net', href: 'mailto:hello@intactic.net' },
  { icon: 'i-clock', term: 'Response', value: 'Within two working days' },
  { icon: 'i-calendar', term: 'Calls', value: 'Booked after the first reply' },
  { icon: 'i-globe', term: 'Domain', value: 'intactic.net' },
];

/* -------------------------------------------------------- what happens next */

const NEXT_STEPS: string[] = [
  'We read the brief and reply with the two or three questions that would change the shape of the work.',
  'A 45-minute call on the system, the constraints and the deadline. No pitch deck.',
  'If it is a fit, you get a written scope for discovery with a fixed fee and a start date.',
];

/* ---------------------------------------------------------- before you write */

/** One row of the “Useful things to include” list. */
interface IncludeItem {
  icon: IconName;
  text: string;
}

const INCLUDE_ITEMS: IncludeItem[] = [
  { icon: 'i-web', text: 'What the system does today, and who uses it.' },
  { icon: 'i-pulse', text: 'What breaks most often, and what it costs when it does.' },
  { icon: 'i-calendar', text: 'Whether a deadline is fixed by a contract or a guess.' },
  { icon: 'i-link', text: 'Links to a current site or a repository, where you can share them.' },
];

/* ---------------------------------------------------------------------- faq */

/** One uncontrolled accordion item; the `open` prop is deliberately never set. */
interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does a project start?',
    answer:
      'A 45-minute call about the system, the constraints and the deadline. If it looks like a fit, we scope a short discovery with a fixed fee and a written architecture at the end. There is no commitment to build with us afterwards.',
  },
  {
    question: 'Can you take over an unfinished build?',
    answer:
      'Often. We start with an audit: what is stable, what is load-bearing, what should be replaced and what should be left alone. Taking over someone else’s work is normal here, not a rescue mission.',
  },
  {
    question: 'Who owns what at the end?',
    answer:
      'You own the code, the cloud accounts and the keys. Repositories are opened in your name from the first week, and the handover pack is written for the team that inherits the system.',
  },
];

/**
 * The contact page. The brief form itself is the client component `BriefForm`;
 * everything around it — direct lines, what happens next, the writing checklist
 * and the FAQ — lives here.
 */
export function ContactBody() {
  const sections = {
    head: (
      <section className="page-head" data-od-id="page-head" aria-labelledby="contact-title">
        <div className="shell">
          <div className="page-head__grid">
            <div>
              <div className="page-head__mark">
                <Icon name="i-mail" />
              </div>
              <p className="eyebrow eyebrow--i" data-reveal>
                <Icon name="i-mail" /> Contact
              </p>
              <h1 className="display" id="contact-title" data-reveal style={css({ '--d': '.05s' })}>
                Tell us what you’re building.
              </h1>
            </div>
            <div data-reveal style={css({ '--d': '.1s' })}>
              <p className="lead">
                A short brief is enough. You will get a reply with the questions that matter, a rough shape of the
                work and an honest answer on fit.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    brief: (
      <section className="section" id="brief" data-od-id="brief">
        <div className="shell">
          <div className="contact-grid">
            <div data-reveal>
              <h2 className="svc__label">
                <Icon name="i-pen" /> Project brief
              </h2>
              <BriefForm />
            </div>

            <div data-reveal style={css({ '--d': '.08s' })}>
              <div className="contact-card">
                <div className="card-head">
                  <span className="tile tile--sm">
                    <Icon name="i-link" />
                  </span>
                  <h2 className="h2 card-head__title">Direct lines</h2>
                </div>
                <dl className="contact-lines">
                  {CONTACT_LINES.map((line) => (
                    <div key={line.term}>
                      <dt>
                        <Icon name={line.icon} />
                        <span>{line.term}</span>
                      </dt>
                      <dd>{line.href ? <a href={line.href}>{line.value}</a> : line.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="next">
                  <h3>What happens next</h3>
                  <ol>
                    {NEXT_STEPS.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="contact-card" style={css({ marginTop: '16px' })}>
                <div className="card-head">
                  <span className="tile tile--sm">
                    <Icon name="i-check" />
                  </span>
                  <h2 className="h2 card-head__title">Before you write</h2>
                </div>
                <p className="body" style={css({ marginBottom: '16px' })}>
                  Useful things to include:
                </p>
                <ul className="speclist speclist--tight" style={css({ borderTop: '0' })}>
                  {INCLUDE_ITEMS.map((item) => (
                    <li key={item.text}>
                      <Icon name={item.icon} />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    faq: (
      <section className="section section--tint" id="contact-faq" data-od-id="contact-faq">
        <div className="shell">
          <div className="faq">
            <div className="faq__aside">
              <p className="eyebrow eyebrow--i" data-reveal>
                <Icon name="i-help" /> Before the call
              </p>
              <h2 className="h2" data-reveal style={css({ '--d': '.05s' })}>
                The three questions we always get.
              </h2>
              <p className="body" data-reveal style={css({ '--d': '.1s' })}>
                Longer answers live in the engagement notes. These are the short versions.
              </p>
            </div>
            <div className="faq__list" data-reveal>
              {FAQ_ITEMS.map((item) => (
                <details className="faq__item" key={item.question}>
                  <summary>
                    {item.question}
                    <span className="pm" aria-hidden="true"></span>
                  </summary>
                  <div className="faq__body">{item.answer}</div>
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
      <SectionSlots route="/contact" nodes={sections} />
    </main>
  );
}
