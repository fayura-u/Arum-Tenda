import './globals.css';
import '../styles/style.css';
import '../styles/features.css';
import SatinBackground from './components/satin-background';
import { LocalBusinessJsonLd, FaqJsonLd } from './components/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arumtenda.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Arum Tenda — Sewa Tenda & Alat Pesta Purbalingga',
    template: '%s | Arum Tenda',
  },
  description:
    'Jasa persewaan tenda pernikahan elegan, tenda acara keluarga, panggung, kanopi serut mewah, dan perlengkapan pesta terpercaya di Purbalingga , Cilacap, dan Banjarnegara. Survei lokasi, instalasi rapi, dan pelayanan profesional.',
  keywords: [
    'sewa tenda purbalingga',
    'sewa tenda pernikahan purbalingga',
    'sewa tenda purwokerto',
    'sewa tenda banyumas',
    'sewa tenda cilacap',
    'sewa tenda banjarnegara',
    'rental tenda hajatan purbalingga',
    'tenda dekorasi pernikahan purbalingga',
    'tenda serut mewah',
    'sewa alat pesta purbalingga',
    'sewa panggung banyumas',
    'rental kursi tiffany purwokerto',
    'sewa alat katering purbalingga',
    'tenda sarnafil purwokerto',
    'arum tenda',
    'arum tenda purbalingga',
    'vendor pernikahan banyumas raya',
  ],
  authors: [{ name: 'Arum Tenda', url: siteUrl }],
  creator: 'Arum Tenda',
  publisher: 'Arum Tenda',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Arum Tenda',
    title: 'Arum Tenda — Sewa Tenda & Alat Pesta Purbalingga',
    description:
      'Solusi sewa tenda pernikahan, kanopi serut mewah, panggung, dan perlengkapan pesta terpercaya di Purbalingga',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Arum Tenda — Sewa Tenda & Alat Pesta Purbalingga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arum Tenda — Sewa Tenda & Perlengkapan Acara Purbalingga',
    description:
      'Sewa tenda pernikahan, tenda serut, dan perlengkapan pesta di Purbalingga',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=85',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'ID-JT',
    'geo.placename': 'Purbalingga',
    'geo.position': '-7.3887;109.3564',
    ICBM: '-7.3887, 109.3564',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
        <LocalBusinessJsonLd />
        <FaqJsonLd />
      </head>
      <body>
        <SatinBackground />
        {children}
      </body>
    </html>
  );
}
