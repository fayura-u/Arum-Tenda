import CatalogClient from './catalog-client';

export const metadata = {
  title: 'Katalog Sewa — Arum Tenda',
  description: 'Daftar harga contoh dan pilihan tenda serta perlengkapan acara Arum Tenda.',
};

export default function KatalogPage() {
  return <CatalogClient />;
}
