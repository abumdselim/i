import { NotFoundBody } from '@/components/pages/not-found-body';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/404');

export default function NotFound() {
  return <NotFoundBody />;
}
