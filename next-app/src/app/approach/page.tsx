import { SiteCta } from '@/components/SiteCta';
import { ApproachBody } from '@/components/pages/approach';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/approach');

export default function ApproachPage() {
  return (
    <>
      <ApproachBody />
      <SiteCta />
    </>
  );
}
