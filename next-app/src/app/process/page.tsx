import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { ProcessBody } from '@/components/pages/process';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/process');

export default function ProcessPage() {
  return (
    <>
      <ProcessBody />
      <SiteCtaSlot route="/process" />
    </>
  );
}
