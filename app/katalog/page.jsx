import { getCatalogProducts } from '@/lib/queries/catalog';
import CatalogClient from './catalog-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Katalog Sewa — Arum Tenda',
  description: 'Daftar harga contoh dan pilihan tenda serta perlengkapan acara Arum Tenda.',
};

export default async function KatalogPage() {
  const products = await getCatalogProducts();
  return <CatalogClient initialProducts={products} />;
}
