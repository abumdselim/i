import { Icon } from '@/components/Icon';
import { css } from '@/lib/css';

/** The 404 body — one screen, no repeated blocks, so the copy lives in constants. */
const EYEBROW = 'Error 404';
const TITLE = 'This page does not exist.';
const LEAD =
  'The link may be out of date, or the page has moved. Everything else on the site is one click away.';
const HOME_ACTION = 'Back to the home page';
const SERVICES_ACTION = 'See the capabilities';

export function NotFoundBody() {
  return (
    <>
      <main id="main">
        <section className="section" data-od-id="not-found">
          <div className="shell">
            <div style={css({ maxWidth: '620px' })}>
              <div className="page-head__mark">
                <Icon name="i-search" />
              </div>
              <p className="eyebrow eyebrow--i" data-reveal>
                <Icon name="i-search" /> {EYEBROW}
              </p>
              <h1 className="display" data-reveal style={css({ '--d': '.05s', marginTop: '22px' })}>
                {TITLE}
              </h1>
              <p className="lead" data-reveal style={css({ '--d': '.1s', marginTop: '22px' })}>
                {LEAD}
              </p>
              <div className="hero__actions" data-reveal style={css({ '--d': '.15s', marginTop: '32px' })}>
                <a className="btn btn--primary btn--lg" href="/">
                  {HOME_ACTION}
                  <Icon name="i-arrow" />
                </a>
                <a className="linkarrow" href="/services">
                  {SERVICES_ACTION}
                  <Icon name="i-arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
