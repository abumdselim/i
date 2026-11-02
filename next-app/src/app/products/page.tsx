import { ProductsHub } from '@/components/pages/ProductsHub';
import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/products');

export default function ProductsPage() {
  return (
    <>
      <ProductsHub />
      <SiteCtaSlot route="/products" />
    </>
  );
}
