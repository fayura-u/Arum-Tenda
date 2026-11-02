import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/queries/catalog';
import ProductDetailClient from './product-detail-client';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/app/components/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — Arum Tenda',
    };
  }

  const imageUrl =
    product.product_colors && product.product_colors.length > 0 && product.product_colors[0].image_url
      ? product.product_colors[0].image_url
      : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=85';

  const description =
    product.description ||
    `Informasi spesifikasi, harga sewa, dan variasi warna ${product.name} dari Arum Tenda untuk acara dan pernikahan di Purbalingga, Purwokerto, dan sekitarnya.`;

  return {
    title: `${product.name} — Sewa Tenda Purbalingga`,
    description,
    alternates: {
      canonical: `/katalog/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — Sewa Tenda & Alat Pesta Arum Tenda`,
      description,
      url: `/katalog/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Katalog Sewa', path: '/katalog' },
    { name: product.name, path: `/katalog/${product.slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductDetailClient product={product} />
    </>
  );
}
