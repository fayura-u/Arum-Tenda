import SimulatorClient from './simulator-client';
import { BreadcrumbJsonLd } from '@/app/components/json-ld';

export const metadata = {
  title: 'Simulasi Ukuran & Warna Tenda',
  description:
    'Kalkulator dan simulator interaktif untuk merancang ukuran tenda dan kombinasi warna kain serut yang pas untuk venue acara Anda.',
  alternates: {
    canonical: '/simulasi',
  },
};

export default function SimulasiPage() {
  const breadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Simulasi Tenda', path: '/simulasi' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SimulatorClient />
    </>
  );
}
