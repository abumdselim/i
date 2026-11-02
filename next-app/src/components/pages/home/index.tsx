import { Hero } from './Hero';
import { Capabilities, Engagements, Industries, Intelligence, Process, ProductStrip, StackSection } from './Sections';

/**
 * The home page, in the order the design reads it: claim, disciplines, the
 * intelligence argument, the products the studio runs itself, where that work
 * lands, the tools, the process, then how to work together.
 *
 * Nine sections, each owning its own content; the only shared thing is the
 * section-head and the figure components.
 */
export function HomeBody() {
  return (
    <main id="main">
      <Hero />
      <Capabilities />
      <Intelligence />
      <ProductStrip />
      <Industries />
      <StackSection />
      <Process />
      <Engagements />
    </main>
  );
}
