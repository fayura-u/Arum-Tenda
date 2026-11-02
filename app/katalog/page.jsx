import { getCatalogProducts } from '@/lib/queries/catalog';
import CatalogClient from './catalog-client';
import { BreadcrumbJsonLd } from '@/app/components/json-ld';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Katalog Sewa Tenda & Alat Pesta Purbalingga',
  description:
    'Pilihan lengkap sewa tenda pernikahan, tenda serut, panggung, kursi tiffany, meja jamuan, dan alat katering di Purbalingga, Purwokerto, dan Banyumas Raya.',
  alternates: {
    canonical: '/katalog',
  },
};

export default async function KatalogPage() {
  const products = await getCatalogProducts();
  const breadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Katalog Sewa', path: '/katalog' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CatalogClient initialProducts={products} />
    </>
  );
}
