import { ProductsHub } from '@/components/pages/ProductsHub';
import { SiteCta } from '@/components/SiteCta';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/products');

export default function ProductsPage() {
  return (
    <>
      <ProductsHub />
      <SiteCta />
    </>
  );
}
