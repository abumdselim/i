import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/icons';
import type { ContentItem, RelatedItem } from '@/lib/content/types';
import { css } from '@/lib/css';

/**
 * The section primitives every templated page is built from. Each one reproduces
 * one block of the legacy templates exactly — same elements, same class names —
 * so the parity gate can compare markup signatures rather than trusting the port.
 */

interface SectionHeadProps {
  eyebrowIcon: IconName;
  eyebrow: string;
  title: string;
  /** Anchor target for the section, where the legacy markup had one. */
  titleId?: string;
  lead: string;
  /** Extra aside content, e.g. a link under the lead. */
  children?: ReactNode;
}

export function SectionHead({ eyebrowIcon, eyebrow, title, titleId, lead, children }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <div>
        <p className="eyebrow eyebrow--i" data-reveal>
          <Icon name={eyebrowIcon} /> {eyebrow}
        </p>
        <h2 className="h2" id={titleId} data-reveal style={css({ '--d': '.05s' })}>
          {title}
        </h2>
      </div>
      <div className="sec-head__aside" data-reveal style={css({ '--d': '.1s' })}>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </div>
  );
}

export function DeliverableGrid({ items }: { items: ContentItem[] }) {
  return (
    <div className="deliv" data-reveal>
      {items.map((item) => (
        <div className="deliv__item" key={item.title}>
          <span className="deliv__mark">
            <Icon name={item.icon} />
          </span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RulesList({ items, prefix }: { items: ContentItem[]; prefix: 'A' | 'D' }) {
  return (
    <div className="rules" data-reveal>
      {items.map((item, index) => (
        <div className="rule" key={item.title}>
          <div className="rule__id">
            <Icon name={item.icon} />
            {/* One string, not three children: React separates adjacent text nodes
                with comment markers, which changes the DOM text lxml sees. */}
            <span className="mono">{`${prefix}/${String(index + 1).padStart(2, '0')}`}</span>
          </div>
          <h3 className="h4">{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function RelatedLinks({ items }: { items: RelatedItem[] }) {
  return (
    <div className="related" data-reveal>
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <div>
            <span className="mono">{item.num}</span>
            <strong>{item.label}</strong>
          </div>
          <Icon name="i-arrow-ur" />
        </Link>
      ))}
    </div>
  );
}

interface PanelProps {
  icon: IconName;
  label: string;
  /** The reveal stagger, e.g. ".06s". Omitted on the first panel, as in the legacy markup. */
  delay?: string;
  children: ReactNode;
}

export function Panel({ icon, label, delay, children }: PanelProps) {
  return (
    <div data-reveal style={delay ? css({ '--d': delay }) : undefined}>
      <h3 className="svc__label">
        <Icon name={icon} /> {label}
      </h3>
      {children}
    </div>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <div className="svc__stack">
      {items.map((tag) => (
        <span className="tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}
