'use client';

import { useEffect, useState } from 'react';
import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';

const whatsappNumber = '6281234567890';
const storageKey = 'arum-tenda-catalog-v1';
const equipmentSeedKey = 'arum-tenda-equipment-seeded-v1';

const defaultProducts = [
  { id: 'roder', name: 'Tenda Roder', price: 85000, unit: 'm²', type: 'tent', description: 'Ruang luas tanpa banyak tiang tengah, cocok untuk acara besar.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=82' },
  { id: 'dekorasi', name: 'Tenda Dekorasi', price: 65000, unit: 'm²', type: 'tent', description: 'Kanopi dengan pilihan dekorasi untuk suasana yang lebih personal.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=82' },
  { id: 'sarnafil', name: 'Tenda Sarnafil', price: 350000, unit: '3 × 3 m', type: 'tent', description: 'Pilihan praktis untuk bazar, area penerima tamu, dan acara keluarga.', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=82' },
  { id: 'tableware', name: 'Paket Alat Makan', price: 18000, unit: 'set', type: 'equipment', description: 'Paket contoh berisi piring, sendok, garpu, dan gelas untuk jamuan.', image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=1100&q=82' },
  { id: 'glassware', name: 'Gelas & Glassware', price: 7000, unit: 'pcs', type: 'equipment', description: 'Pilihan gelas untuk melengkapi meja tamu dan meja jamuan.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1100&q=82' },
  { id: 'table-chair', name: 'Meja & Kursi', price: 45000, unit: 'set', type: 'equipment', description: 'Perlengkapan meja dan kursi untuk area makan atau penerima tamu.', image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1100&q=82' },
];

const galleryProducts = [
  ['Tenda Roder', 'photo-1519167758481-83f550bb49b3'],
  ['Tenda Dekorasi', 'photo-1464366400600-7168b8af9bc3'],
  ['Tenda Sarnafil', 'photo-1511795409834-ef04bbd61622'],
  ['Kursi Tiffany', 'photo-1507504031003-b417219a0fde'],
  ['Meja Jamuan', 'photo-1493857671505-72967e2e2760'],
  ['Peralatan Makan', 'photo-1513558161293-cdaf765edfd7'],
  ['Dekorasi Meja', 'photo-1492684223066-81342ee5ff30'],
  ['Kursi Futura', 'photo-1519225421980-715cb0215aed'],
  ['Lampu Dekorasi', 'photo-1507504031003-b417219a0fde'],
  ['Perlengkapan Pesta', 'photo-1519167758481-83f550bb49b3'],
].map(([name, photo]) => ({ name, image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=82` }));

const priceRows = [
  [['Tenda Roder', 'Rp xx.xxx,- / m²'], ['Tenda Dekorasi', 'Rp xx.xxx,-'], ['Tenda Sarnafil', 'Rp xx.xxx,-'], ['Tenda Plafon', 'Rp xx.xxx,-'], ['Meja Prasmanan', 'Rp xx.xxx,-'], ['Kursi Futura', 'Rp xx.xxx,-'], ['Kursi Tiffany', 'Rp xx.xxx,-'], ['Piring & Sendok', 'Rp xx.xxx,- / set'], ['Gelas', 'Rp xx.xxx,- / pcs'], ['Lampu Dekorasi', 'Rp xx.xxx,-']],
  [['Meja Bulat', 'Rp xx.xxx,-'], ['Meja Kotak', 'Rp xx.xxx,-'], ['Kursi Plastik', 'Rp xx.xxx,-'], ['Sarung Kursi', 'Rp xx.xxx,-'], ['Backdrop', 'Rp xx.xxx,-'], ['Karpet', 'Rp xx.xxx,- / m²'], ['Panggung', 'Rp xx.xxx,- / m²'], ['Peralatan Prasmanan', 'Rp xx.xxx,- / set'], ['Standing Fan', 'Rp xx.xxx,-'], ['Perlengkapan lainnya', 'Hubungi kami']],
];

function WhatsAppLink({ children, message }) {
  const text = message || 'Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.';
  return <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">{children}</a>;
}

function PriceTable({ rows, start }) {
  return <div className="price-table-wrap"><table className="price-table"><thead><tr><th>#</th><th>Nama Barang</th><th>Harga Sewa</th></tr></thead><tbody>{rows.map(([name, price], index) => <tr key={name}><td>{String(start + index).padStart(2, '0')}</td><td>{name}</td><td>{price}</td></tr>)}</tbody></table></div>;
}

export default function CatalogClient() {
  const [products, setProducts] = useState(defaultProducts);
  const [ready, setReady] = useState(false);
  const [category, setCategory] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailColor, setDetailColor] = useState({ hex: '#f0ece0', name: 'Ivory' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((product) => ({ ...product, type: product.type || (product.category === 'equipment' ? 'equipment' : 'tent') }));
          if (localStorage.getItem(equipmentSeedKey) !== 'done') {
            const ids = new Set(normalized.map((product) => product.id));
            const migrated = [...normalized, ...defaultProducts.filter((product) => product.type === 'equipment' && !ids.has(product.id))];
            setProducts(migrated);
            localStorage.setItem(storageKey, JSON.stringify(migrated));
          } else setProducts(normalized);
        }
      } else localStorage.setItem(equipmentSeedKey, 'done');
    } catch {
      setProducts(defaultProducts);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(storageKey, JSON.stringify(products));
      localStorage.setItem(equipmentSeedKey, 'done');
    }
  }, [products, ready]);

  useEffect(() => {
    const onEscape = (event) => { if (event.key === 'Escape') { setActivePhoto(null); setActiveProduct(null); setFormOpen(false); } };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const visibleProducts = products.filter((product) => category === 'all' || product.type === category);

  function saveProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = {
      id: editingProduct?.id || `product-${Date.now()}`,
      name: String(form.get('name')).trim(),
      price: Number(form.get('price')),
      unit: String(form.get('unit')).trim(),
      type: String(form.get('type')),
      image: String(form.get('image')).trim(),
      description: String(form.get('description')).trim(),
      specifications: String(form.get('specifications')).trim(),
    };
    setProducts((current) => editingProduct ? current.map((item) => item.id === editingProduct.id ? product : item) : [...current, product]);
    setFormOpen(false);
    setEditingProduct(null);
  }

  function openEditor(product = null) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  return <div className="subpage catalog-page">
    <SubpageHeader activePage="/katalog" />
    <main className="catalog-page-main">
      <section className="price-section">
        <div className="catalog-title-row"><div><p className="eyebrow">DAFTAR SEWA &amp; PERLENGKAPAN</p><h1>Pricelist</h1></div><p className="catalog-note">Harga contoh untuk prototipe. Detail ukuran, ketersediaan, dan penawaran dapat dikonfirmasi bersama tim kami.</p></div>
        <div className="price-board"><PriceTable rows={priceRows[0]} start={1} /><PriceTable rows={priceRows[1]} start={11} /></div>
        <p className="price-footnote">* Harga dan nama barang di atas masih berupa data contoh dan dapat diperbarui.</p>
      </section>

      <section className="catalog-gallery-section">
        <div className="gallery-title-row"><div><p className="eyebrow">PILIHAN PERLENGKAPAN</p><h2>Galeri Barang</h2></div><p>Klik gambar untuk melihat detail barang.</p></div>
        <div className="catalog-product-grid boxes-container">{galleryProducts.map((product) => <div className="box" key={product.name}><button className="catalog-product-card box-content" type="button" onClick={() => setActivePhoto(product)} aria-label={`Lihat ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" /><span>{product.name}</span></button></div>)}</div>
      </section>

      <section className="managed-catalog">
        <div className="section-heading"><div><p className="eyebrow">KATALOG PROTOTIPE</p><h2>Produk dan harga</h2></div><p className="section-note">Anda bisa mengubah daftar ini. Perubahan tersimpan di localStorage browser ini.</p></div>
        <div className="catalog-toolbar"><div className="catalog-tabs" role="group" aria-label="Filter katalog">
          {[['all', 'Semua'], ['tent', 'Tenda'], ['equipment', 'Peralatan']].map(([key, label]) => <button type="button" data-filter={key} className={`catalog-filter${category === key ? ' active' : ''}`} key={key} onClick={() => setCategory(key)}>{label}</button>)}
        </div><button className="admin-toggle" type="button" aria-expanded={adminOpen} onClick={() => setAdminOpen((open) => !open)}><span>{adminOpen ? '×' : '⚙'}</span> {adminOpen ? 'Tutup pengaturan' : 'Atur katalog'}</button></div>
        <div className="product-grid" aria-live="polite">{visibleProducts.length ? visibleProducts.map((product, index) => <article className="product-card" key={product.id}>
          <button className="product-open" type="button" onClick={() => { setActiveProduct(product); setDetailQuantity(1); setDetailColor({ hex: '#f0ece0', name: 'Ivory' }); }} aria-label={`Lihat detail ${product.name}`}>
            <div className="product-photo"><img src={product.image} alt={`Contoh ${product.name}`} loading="lazy" /><span className="product-number">PRODUK {String(index + 1).padStart(2, '0')}</span></div>
            <div className="product-info"><span className="product-category">{product.type === 'tent' ? 'TENDA' : 'PERLENGKAPAN ACARA'}</span><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-bottom"><div className="product-price"><small>MULAI DARI</small><strong>Rp {new Intl.NumberFormat('id-ID').format(product.price)} <em>/ {product.unit}</em></strong></div><span className="detail-link">Lihat detail ↗</span></div></div>
          </button>
        </article>) : <p className="empty-catalog">Belum ada produk pada kategori ini.</p>}</div>
        <p className="catalog-footnote">* Harga contoh untuk prototipe, belum termasuk ongkos kirim, pemasangan, maupun perlengkapan tambahan.</p>
        {adminOpen && <section className="catalog-admin"><div className="admin-heading"><div><p className="eyebrow">MODE PROTOTIPE</p><h3>Kelola katalog</h3><p>Perubahan tersimpan di browser ini saja, bukan ke server.</p></div><button className="admin-add" type="button" onClick={() => openEditor()}>＋ Tambah produk</button></div>
          <div className="admin-list">{products.map((product) => <div className="admin-row" key={product.id}><strong>{product.name}</strong><span>Rp {new Intl.NumberFormat('id-ID').format(product.price)} / {product.unit}</span><span title={product.image}>{product.image}</span><button type="button" onClick={() => openEditor(product)}>Ubah</button><button className="delete-product" type="button" onClick={() => { if (window.confirm(`Hapus ${product.name} dari katalog di browser ini?`)) setProducts((current) => current.filter((item) => item.id !== product.id)); }}>Hapus</button></div>)}</div>
        </section>}
      </section>
    </main>

    <SubpageFooter activePage="/katalog" />

    {activePhoto && <div className="simple-modal-backdrop" role="presentation" onClick={() => setActivePhoto(null)}><section className="catalog-lightbox" role="dialog" aria-modal="true" aria-label={`Pratinjau ${activePhoto.name}`} onClick={(event) => event.stopPropagation()}><button className="catalog-dialog-close" type="button" aria-label="Tutup pratinjau" onClick={() => setActivePhoto(null)}>×</button><img src={activePhoto.image} alt={activePhoto.name} /><div className="catalog-dialog-copy"><p className="eyebrow">PILIHAN PERLENGKAPAN</p><h2>{activePhoto.name}</h2><p>Contoh foto barang. Hubungi tim kami untuk mengetahui detail dan ketersediaannya.</p></div></section></div>}

    {activeProduct && <div className="simple-modal-backdrop" role="presentation" onClick={() => setActiveProduct(null)}><section className="catalog-lightbox" role="dialog" aria-modal="true" aria-label={`Detail ${activeProduct.name}`} onClick={(event) => event.stopPropagation()}><button className="catalog-dialog-close" type="button" aria-label="Tutup detail" onClick={() => setActiveProduct(null)}>×</button><img src={activeProduct.image} alt={activeProduct.name} /><div className="catalog-dialog-copy"><p className="eyebrow">{activeProduct.type === 'tent' ? 'KATALOG TENDA · SIMULASI WARNA' : 'KATALOG PERLENGKAPAN ACARA'}</p><h2>{activeProduct.name}</h2><p>Mulai Rp {new Intl.NumberFormat('id-ID').format(activeProduct.price)} / {activeProduct.unit}</p><p>{activeProduct.description}</p><details className="product-accordion"><summary>Spesifikasi Produk <span aria-hidden="true">＋</span></summary><div className="accordion-content">{activeProduct.specifications || `Kategori: ${activeProduct.type === 'tent' ? 'Tenda acara' : 'Perlengkapan acara'}\nSatuan harga: ${activeProduct.unit}\nKetersediaan: Konfirmasi melalui WhatsApp`}</div></details>
      {activeProduct.type === 'tent' && <div className="detail-color-picker"><p className="detail-label">PILIH WARNA KANOPI <span>{detailColor.name}</span></p><div className="detail-swatches" role="group" aria-label="Pilih warna kanopi">{[['#f0ece0', 'Ivory'], ['#9e2629', 'Marun'], ['#253c35', 'Hijau botol'], ['#d3a940', 'Kuning'], ['#536b88', 'Biru'], ['#b98b72', 'Terracotta']].map(([hex, name]) => <button className={`detail-swatch${detailColor.name === name ? ' active' : ''}`} type="button" key={name} data-color={hex} data-label={name} aria-label={name} aria-pressed={detailColor.name === name} style={{ '--swatch': hex }} onClick={() => setDetailColor({ hex, name })} />)}</div>
        <div className="detail-quantity"><span>JUMLAH</span><div><button type="button" className="quantity-change" data-step="-1" aria-label="Kurangi jumlah" onClick={() => setDetailQuantity((value) => Math.max(1, value - 1))}>−</button><output>{String(detailQuantity).padStart(2, '0')}</output><button type="button" className="quantity-change" data-step="1" aria-label="Tambah jumlah" onClick={() => setDetailQuantity((value) => Math.min(99, value + 1))}>+</button></div></div></div>}
      <WhatsAppLink message={`Halo Arum Tenda, saya tertarik dengan ${activeProduct.name} sebanyak ${detailQuantity} ${activeProduct.unit}.${activeProduct.type === 'tent' ? ` Warna kanopi yang saya pilih: ${detailColor.name}.` : ''} Mohon info ketersediaan dan penawaran.`}><span className="button button-dark">Tanya via WhatsApp ↗</span></WhatsAppLink></div></section></div>}

    {formOpen && <div className="simple-modal-backdrop" role="presentation" onClick={() => { setFormOpen(false); setEditingProduct(null); }}><section className="catalog-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title" onClick={(event) => event.stopPropagation()}><div className="dialog-head"><div><p className="eyebrow">EDIT PRODUK</p><h2 id="editor-title">{editingProduct ? 'Ubah produk' : 'Tambah produk'}</h2></div><button className="dialog-close" type="button" aria-label="Tutup" onClick={() => { setFormOpen(false); setEditingProduct(null); }}>×</button></div><form onSubmit={saveProduct}>
      <label>Nama produk<input name="name" defaultValue={editingProduct?.name || ''} required maxLength={60} /></label>
      <div className="form-row"><label>Harga mulai (Rp)<input name="price" type="number" min="0" defaultValue={editingProduct?.price ?? ''} required /></label><label>Satuan<input name="unit" defaultValue={editingProduct?.unit || ''} required maxLength={20} /></label></div>
      <label>Kategori<select name="type" defaultValue={editingProduct?.type || 'tent'}><option value="tent">Tenda</option><option value="equipment">Peralatan</option></select></label>
      <label>URL gambar<input name="image" type="url" defaultValue={editingProduct?.image || ''} required /></label>
      <label>Spesifikasi<textarea name="specifications" rows="3" defaultValue={editingProduct?.specifications || ''} /></label>
      <label>Deskripsi<textarea name="description" rows="3" defaultValue={editingProduct?.description || ''} maxLength={500} /></label>
      <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={() => { setFormOpen(false); setEditingProduct(null); }}>Batal</button><button className="button button-dark" type="submit">Simpan produk</button></div>
    </form></section></div>}
  </div>;
}
