import Link from 'next/link';
import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';
import { BreadcrumbJsonLd } from '@/app/components/json-ld';

export const metadata = {
  title: 'Kontak & Reservasi Sewa Tenda Purbalingga',
  description:
    'Hubungi konsultan Arum Tenda untuk konsultasi gratis, jadwal survei lokasi, dan reservasi paket tenda pernikahan di Purbalingga, Purwokerto, dan Banyumas Raya.',
  alternates: {
    canonical: '/kontak',
  },
};

const whatsappNumber = '6281234567890';
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.')}`;

export default function KontakPage() {
  const breadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Kontak & Reservasi', path: '/kontak' },
  ];

  return (
    <div className="subpage contact-page">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SubpageHeader activePage="/kontak" />
      <main className="subpage-main">
        <p className="eyebrow">ARUM TENDA · KONTAK &amp; KONSULTASI</p>
        <h1>Mari rencanakan acara istimewa Anda.</h1>
        <p className="contact-lead">
          Ceritakan konsep, tanggal, dan lokasi acara Anda. Tim Arum Tenda siap membantu mulai dari survei denah venue hingga rekomendasi paket tenda dan dekorasi yang paling sesuai.
        </p>

        <div className="contact-cards-grid">
          <div className="contact-card highlighted">
            <div>
              <span className="contact-card-badge">RESPON CEPAT</span>
              <h3>Konsultasi WhatsApp</h3>
              <p>Diskusikan kebutuhan acara secara langsung bersama tim konsultan kami untuk ketersediaan tanggal dan penawaran paket.</p>
              <strong className="contact-val">+62 812-3456-7890</strong>
            </div>
            <a className="button button-light" href={whatsappHref} target="_blank" rel="noreferrer">
              Chat via WhatsApp <span>↗</span>
            </a>
          </div>

          <div className="contact-card">
            <div>
              <span className="contact-card-badge">AREA OPERASIONAL</span>
              <h3>Kantor &amp; Workshop</h3>
              <p>Melayani pengantaran dan instalasi untuk Banyumas, Purwokerto, Cilacap, Purbalingga, Banjarnegara, dan sekitarnya.</p>
              <div className="contact-meta">
                <span><b>Jam Kerja:</b> Senin – Minggu, 08.00 – 21.00 WIB</span>
                <span><b>Survei Lokasi:</b> Dijadwalkan sesuai kesepakatan</span>
              </div>
            </div>
            <Link className="button button-dark" href="/katalog">
              Lihat Katalog Lengkap <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="booking-steps-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ALUR PEMESANAN</p>
              <h2>3 Langkah Mudah</h2>
            </div>
            <p className="section-note">Proses praktis dan terencana demi kelancaran hari bahagia Anda.</p>
          </div>
          <div className="booking-steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h4>Konsultasi &amp; Denah</h4>
              <p>Sampaikan perkiraan jumlah tamu, denah lokasi, dan tanggal acara. Tim kami siap survei ke lokasi bila diperlukan.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h4>Pilihan Paket &amp; Tenda</h4>
              <p>Pilih tipe kanopi, paduan warna kain, serta perlengkapan pendukung seperti panggung, kursi, dan pendingin udara.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h4>Pemasangan Tepat Waktu</h4>
              <p>Instalasi dilakukan H-1 atau H-2 sebelum acara oleh tim teknisi kami yang rapi, terstruktur, dan berpengalaman.</p>
            </div>
          </div>
        </div>
      </main>
      <SubpageFooter activePage="/kontak" />
    </div>
  );
}
