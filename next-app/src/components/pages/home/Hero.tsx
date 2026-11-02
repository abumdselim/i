import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Plate } from '@/components/sections/Figure';
import { css } from '@/lib/css';

const FACTS = [
  { icon: 'i-search' as const, label: 'Discovery', body: 'A written architecture and a fixed scope before any code.' },
  { icon: 'i-users' as const, label: 'Team', body: 'The people who scope the work are the people who build it.' },
  { icon: 'i-key' as const, label: 'Ownership', body: 'Code, cloud accounts and keys stay in your name.' },
];

const DISCIPLINES = [
  { icon: 'i-custom' as const, label: 'Custom software' },
  { icon: 'i-commerce' as const, label: 'Commerce' },
  { icon: 'i-erp' as const, label: 'ERP' },
  { icon: 'i-web' as const, label: 'Product engineering' },
];

/** The opening band: headline, two actions, and the system plate on the right. */
export function Hero() {
  return (
    <section className="hero" data-od-id="hero" aria-labelledby="hero-title">
      <div className="shell">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="page-head__mark" data-reveal>
              <Icon name="i-cube" />
            </div>
            <p className="eyebrow eyebrow--i" data-reveal>
              <Icon name="i-building" /> Software engineering studio
            </p>
            <h1 className="display" id="hero-title" data-reveal style={css({ '--d': '.02s' })}>
              We build the systems your business runs on<span className="dot">.</span>
            </h1>
            <p className="lead" data-reveal style={css({ '--d': '.12s' })}>
              Custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown
              off-the-shelf software. We design the architecture, write the code, and stay accountable for what happens
              in production.
            </p>
            <div className="hero__actions" data-reveal style={css({ '--d': '.18s' })}>
              <Link className="btn btn--primary btn--lg" href="/contact">
                Start a project <Icon name="i-arrow" />
              </Link>
              <Link className="linkarrow" href="/approach">
                See how we work <Icon name="i-arrow" />
              </Link>
            </div>
            <p className="hero__meta" data-reveal style={css({ '--d': '.24s' })}>
              {DISCIPLINES.map((discipline) => (
                <span key={discipline.label}>
                  <Icon name={discipline.icon} />
                  {discipline.label}
                </span>
              ))}
            </p>
          </div>

          <figure className="plate-wrap" data-reveal style={css({ '--d': '.14s' })}>
            <div className="plate">
              <div className="plate__bar">
                <span>System plate</span>
                <span>Fig. 01</span>
              </div>
              <Plate />
              <div className="plate__foot">
                <span>One module, every layer</span>
                <span>INT / 01</span>
              </div>
            </div>
            <figcaption>
              One module, three layers. The same square draws the interface, the model and the data beneath it.
            </figcaption>
          </figure>
        </div>

        <div className="facts">
          {FACTS.map((fact) => (
            <div className="facts__item" key={fact.label}>
              <div className="facts__top">
                <Icon name={fact.icon} />
                <span className="mono">{fact.label}</span>
              </div>
              <p>{fact.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
