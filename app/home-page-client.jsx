'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const whatsappNumber = '6281234567890';
const instagramUrl = 'https://www.instagram.com/arumtenda/';
const packages = [
  {
    name: 'Paket A',
    description: 'Ruang acara yang nyaman untuk keluarga.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
    alt: 'Tampilan Paket A: dekorasi acara keluarga',
  },
  {
    name: 'Paket B',
    description: 'Pilihan perlengkapan untuk perayaan Anda.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85',
    alt: 'Tampilan Paket B: perlengkapan perayaan',
  },
  {
    name: 'Paket C',
    description: 'Sesuaikan kebutuhan bersama tim kami.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85',
    alt: 'Tampilan Paket C: tata acara yang disesuaikan',
  },
];

const pages = [
  ['Beranda', '/', '00'],
  ['Tentang', '/tentang', '01'],
  ['Katalog', '/katalog', '02'],
  ['Galeri', '/galeri', '03'],
  ['Simulasi Tenda', '/simulasi', '04'],
];

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  'Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.',
)}`;

export default function HomePageClient() {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));

    const updateHeader = () => {
      document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Arum Tenda, beranda">
          <span className="brand-icon">A</span>
          <span>ARUM TENDA<small>SEWA TENDA &amp; PERLENGKAPAN</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          {pages.map(([label, href]) => <Link key={href} href={href} aria-current={href === '/' ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <details className="social-menu">
            <summary>Socials <i className="bi bi-chevron-down nav-icon" aria-hidden="true" /></summary>
            <div className="social-options">
              <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp <b>↗</b></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <b>↗</b></a>
            </div>
          </details>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span />
          </button>
        </div>
      </header>

      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-label="Navigasi mobile" aria-hidden={!menuOpen}>
        {pages.map(([label, href, number]) => (
          <Link key={href} href={href} aria-current={href === '/' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
            {label} <span>{number}</span>
          </Link>
        ))}
      </nav>

      <main>
        <div className="home-wireframe">
          <section className="home-hero" aria-label="Sambutan">
            <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=88" alt="Tenda dan dekorasi untuk acara istimewa" fetchPriority="high" />
            <div className="home-hero-shade" />
            <div className="home-hero-copy">
              <p className="eyebrow light">ARUM TENDA · SEWA TENDA &amp; PERLENGKAPAN</p>
              <h1>Ruang indah<br />untuk <em>hari istimewa.</em></h1>
              <p>Sewa tenda dan perlengkapan acara yang rapi, nyaman, dan sesuai kebutuhan.</p>
              <Link className="button button-light" href="/katalog">Lihat pilihan tenda <span>↗</span></Link>
            </div>
          </section>

          <section className="home-intro">
            <div className="home-photo" role="img" aria-label="Suasana acara yang tertata" />
            <h2>Sewa Tenda<br />&amp;<br />Alat Pesta</h2>
          </section>

          <section className="home-packages" aria-label="Pilihan paket tenda">
            <div className="package-preview">
              <img src={packages[selectedPackage].image} alt={packages[selectedPackage].alt} />
              <span className="package-preview-label">{packages[selectedPackage].name.toUpperCase()}</span>
            </div>
            <div className="package-list" role="group" aria-label="Pilih paket tenda">
              {packages.map((item, index) => (
                <button className={`package-option${selectedPackage === index ? ' is-selected' : ''}`} type="button" aria-pressed={selectedPackage === index} key={item.name} onClick={() => setSelectedPackage(index)}>
                  <b>{item.name}</b><span>{item.description}</span><i>Jelajahi paket ↗</i>
                </button>
              ))}
            </div>
          </section>

          <section className="home-simulator">
            <p className="eyebrow">VISUALISASIKAN ACARA ANDA</p>
            <h2>Simulasikan Tenda Anda</h2>
            <Link className="button button-light" href="/simulasi">Mulai simulasi <span>↗</span></Link>
          </section>

          <section className="home-gallery">
            <div className="home-gallery-tiles">
              {Array.from({ length: 5 }, (_, index) => <Link href="/galeri" aria-label={`Lihat galeri tenda ${index + 1}`} key={index} />)}
            </div>
            <h2>Cuplikan Tenda</h2>
            <Link className="text-link" href="/galeri">Lihat semua galeri <span>↗</span></Link>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-icon">A</span><span>ARUM TENDA<small>SEWA TENDA &amp; PERLENGKAPAN</small></span>
        </Link>
        <p>Ruang yang nyaman untuk<br />momen yang berarti.</p>
        <div className="footer-links">
          <Link href="/tentang">Tentang</Link><Link href="/katalog">Katalog</Link><Link href="/galeri">Galeri</Link>
          <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp ↗</a>
        </div>
        <span className="copyright">© {year} ARUM TENDA · PROTOTIPE</span>
      </footer>
    </>
  );
}
