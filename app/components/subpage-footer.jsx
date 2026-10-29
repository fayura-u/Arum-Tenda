import Link from 'next/link';

const links = [
  ['Beranda', '/'],
  ['Tentang', '/tentang'],
  ['Katalog', '/katalog'],
  ['Galeri', '/galeri'],
  ['Simulasi Tenda', '/simulasi'],
];

export default function SubpageFooter({ activePage, note = '' }) {
  return <footer className="subpage-footer">
    <Link href="/">ARUM TENDA</Link>
    <span>© {new Date().getFullYear()} Arum Tenda{note ? ` · ${note}` : ''}</span>
    <div>{links.map(([label, href]) => <Link href={href} key={href} aria-current={activePage === href ? 'page' : undefined}>{label}</Link>)}</div>
  </footer>;
}
