import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { SectionHead } from '@/components/sections/Blocks';
import { CASE_STUDIES } from '@/lib/content/loader';
import { css } from '@/lib/css';

/**
 * The case-study section, in two lengths.
 *
 * `home` is a teaser: three cards, the first paragraph of each, and a link to the
 * page. `page` is the record: all four cases with their full summary, spec, tags
 * and note, led by the live platform's own screen. The copy is one document
 * (`data/case-studies.json`) so the two lengths cannot drift apart — the home
 * picks the first three and the first paragraph, nothing else is rewritten.
 */
export function CaseStudies({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const { head, cta, cases } = CASE_STUDIES;
  const full = variant === 'page';
  const shown = full ? cases : cases.slice(0, 3);

  return (
    <section
      className={full ? 'section page-cases' : 'section'}
      id="case-studies"
      data-od-id="case-studies"
      aria-labelledby="case-title"
    >
      <div className="shell">
        <SectionHead eyebrowIcon="i-target" eyebrow={head.eyebrow} title={head.title} titleId="case-title" lead={head.lead}>
          {!full && (
            <Link className="linkarrow" href="/case-studies">
              All case studies <Icon name="i-arrow" />
            </Link>
          )}
        </SectionHead>

        <div className={full ? 'cases' : 'cases cases--teaser'}>
          {shown.map((item, index) => (
            <article
              className="case"
              id={item.id}
              data-reveal
              style={index === 0 ? undefined : css({ '--d': `.${String(index * 6).padStart(2, '0')}s` })}
              key={item.id}
            >
              <div className={item.logo ? 'case__media case__media--mark' : 'case__media'}>
                {item.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="case__logo"
                    src={item.logo.src}
                    alt={item.logo.alt}
                    width={item.logo.width}
                    height={item.logo.height}
                  />
                ) : (
                  <span className="tile tile--sm">
                    <Icon name={item.icon} />
                  </span>
                )}
              </div>

              <div className="case__body">
                {item.kind === 'live' ? null : <p className="case__kind mono">Illustrative</p>}
                <h3 className="h3">{item.client}</h3>

                {(full ? item.summary : item.summary.slice(0, 1)).map((paragraph, paragraphIndex) => (
                  <p className="case__text" key={`${item.id}-${paragraphIndex}`}>
                    {paragraph}
                  </p>
                ))}

                {full && (
                  <>
                    <dl className="case__spec">
                      {item.spec.map((row) => (
                        <div key={row.label}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="case__tags">
                      {item.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.note ? <p className="case__note">{item.note}</p> : null}
                  </>
                )}

                {full ? (
                  item.link.external ? (
                    <a className="case__link linkarrow" href={item.link.href} target="_blank" rel="noreferrer">
                      {item.link.label} <Icon name="i-arrow-ur" />
                    </a>
                  ) : (
                    <Link className="case__link linkarrow" href={item.link.href}>
                      {item.link.label} <Icon name="i-arrow" />
                    </Link>
                  )
                ) : (
                  <Link className="case__link linkarrow" href={`/case-studies#${item.id}`}>
                    Read the case <Icon name="i-arrow" />
                  </Link>
                )}
              </div>
            </article>
          ))}

          {full && (
            <div className="case case--cta" data-reveal style={css({ '--d': '.24s' })}>
              <div className="case__body">
                <p className="case__kind case__kind--cta mono">Next</p>
                <h3 className="h3">{cta.title}</h3>
                <p className="case__text">{cta.body}</p>
                <Link className="case__link linkarrow" href={cta.href}>
                  {cta.label} <Icon name="i-arrow" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
