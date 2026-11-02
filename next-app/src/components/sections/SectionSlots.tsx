import { Fragment, type ReactNode } from 'react';
import { sectionPlan } from '@/lib/config';

/**
 * Renders one page's body sections in the order `data/site-config.json` asks
 * for, and nothing else (admin phase 2, docs/admin.md §6.3).
 *
 * Three properties make this a provably invisible refactor while the config is
 * empty:
 *
 *   - it emits the nodes themselves, each inside a `Fragment`, so the DOM is
 *     identical to writing them out by hand — no wrapper element, no classes;
 *   - a node the registry does not list throws, and so does a visible section
 *     with no node, so a renamed id cannot silently drop a section;
 *   - it is a server component; the studio reorders the same ids later.
 */
export function SectionSlots({
  route,
  nodes,
}: {
  route: string;
  nodes: Record<string, ReactNode>;
}) {
  const plan = sectionPlan(route).filter((section) => section.mount === 'body');
  const registered = new Set(plan.map((section) => section.id));

  for (const id of Object.keys(nodes)) {
    if (!registered.has(id)) {
      throw new Error(`sections: "${route}" renders "${id}", which the registry does not list`);
    }
  }

  return (
    <>
      {plan
        .filter((section) => !section.hidden)
        .map((section) => {
          const node = nodes[section.id];
          if (node === undefined) {
            throw new Error(`sections: "${route}" has no node for "${section.id}"`);
          }
          return <Fragment key={section.id}>{node}</Fragment>;
        })}
    </>
  );
}
