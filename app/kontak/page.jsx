import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';

export const metadata = {
  title: 'Kontak — Arum Tenda',
  description: 'Hubungi Arum Tenda untuk konsultasi sewa tenda dan perlengkapan acara.',
};

const whatsappHref = `https://wa.me/6281234567890?text=${encodeURIComponent('Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.')}`;

export default function KontakPage() {
  return <div className="subpage">
    <SubpageHeader activePage="/kontak" />
    <main className="subpage-main">
      <p className="eyebrow">ARUM TENDA · KONTAK</p>
      <h1>Mari rencanakan acara Anda.</h1>
      <p>Ceritakan tanggal, lokasi, dan kebutuhan acara. Tim Arum Tenda siap membantu memilih tenda serta perlengkapan yang tepat.</p>
      <a className="button button-dark" href={whatsappHref} target="_blank" rel="noreferrer">Hubungi kami via WhatsApp <span>↗</span></a>
    </main>
    <SubpageFooter activePage="/kontak" />
  </div>;
}
