import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons.generated';
import type { MetaItem } from '@/lib/content/types';
import { css } from '@/lib/css';

/** Mirrors ui.META_ICON in the legacy build; anything unknown falls back to a flag. */
const META_ICON: Record<string, IconName> = {
  Domain: 'i-globe',
  Status: 'i-pulse',
  Platforms: 'i-mobile',
  'Typical engagement': 'i-card',
  Team: 'i-users',
  'First phase': 'i-calendar',
  'First release': 'i-calendar',
};

export function MetaRail({ items }: { items: MetaItem[] }) {
  return (
    <div className="page-head__meta">
      {items.map((item) => (
        <div key={item.key}>
          <Icon name={META_ICON[item.key] ?? 'i-flag'} />
          <span className="meta-txt">
            <span className="mono">{item.key}</span>
            <span className="meta-val">
              {item.value.kind === 'link' ? (
                <a className="textlink" href={item.value.href}>
                  {item.value.label}
                </a>
              ) : (
                item.value.value
              )}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

interface PageHeadProps {
  /** `cat-title` or `prod-title` — the aria-labelledby target. */
  titleId: string;
  mark: IconName;
  eyebrowIcon: IconName;
  /** "Capability" or "Product". */
  eyebrow: string;
  /** "C/01" or "P/03". */
  eyebrowTag: string;
  title: string;
  lead: string;
  meta: MetaItem[];
  actions?: ReactNode;
}

/**
 * The dark-band head every templated page opens with: mark, eyebrow with a series
 * tag, display headline on the left; lead, meta rail and actions on the right.
 */
export function PageHead({
  titleId,
  mark,
  eyebrowIcon,
  eyebrow,
  eyebrowTag,
  title,
  lead,
  meta,
  actions,
}: PageHeadProps) {
  return (
    <section className="page-head" data-od-id="page-head" aria-labelledby={titleId}>
      <div className="shell">
        <div className="page-head__grid">
          <div>
            <div className="page-head__mark">
              <Icon name={mark} />
            </div>
            <p className="eyebrow eyebrow--i" data-reveal>
              <Icon name={eyebrowIcon} /> {eyebrow} <span className="eyebrow__tag">{eyebrowTag}</span>
            </p>
            <h1 className="display" id={titleId} data-reveal style={css({ '--d': '.05s' })}>
              {title}
            </h1>
          </div>
          <div data-reveal style={css({ '--d': '.1s' })}>
            <p className="lead">{lead}</p>
            <MetaRail items={meta} />
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
}
