'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const links = [
  ['Beranda', '/', '00'],
  ['Tentang', '/tentang', '01'],
  ['Katalog', '/katalog', '02'],
  ['Galeri', '/galeri', '03'],
  ['Simulasi Tenda', '/simulasi', '04'],
];

export default function SubpageHeader({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 24);
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return <>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Arum Tenda, beranda"><span className="brand-icon">A</span><span>ARUM TENDA<small>SEWA TENDA &amp; PERLENGKAPAN</small></span></Link>
      <nav className="main-nav" aria-label="Navigasi utama">{links.map(([label, href]) => <Link href={href} key={href} aria-current={activePage === href ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className="header-actions"><details className="social-menu"><summary>Socials <i className="bi bi-chevron-down nav-icon" aria-hidden="true" /></summary><div className="social-options"><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">WhatsApp <b>↗</b></a><a href="https://www.instagram.com/arumtenda/" target="_blank" rel="noreferrer">Instagram <b>↗</b></a></div></details><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button></div>
    </header>
    <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-label="Navigasi mobile" aria-hidden={!menuOpen}>{links.map(([label, href, number]) => <Link href={href} key={href} aria-current={activePage === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}<span>{number}</span></Link>)}</nav>
  </>;
}
