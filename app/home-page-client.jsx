'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const whatsappNumber = '6281234567890';
const instagramUrl = 'https://www.instagram.com/arumtenda/';

const pages = [
  ['Beranda', '/', '00'],
  ['Tentang', '/tentang', '01'],
  ['Katalog', '/katalog', '02'],
  ['Galeri', '/galeri', '03'],
  ['Simulasi Tenda', '/simulasi', '04'],
];

const featuredPackages = [
  {
    number: '01 · PAKET',
    category: 'TENDA & DEKORASI INTIM',
    name: 'Paket Akad & Lamaran',
    description: 'Set tenda intim dengan kain serut elegan, karpet, kursi tiffany, dan tata lampu hangat untuk momen sakral.',
    price: '1.850.000',
    unit: 'mulai / hari',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=82',
    alt: 'Dekorasi tenda akad nikah dan lamaran intim',
  },
  {
    number: '02 · PAKET',
    category: 'TENDA PLAFON / DEKORASI',
    name: 'Paket Resepsi Rumah',
    description: 'Solusi lengkap tenda plafon dekorasi, panggung pelaminan, meja prasmanan, dan kipas blower pendingin.',
    price: '3.500.000',
    unit: 'mulai / hari',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=82',
    alt: 'Tenda resepsi pernikahan dekorasi rumah lengkap',
  },
  {
    number: '03 · PAKET',
    category: 'TENDA TRANSPARAN / VIP',
    name: 'Paket VIP & Event Spesial',
    description: 'Kombinasi tenda transparan modern, AC standing, tata pencahayaan mewah, dan flooring kayu vinyl.',
    price: '6.200.000',
    unit: 'mulai / hari',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=82',
    alt: 'Tenda transparan mewah untuk pesta malam hari',
  },
];

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  'Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.',
)}`;

export default function HomePageClient() {
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
          {pages.map(([label, href]) => (
            <Link key={href} href={href} aria-current={href === '/' ? 'page' : undefined}>
              {label}
            </Link>
          ))}
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
        {/* HERO SECTION — Figma High-Fidelity */}
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=88"
            alt="Suasana acara dan tenda pernikahan yang tertata elegan"
            fetchPriority="high"
          />
          <div className="hero-overlay" />
          <div className="hero-copy">
            <p className="eyebrow light">TENTANG ACARA ANDA, KAMI YANG SIAPKAN</p>
            <h1>Ruang indah<br />untuk <em>hari istimewa.</em></h1>
            <p className="hero-desc">Sewa tenda dan perlengkapan acara yang rapi, nyaman, dan sesuai kebutuhan.</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/katalog">Lihat katalog <span>↓</span></Link>
              <a className="button button-outline" href={whatsappHref} target="_blank" rel="noreferrer">Tanya ketersediaan <span>↗</span></a>
            </div>
          </div>
          <div className="hero-foot">
            <span>SEWA TENDA · DEKORASI · PERLENGKAPAN</span>
            <Link href="/tentang">KENALI ARUM TENDA <span>↓</span></Link>
          </div>
          <div className="hero-chip">
            <span className="chip-dot" /> Melayani acara keluarga &amp; pernikahan
          </div>
        </section>

        {/* 01 — TENTANG KAMI */}
        <section className="intro section-pad" id="about">
          <div className="section-kicker">
            <p className="eyebrow">01 — TENTANG KAMI</p>
            <span>MITRA ACARA ANDA</span>
          </div>
          <div className="intro-grid">
            <h2>Persiapan yang baik<br />membuat momen <em>lebih berarti.</em></h2>
            <div className="intro-copy">
              <p>Arum Tenda membantu menyiapkan ruang acara yang nyaman dan tertata. Dari pemilihan tenda sampai perlengkapan pendukung, kami siap menjadi mitra untuk hari yang Anda rayakan.</p>
              <p className="muted-copy">Kami percaya setiap acara punya cerita dan kebutuhan yang berbeda. Ceritakan rencana Anda, lalu kita susun pilihan yang paling sesuai.</p>
              <a className="text-link" href={whatsappHref} target="_blank" rel="noreferrer">Ceritakan rencana acara Anda <span>↗</span></a>
            </div>
          </div>
          <div className="value-row">
            <div>
              <b>01</b>
              <span>Konsultasi sesuai kebutuhan</span>
            </div>
            <div>
              <b>02</b>
              <span>Pilihan paket yang fleksibel</span>
            </div>
            <div>
              <b>03</b>
              <span>Persiapan acara lebih praktis</span>
            </div>
          </div>
          <div className="section-route-links">
            <span>SELANJUTNYA</span>
            <Link href="/katalog">Lihat katalog tenda <b>↓</b></Link>
          </div>
        </section>

        {/* 02 — KATALOG PILIHAN */}
        <section className="catalog section-pad" id="catalog">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 — KATALOG SEWA &amp; PERLENGKAPAN</p>
              <h2>Tenda dan kebutuhan<br /><em>acara Anda.</em></h2>
            </div>
            <p className="section-note">Pilihan paket rekomendasi dan perlengkapan pendukung acara untuk hari istimewa Anda.</p>
          </div>

          <div className="product-grid" style={{ marginTop: '35px' }}>
            {featuredPackages.map((pkg) => (
              <article className="product-card" key={pkg.name}>
                <div className="product-photo">
                  <img src={pkg.image} alt={pkg.alt} loading="lazy" />
                  <span className="product-number">{pkg.number}</span>
                </div>
                <div className="product-info">
                  <span className="product-category">{pkg.category}</span>
                  <h3>{pkg.name}</h3>
                  <p className="product-description">{pkg.description}</p>
                  <div className="product-bottom">
                    <div className="product-price">
                      <small>Mulai</small>
                      <strong>Rp {pkg.price}</strong> <em>/{pkg.unit.split('/')[1] || 'hari'}</em>
                    </div>
                    <Link className="order-link" href="/katalog">Pilih paket ↗</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="catalog-footnote">* Estimasi paket rekomendasi. Ukuran, tata letak, dan perlengkapan tambahan dapat disesuaikan saat konsultasi bersama tim kami.</p>
          
          <div className="section-route-links">
            <span>LEBIH BANYAK PILIHAN</span>
            <Link href="/katalog">Buka Katalog Lengkap <b>↗</b></Link>
          </div>
        </section>

        {/* 03 — GALERI INSPIRASI */}
        <section className="gallery section-pad" id="gallery">
          <div className="section-heading gallery-heading">
            <div>
              <p className="eyebrow">03 — GALERI TENDA</p>
              <h2>Inspirasi dari<br /><em>setiap perayaan.</em></h2>
            </div>
            <div className="gallery-intro">
              <p>Dokumentasi suasana dan inspirasi tata ruang acara. Lihat ragam dekorasi untuk perayaan istimewa Anda.</p>
              <Link className="text-link" href="/galeri">Kunjungi Galeri Penuh <span>↗</span></Link>
            </div>
          </div>
          <div className="gallery-grid">
            <Link className="gallery-tile tile-tall" href="/galeri">
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=82" alt="Inspirasi dekorasi dan tata ruang acara" loading="lazy" />
              <span className="gallery-caption">
                <small>01 · DEKORASI</small>
                <b>Ruang untuk berkumpul</b>
              </span>
              <i>↗</i>
            </Link>
            <Link className="gallery-tile" href="/galeri">
              <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=82" alt="Meja perjamuan untuk acara spesial" loading="lazy" />
              <span className="gallery-caption">
                <small>02 · PERJAMUAN</small>
                <b>Detail yang menyambut</b>
              </span>
              <i>↗</i>
            </Link>
            <Link className="gallery-tile" href="/galeri">
              <img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=82" alt="Persiapan acara perayaan di luar ruang" loading="lazy" />
              <span className="gallery-caption">
                <small>03 · PERAYAAN</small>
                <b>Hari yang dinanti</b>
              </span>
              <i>↗</i>
            </Link>
          </div>
          <div className="section-route-links">
            <span>COCOKKAN DENGAN TEMA ACARA</span>
            <Link href="/simulasi">Coba Simulator Tenda <b>↗</b></Link>
          </div>
        </section>

        {/* 04 — SIMULATOR INTERAKTIF (LIGHT/OFF-WHITE EDITORIAL) */}
        <section className="home-simulator-editorial" id="simulasi-preview">
          <div className="home-simulator-grid">
            <div className="home-simulator-content">
              <p className="eyebrow">04 — SIMULATOR INTERAKTIF</p>
              <h2>Simulasikan Jenis &amp;<br /><em>Warna Tenda.</em></h2>
              <p className="home-simulator-desc">
                Eksplorasi ragam pilihan kanopi—mulai dari tenda transparan, plafon serut, blukat, hingga paduan warna kain impian Anda secara real-time sebelum memesan.
              </p>
              <div className="simulator-feature-tags">
                <span className="simulator-tag">✦ Kanopi Transparan</span>
                <span className="simulator-tag">✦ Plafon Serut</span>
                <span className="simulator-tag">✦ Drapery VIP</span>
                <span className="simulator-tag">✦ Ambient Lighting</span>
              </div>
              <div className="simulator-swatches-preview">
                <span className="simulator-swatches-label">Pilihan Palet:</span>
                <div className="simulator-swatch-dots">
                  <span className="mini-swatch" style={{ background: '#f5f0e6' }} title="Broken White / Ivory" />
                  <span className="mini-swatch" style={{ background: '#233729' }} title="Forest Green" />
                  <span className="mini-swatch" style={{ background: '#c89650' }} title="Warm Gold" />
                  <span className="mini-swatch" style={{ background: '#b85b4b' }} title="Terracotta" />
                  <span className="mini-swatch" style={{ background: '#222f3e' }} title="Midnight Navy" />
                </div>
              </div>
              <Link className="button button-dark" href="/simulasi">
                Buka Simulator Tenda <span>↗</span>
              </Link>
            </div>

            <div className="home-simulator-preview-card">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=82"
                alt="Simulasi kanopi dan dekorasi pencahayaan tenda pesta"
                loading="lazy"
              />
              <span className="simulator-preview-badge">PREVIEW INTERAKTIF · 3D CANOPY</span>
              <div className="simulator-preview-caption">
                <div>
                  <h4>Tenda Plafon Serut &amp; Warm Light</h4>
                  <p>Kombinasi kain ivory &amp; tata lampu gantung temaram</p>
                </div>
                <Link className="caption-action" href="/simulasi">
                  Kustomisasi ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — CLOSING CTA (DEEP FOREST GREEN) */}
        <section className="closing-cta">
          <div>
            <p className="eyebrow light">SIAP MERENCANAKAN ACARA?</p>
            <h2>Mari siapkan<br /><em>ruang terbaiknya.</em></h2>
            <p className="closing-cta-sub">
              Konsultasikan konsep, denah tata letak, dan jadwal acara Anda langsung bersama tim Arum Tenda.
            </p>
          </div>
          <a className="button button-whatsapp-pill" href={whatsappHref} target="_blank" rel="noreferrer">
            Pesan langsung via WhatsApp <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <Link className="brand footer-brand" href="/">
            <span className="brand-icon">A</span>
            <span>ARUM TENDA<small>SEWA TENDA &amp; PERLENGKAPAN</small></span>
          </Link>
          <p className="footer-tagline">
            Ruang yang nyaman untuk<br />momen yang berarti.
          </p>
          <div className="footer-links-grid">
            <div className="footer-nav-col">
              <Link href="/tentang">TENTANG</Link>
              <a href={instagramUrl} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            </div>
            <div className="footer-nav-col">
              <Link href="/katalog">KATALOG</Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer">WHATSAPP ↗</a>
            </div>
          </div>
        </div>
        <div className="footer-sub">
          <span className="copyright">© {year} ARUM TENDA</span>
          <span className="footer-legal">ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </>
  );
}
