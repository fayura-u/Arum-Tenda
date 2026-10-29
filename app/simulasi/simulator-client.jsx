'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';

const typeOptions = [
  { id: 'transparan', label: 'Transparan', description: 'Tampilan terbuka dan ringan', icon: 'type-transparent' },
  { id: 'kerut', label: 'Kerut', description: 'Kanopi dengan detail lipit', icon: 'type-kerut' },
  { id: 'blukat', label: 'Blukat', description: 'Bentuk lengkung yang teduh', icon: 'type-blukat' },
  { id: 'piramid', label: 'Pyramid', description: 'Atap tinggi dengan empat sisi', icon: 'type-piramid' },
];

const typeLabels = { transparan: 'TRANSPARAN', kerut: 'KERUT', blukat: 'BLUKAT', piramid: 'PYRAMID' };
export default function SimulatorClient() {
  const [tentType, setTentType] = useState('piramid');
  const [primaryColor, setPrimaryColor] = useState('#ece7da');
  const [secondaryColor, setSecondaryColor] = useState('#f05a3a');

  return <div className="subpage">
    <SubpageHeader activePage="/simulasi" />
    <main className="tent-simulator-page">
      <section className="tent-type-section">
        <div className="simulator-heading"><p className="eyebrow">RANCANG SESUAI KEBUTUHAN ACARA</p><h1>Pilih Tipe Tenda</h1><p>Pilih bentuk tenda untuk melihat pratinjau. Tipe Pyramid terpilih secara otomatis.</p></div>
        <div className="tent-type-grid" role="group" aria-label="Pilih tipe tenda">
          {typeOptions.map((type) => <button className={`tent-type-option${tentType === type.id ? ' is-selected' : ''}`} type="button" data-tent-type={type.id} aria-pressed={tentType === type.id} key={type.id} onClick={() => setTentType(type.id)}><span className={`tent-type-icon ${type.icon}`}><i /></span><b>{type.label}</b><small>{type.description}</small></button>)}
        </div>
      </section>

      <section className="tent-color-section">
        <div className="tent-preview-column">
          <div className="tent-preview-heading"><div><p className="eyebrow">PRATINJAU</p><h2>Tenda pilihan Anda</h2></div><span className="preview-type-badge">{typeLabels[tentType]}</span></div>
          <div className="tent-preview-scene" data-tent-type={tentType} style={{ '--fabric-primary': primaryColor, '--fabric-secondary': secondaryColor }}>
            <img className="tent-preview-photo" src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1500&q=85" alt="Suasana acara untuk melihat ilustrasi tenda" loading="lazy" />
            <div className="tent-preview-shade" /><div className="sim-tent"><div className="sim-tent-roof" /><div className="sim-tent-valance" /><div className="sim-tent-frame"><i /><i /><i /></div><div className="sim-tent-wall" /></div>
            <p className="preview-caption">ILUSTRASI BENTUK &amp; WARNA</p>
          </div>
          <p className="simulator-disclaimer">Pratinjau ini adalah ilustrasi untuk membantu memilih warna dan tipe tenda. Bentuk, bahan, dan detail pemasangan dapat berbeda di lokasi.</p>
        </div>

        <div className="tent-color-controls"><p className="eyebrow">SESUAIKAN TAMPILAN</p><h2>Atur Warna</h2><p className="color-controls-intro">Pilih warna utama dan aksen untuk melihat kombinasi pada pratinjau tenda.</p>
          <label className="color-picker-row" htmlFor="tent-primary-color"><span><b>Warna Utama</b><small>Kanopi utama</small></span><span className="color-input-wrap"><input id="tent-primary-color" type="color" value={primaryColor} aria-label="Pilih warna utama" onChange={(event) => setPrimaryColor(event.target.value)} /><output>{primaryColor.toUpperCase()}</output></span></label>
          <label className="color-picker-row" htmlFor="tent-secondary-color"><span><b>Warna Kedua</b><small>Aksen dan lis</small></span><span className="color-input-wrap"><input id="tent-secondary-color" type="color" value={secondaryColor} aria-label="Pilih warna kedua" onChange={(event) => setSecondaryColor(event.target.value)} /><output>{secondaryColor.toUpperCase()}</output></span></label>
          <Link className="button button-dark simulator-contact-link" href="/kontak">Tanyakan pilihan ini <span>↗</span></Link>
        </div>
      </section>
    </main>
    <SubpageFooter activePage="/simulasi" />
  </div>;
}
