'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubpageHeader from '@/app/components/subpage-header';
import SubpageFooter from '@/app/components/subpage-footer';

const whatsappNumber = '6281234567890';

export default function ProductDetailClient({ product }) {
  const defaultColor = product.colors?.[0] || {
    color_name: 'Standar',
    hex_code: '#ece7da',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=82',
  };

  const [activeColor, setActiveColor] = useState(defaultColor);
  const [selectedSpec, setSelectedSpec] = useState(product.prices?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const activeImage =
    activeColor?.image_url ||
    product.colors?.find((c) => c.image_url)?.image_url ||
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=82';

  const unit = selectedSpec?.unit || 'm²';
  const price = selectedSpec?.price || 0;
  const totalPrice = price * quantity;

  const waMessage = `Halo Arum Tenda, saya tertarik menyewa produk:\n\n*${product.name}*\n• Spesifikasi: ${selectedSpec?.spec_name || 'Standar'}\n• Pilihan Warna: ${activeColor?.color_name || 'Standar'}\n• Jumlah: ${quantity} ${unit}\n• Estimasi: Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}\n\nMohon info ketersediaan jadwal dan penawaran lengkap. Terima kasih.`;

  return (
    <div className="subpage">
      <SubpageHeader activePage="/katalog" />
      <main className="subpage-main" style={{ width: 'min(100% - 8vw, 1200px)', padding: '110px 0 90px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', color: '#6f756e', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'inherit' }}>Beranda</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/katalog" style={{ color: 'inherit' }}>Katalog</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Kolom Kiri: Visual & Galeri Warna */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                backgroundColor: '#f1f3f9',
                overflow: 'hidden',
                borderRadius: '2px',
                border: '1px solid #dedad0',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Varian Warna */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#f5f4ef', border: '1px solid #dedad0' }}>
                <p style={{ fontSize: '9px', letterSpacing: '0.12em', color: '#626a5f', margin: '0 0 10px', fontWeight: 600 }}>
                  PILIHAN VARIAN WARNA KAIN: <span style={{ color: 'var(--ink)' }}>{activeColor?.color_name}</span>
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.id || c.color_name}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      aria-label={`Pilih warna ${c.color_name}`}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: c.hex_code,
                        border: activeColor?.color_name === c.color_name ? '2px solid var(--green)' : '1px solid #a6a69c',
                        cursor: 'pointer',
                        transform: activeColor?.color_name === c.color_name ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.15s, border-color 0.15s',
                      }}
                      title={c.color_name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Detail & Pricelist Dealer */}
          <div>
            <p className="eyebrow">{product.category?.name?.toUpperCase() || 'KATALOG ARUM TENDA'}</p>
            <h1 style={{ fontSize: '38px', margin: '6px 0 16px', lineHeight: 1.1 }}>{product.name}</h1>
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#6c6f67', marginBottom: '28px' }}>
              {product.description || 'Pilihan sewa tenda dan perlengkapan pesta berkualitas tinggi dari Arum Tenda.'}
            </p>

            {/* Tabel Pricelist Spek Dealer */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600, color: '#4b5563', marginBottom: '10px' }}>
                PILIH SPESIFIKASI & DAFTAR HARGA:
              </p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {product.prices && product.prices.length > 0 ? (
                  product.prices.map((p) => {
                    const isSelected = selectedSpec?.id === p.id;
                    return (
                      <div
                        key={p.id || p.spec_name}
                        onClick={() => setSelectedSpec(p)}
                        style={{
                          padding: '14px 18px',
                          border: isSelected ? '1.5px solid var(--green)' : '1px solid #dedad0',
                          backgroundColor: isSelected ? '#f5f7f3' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'border-color 0.15s, background-color 0.15s',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)' }}>
                            {p.spec_name}
                          </strong>
                          {p.notes && (
                            <span style={{ fontSize: '10px', color: '#6f756e', marginTop: '2px', display: 'block' }}>
                              {p.notes}
                            </span>
                          )}
                          {p.min_order > 1 && (
                            <span style={{ fontSize: '9px', color: '#c89650', marginTop: '2px', display: 'block' }}>
                              Minimal order: {p.min_order} {p.unit}
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                            Rp {new Intl.NumberFormat('id-ID').format(p.price)}
                          </span>
                          <span style={{ fontSize: '10px', color: '#6f756e', display: 'block' }}>
                            / {p.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '12px', color: '#6f756e' }}>Hubungi tim kami untuk rincian harga sewa.</p>
                )}
              </div>
            </div>

            {/* Jumlah & Kalkulator Estimasi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '16px 0', borderTop: '1px solid #dedad0', borderBottom: '1px solid #dedad0' }}>
              <div>
                <span style={{ fontSize: '10px', letterSpacing: '0.08em', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '6px' }}>
                  JUMLAH ({unit.toUpperCase()})
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #dedad0', background: '#fff' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(selectedSpec?.min_order || 1, q - 1))}
                    style={{ border: 'none', background: 'none', padding: '8px 14px', fontSize: '14px', cursor: 'pointer' }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ border: 'none', background: 'none', padding: '8px 14px', fontSize: '14px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {price > 0 && (
                <div>
                  <span style={{ fontSize: '10px', letterSpacing: '0.08em', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '6px' }}>
                    ESTIMASI HARGA SEWA
                  </span>
                  <strong style={{ fontSize: '18px', color: 'var(--green)' }}>
                    Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}
                  </strong>
                </div>
              )}
            </div>

            {/* Tombol Pesan WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="button button-dark"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '12px' }}
            >
              Konsultasi & Pesan via WhatsApp ↗
            </a>

            <div style={{ marginTop: '20px' }}>
              <Link href="/katalog" style={{ fontSize: '11px', color: '#6f756e', textDecoration: 'underline' }}>
                ← Kembali ke Semua Katalog
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SubpageFooter activePage="/katalog" />
    </div>
  );
}
