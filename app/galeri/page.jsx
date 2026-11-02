import { getGalleryItems } from '@/lib/queries/catalog';
import GalleryClient from './gallery-client';
import { BreadcrumbJsonLd } from '@/app/components/json-ld';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Galeri Dekorasi Pernikahan & Pesta',
  description:
    'Dokumentasi portofolio instalasi tenda pernikahan, tenda serut VIP, dan tata dekorasi pesta asli Arum Tenda di Purbalingga, Purwokerto, Banyumas, dan sekitarnya.',
  alternates: {
    canonical: '/galeri',
  },
};

export default async function GaleriPage() {
  const items = await getGalleryItems();
  const breadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Galeri Dokumentasi', path: '/galeri' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <GalleryClient initialItems={items} />
    </>
  );
}
