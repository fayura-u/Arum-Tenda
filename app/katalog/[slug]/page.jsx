import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/queries/catalog';
import ProductDetailClient from './product-detail-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — Arum Tenda',
    };
  }

  return {
    title: `${product.name} — Katalog Sewa Arum Tenda`,
    description:
      product.description ||
      `Informasi spesifikasi harga sewa dan varian warna tenda ${product.name} untuk acara pesta dan pernikahan dari Arum Tenda.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
