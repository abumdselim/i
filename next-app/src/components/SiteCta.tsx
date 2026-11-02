import Link from 'next/link';
import { Icon } from './Icon';

/**
 * The closing block, identical on every page that opts in (build.py `CTA`,
 * `cta=True` on 17 of 19 routes). Rendered inside <main> rather than as a
 * sibling of it; that is the only structural difference from the legacy output
 * and it has no visual or semantic cost.
 */
export function SiteCta() {
  return (
    <section className="cta-wrap" data-od-id="cta" aria-labelledby="cta-title">
      <div className="shell">
        <div className="cta">
          <div className="cta__grid">
            <div className="cta__copy">
              <p className="eyebrow">Next step</p>
              <h2 className="h2" id="cta-title">
                Tell us what you&rsquo;re building.
              </h2>
              <p>
                Send a short brief. You get the questions that matter, a rough shape of the work and a straight answer
                on fit.
              </p>
            </div>
            <div className="cta__actions">
              <Link className="btn btn--white btn--lg" href="/contact">
                Start a project
                <Icon name="i-arrow" />
              </Link>
              <a className="cta__mail" href="mailto:hello@intactic.net">
                hello@intactic.net
              </a>
              <p className="cta__note">No sales sequence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
