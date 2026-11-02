import { SiteCta } from '@/components/SiteCta';
import { ProcessBody } from '@/components/pages/process';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/process');

export default function ProcessPage() {
  return (
    <>
      <ProcessBody />
      <SiteCta />
    </>
  );
}
