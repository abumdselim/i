import { SectionSlots } from '@/components/sections/SectionSlots';
import { Hero } from './Hero';
import { Capabilities, Engagements, Industries, Intelligence, Process, ProductStrip, StackSection } from './Sections';

/**
 * The home page, in the order the design reads it: claim, disciplines, the
 * intelligence argument, the products the studio runs itself, where that work
 * lands, the tools, the process, then how to work together.
 *
 * Nine sections, each owning its own content; the only shared thing is the
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
