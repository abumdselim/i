import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { EngagementsBody } from '@/components/pages/engagements';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/engagements');

export default function EngagementsPage() {
  return (
    <>
      <EngagementsBody />
      <SiteCtaSlot route="/engagements" />
    </>
  );
}
