import Link from 'next/link';
import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';

export const metadata = {
  title: 'Tentang — Arum Tenda',
  description: 'Tentang Arum Tenda, layanan sewa tenda dan perlengkapan acara.',
};

export default function TentangPage() {
  return <div className="subpage about-page">
    <SubpageHeader activePage="/tentang" />
    <main className="about-main">
      <section className="history-section">
        <h1>Sejarah</h1>
        <div className="history-grid">
          <article className="history-copy">
            <p className="eyebrow">CERITA KAMI</p>
            <h2>Berawal dari keinginan membantu setiap acara terasa istimewa.</h2>
            <p>
              Arum Tenda hadir untuk mendampingi keluarga dan penyelenggara acara menyiapkan tata ruang perayaan yang nyaman, kokoh, dan berkesan. Kami menyediakan beragam pilihan kanopi tenda, dekorasi kain serut elegan, serta perlengkapan pesta terpadu dengan standar kebersihan dan kerapian terbaik.
            </p>
            <p>
              Didukung oleh tim instalasi berpengalaman yang sigap dan teliti, kami berkomitmen memastikan setiap detail terpasang tepat waktu sehingga Anda dapat menikmati hari bahagia bersama keluarga dan tamu undangan dengan tenang dan penuh kehangatan.
            </p>
          </article>
          <div className="history-gallery" aria-label="Foto perjalanan Arum Tenda"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=82" alt="Suasana acara yang tertata" loading="lazy" /><img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=82" alt="Detail perlengkapan jamuan" loading="lazy" /><img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=82" alt="Dekorasi acara perayaan" loading="lazy" /><img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=700&q=82" alt="Persiapan meja untuk acara" loading="lazy" /></div>
        </div>
      </section>
      <section className="service-section"><p className="eyebrow">YANG KAMI BANTU SIAPKAN</p><h2>Jasa Sewa</h2><div className="service-cards"><article><div className="service-photo service-photo-one" role="img" aria-label="Tenda untuk acara keluarga" /><h3>Tenda Acara</h3><p>Pilihan tenda untuk acara keluarga, pertemuan, dan perayaan.</p></article><article><div className="service-photo service-photo-two" role="img" aria-label="Dekorasi tenda pernikahan" /><h3>Tenda Pernikahan</h3><p>Ruang dan perlengkapan untuk menyambut hari istimewa.</p></article><article><div className="service-photo service-photo-three" role="img" aria-label="Perlengkapan dan dekorasi acara" /><h3>Perlengkapan Pesta</h3><p>Kebutuhan pendukung acara yang bisa disesuaikan dengan rencana Anda.</p></article></div></section>
      <section className="coverage-section">
        <div>
          <p className="eyebrow">LAYANAN KAMI</p>
          <h2>Cakupan<br />Wilayah</h2>
          <p>
            Kami melayani pengiriman, instalasi, dan penataan penuh untuk seluruh wilayah Banyumas, Purwokerto, Cilacap, Purbalingga, Banjarnegara, serta area sekitarnya. Tim kami siap melakukan survei lokasi langsung untuk memastikan ukuran tenda dan konfigurasi ruang paling optimal bagi venue Anda.
          </p>
        </div>
        <div className="coverage-map" role="img" aria-label="Ilustrasi penanda lokasi layanan"><span className="map-ring" /><svg viewBox="0 0 80 100" aria-hidden="true"><path d="M40 95S7 59 7 39a33 33 0 1 1 66 0c0 20-33 56-33 56Z" /><circle cx="40" cy="39" r="10" /></svg><span className="map-caption">AREA LAYANAN</span></div>
      </section>
      <section className="about-cta"><h2>Hubungi Sekarang!</h2><Link className="button button-light" href="/kontak">Mulai konsultasi <span>↗</span></Link></section>
    </main>
    <SubpageFooter activePage="/tentang" />
  </div>;
}
