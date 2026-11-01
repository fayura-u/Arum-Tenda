export const metadata = {
  title: 'Dasbor CMS Admin — Arum Tenda',
  description: 'Pengelolaan data katalog dan galeri Arum Tenda.',
};

export default function AdminLayout({ children }) {
  return <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>;
}
