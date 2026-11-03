import { SectionSlots } from '@/components/sections/SectionSlots';
import { CaseStudies } from '@/components/pages/CaseStudiesBody';
import { Hero } from './Hero';
import { Capabilities, Engagements, Industries, Intelligence, Process, ProductStrip, StackSection } from './Sections';

/**
 * The home page, in the order the design reads it: claim, disciplines, the
 * intelligence argument, the products the studio runs itself, where that work
 * lands, the tools, the process, how to work together, then the evidence as
 * the last block before the closing CTA.
 *
 * The evidence sits last on purpose — the placement Brain Station 23 uses on
 * its own home page: the reader meets the cases after the work has been
 * described and the engagement models explained, and reads them as proof
 * immediately before the ask. It also keeps the surface ladder intact
 * (mist → paper → shell, docs/DECISIONS.md D-06).
 *
 * Ten sections, each owning its own content; the only shared thing is the
 * section-head and the figure components. The order and visibility come from
 * the registry and `data/site-config.json` (admin phase 2), not from this file.
 */
export function HomeBody() {
  return (
    <main id="main">
      <SectionSlots
        route="/"
        nodes={{
          hero: <Hero />,
          capabilities: <Capabilities />,
          intelligence: <Intelligence />,
          "case-studies": <CaseStudies />,
          products: <ProductStrip />,
          industries: <Industries />,
          stack: <StackSection />,
          process: <Process />,
          engagements: <Engagements />,
        }}
      />
    </main>
  );
}
