import { getGalleryItems } from '@/lib/queries/catalog';
import GalleryClient from './gallery-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Galeri Dekorasi — Arum Tenda',
  description: 'Dokumentasi dan inspirasi dekorasi tenda pesta pernikahan, khitan, dan acara keluarga dari Arum Tenda.',
};

export default async function GaleriPage() {
  const items = await getGalleryItems();
  return <GalleryClient initialItems={items} />;
}
