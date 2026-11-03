'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import './admin.css';
import { logoutAdminAction } from '@/app/actions/auth';
import { createProductAction, updateProductAction, deleteProductAction } from '@/app/actions/catalog';
import { createGalleryItemAction, deleteGalleryItemAction } from '@/app/actions/gallery';
import { uploadProductImage } from '@/app/actions/media';

export default function AdminClient({
  initialUser,
  initialProducts = [],
  initialGallery = [],
  initialCategories = [],
}) {
  const router = useRouter();

  // Navigation tab: 'products' | 'gallery' | 'media'
  const [activeTab, setActiveTab] = useState('products');
  const [selectedRowId, setSelectedRowId] = useState(initialProducts[0]?.id || null);
  const [productPage, setProductPage] = useState(1);

  // Data states
  const [products, setProducts] = useState(initialProducts);
  const [gallery, setGallery] = useState(initialGallery);
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (initialGallery) setGallery(initialGallery);
  }, [initialGallery]);

  useEffect(() => {
    if (initialCategories) setCategories(initialCategories);
  }, [initialCategories]);

  // Global feedback alert
  const [feedback, setFeedback] = useState(null);

  // Product filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Gallery filters
  const [galleryTypeFilter, setGalleryTypeFilter] = useState('all');

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Product Form Fields
  const [prodForm, setProdForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    is_active: true,
    prices: [{ spec_name: 'Standar Bentang 10m', price: 85000, unit: 'm²', min_order: 1, notes: '', order_position: 1 }],
    colors: [{ color_name: 'Putih Bersih', hex_code: '#ffffff', image_url: '', order_position: 1 }],
  });

  // Gallery Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [submittingGallery, setSubmittingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    tent_type: 'transparan',
    image_url: '',
    instagram_url: '',
    is_featured: false,
  });

  // Media Manager state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');

  // -------------------------------------------------------------
  // STATS COMPUTATION
  // -------------------------------------------------------------
  const totalPricesCount = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.prices?.length || 0), 0);
  }, [products]);

  // -------------------------------------------------------------
  // FILTERED PRODUCTS
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        categoryFilter === 'all' ||
        p.category_id === categoryFilter ||
        p.category?.slug === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.is_active : !p.is_active);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const productPageSize = 6;
  const productPageCount = Math.max(1, Math.ceil(filteredProducts.length / productPageSize));
  const paginationStart = Math.max(1, Math.min(productPage - 2, productPageCount - 4));
  const visibleProductPages = Array.from(
    { length: Math.min(5, productPageCount) },
    (_, index) => paginationStart + index,
  );
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize,
  );

  useEffect(() => {
    setProductPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    setProductPage((page) => Math.min(page, productPageCount));
  }, [productPageCount]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.admin-view', { y: 8, opacity: 0.65 }, { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' });
  }, [activeTab]);

  useEffect(() => {
    const selectedRow = document.querySelector('.admin-table tr.is-selected');
    if (selectedRow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(selectedRow, { x: 8, opacity: 0.72 }, { x: 0, opacity: 1, duration: 0.24, ease: 'power2.out' });
    }
  }, [selectedRowId]);

  // -------------------------------------------------------------
  // FILTERED GALLERY
  // -------------------------------------------------------------
  const filteredGallery = useMemo(() => {
    return gallery.filter((g) => {
      return galleryTypeFilter === 'all' || g.tent_type.toLowerCase() === galleryTypeFilter.toLowerCase();
    });
  }, [gallery, galleryTypeFilter]);

  // -------------------------------------------------------------
  // LOGOUT HANDLER
  // -------------------------------------------------------------
  async function handleLogout() {
    if (!confirm('Apakah Anda yakin ingin keluar dari dasbor CMS?')) return;
    try {
      await logoutAdminAction();
    } catch (err) {
      console.warn('Logout action note:', err);
    }
    window.location.href = '/login';
  }

  // -------------------------------------------------------------
  // PRODUCT MODAL HANDLERS
  // -------------------------------------------------------------
  function openCreateProductModal() {
    setEditingProduct(null);
    setProdForm({
      name: '',
      slug: '',
      category_id: categories[0]?.id || '',
      description: '',
      is_active: true,
      prices: [
        { spec_name: 'Standar Bentang 10m', price: 85000, unit: 'm²', min_order: 1, notes: '', order_position: 1 },
      ],
      colors: [
        { color_name: 'Putih Bersih', hex_code: '#ffffff', image_url: '', order_position: 1 },
      ],
    });
    setProductModalOpen(true);
  }

  function openEditProductModal(product) {
    setEditingProduct(product);
    setProdForm({
      name: product.name || '',
      slug: product.slug || '',
      category_id: product.category_id || '',
      description: product.description || '',
      is_active: product.is_active ?? true,
      prices:
        product.prices && product.prices.length > 0
          ? product.prices.map((p, idx) => ({
              spec_name: p.spec_name,
              price: p.price,
              unit: p.unit,
              min_order: p.min_order ?? 1,
              notes: p.notes || '',
              order_position: p.order_position ?? idx + 1,
            }))
          : [{ spec_name: 'Standar', price: 0, unit: 'm²', min_order: 1, notes: '', order_position: 1 }],
      colors:
        product.colors && product.colors.length > 0
          ? product.colors.map((c, idx) => ({
              color_name: c.color_name,
              hex_code: c.hex_code,
              image_url: c.image_url || '',
              order_position: c.order_position ?? idx + 1,
            }))
          : [{ color_name: 'Putih Bersih', hex_code: '#ffffff', image_url: '', order_position: 1 }],
    });
    setProductModalOpen(true);
  }

  function handleProductNameChange(e) {
    const name = e.target.value;
    // Auto generate slug jika produk baru
    if (!editingProduct) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setProdForm((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setProdForm((prev) => ({ ...prev, name }));
    }
  }

  // Baris Harga (Prices)
  function addPriceRow() {
    setProdForm((prev) => ({
      ...prev,
      prices: [
        ...prev.prices,
        {
          spec_name: '',
          price: 50000,
          unit: prev.prices[0]?.unit || 'm²',
          min_order: 1,
          notes: '',
          order_position: prev.prices.length + 1,
        },
      ],
    }));
  }

  function removePriceRow(index) {
    if (prodForm.prices.length <= 1) {
      alert('Setidaknya harus ada minimal 1 baris harga spesifikasi.');
      return;
    }
    setProdForm((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, idx) => idx !== index),
    }));
  }

  function updatePriceRow(index, field, value) {
    setProdForm((prev) => {
      const next = [...prev.prices];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, prices: next };
    });
  }

  // Baris Warna & Foto (Colors)
  function addColorRow() {
    setProdForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          color_name: '',
          hex_code: '#ece7da',
          image_url: '',
          order_position: prev.colors.length + 1,
        },
      ],
    }));
  }

  function removeColorRow(index) {
    if (prodForm.colors.length <= 1) {
      alert('Setidaknya harus ada minimal 1 varian warna.');
      return;
    }
    setProdForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index),
    }));
  }

  function updateColorRow(index, field, value) {
    setProdForm((prev) => {
      const next = [...prev.colors];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, colors: next };
    });
  }

  // Upload foto langsung untuk varian warna tertentu
  async function handleColorImageUpload(index, file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setFeedback({ type: 'info', text: 'Mengunggah gambar ke bucket arum-media...' });
    const res = await uploadProductImage(formData);

    if (res.success && res.url) {
      updateColorRow(index, 'image_url', res.url);
      setFeedback({ type: 'success', text: 'Gambar varian berhasil diunggah!' });
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal mengunggah foto varian.' });
    }
  }

  // Submit Simpan / Update Produk
  async function handleSubmitProduct(e) {
    e.preventDefault();
    setSubmittingProduct(true);
    setFeedback(null);

    const payload = {
      name: prodForm.name.trim(),
      slug: prodForm.slug.trim(),
      category_id: prodForm.category_id || null,
      description: prodForm.description.trim() || null,
      is_active: prodForm.is_active,
      prices: prodForm.prices.map((p, i) => ({
        spec_name: p.spec_name.trim(),
        price: Number(p.price),
        unit: p.unit.trim(),
        min_order: Number(p.min_order) || 1,
        notes: p.notes?.trim() || null,
        order_position: i + 1,
      })),
      colors: prodForm.colors.map((c, i) => ({
        color_name: c.color_name.trim(),
        hex_code: c.hex_code.trim(),
        image_url: c.image_url?.trim() || null,
        order_position: i + 1,
      })),
    };

    let res;
    if (editingProduct) {
      res = await updateProductAction(editingProduct.id, payload);
    } else {
      res = await createProductAction(payload);
    }

    setSubmittingProduct(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        text: editingProduct
          ? `Produk "${payload.name}" berhasil diperbarui!`
          : `Produk baru "${payload.name}" berhasil disimpan ke Supabase!`,
      });
      setProductModalOpen(false);
      router.refresh();
      // Optimistic update state lokal
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === editingProduct.id
              ? {
                  ...item,
                  ...payload,
                  category: categories.find((c) => c.id === payload.category_id) || item.category,
                }
              : item
          )
        );
      } else {
        setProducts((prev) => [
          {
            id: res.data?.id || `new-${Date.now()}`,
            ...payload,
            category: categories.find((c) => c.id === payload.category_id),
          },
          ...prev,
        ]);
      }
    } else {
      setFeedback({
        type: 'error',
        text: res.error || 'Terjadi kesalahan saat memproses data produk.',
      });
    }
  }

  // Hapus Produk
  async function handleDeleteProduct(id, name) {
    if (
      !confirm(
        `Hapus produk "${name}"?\n\nPerhatian: Seluruh spesifikasi harga dan varian warna terkait akan ikut terhapus secara otomatis (ON DELETE CASCADE).`
      )
    ) {
      return;
    }

    setFeedback(null);
    const res = await deleteProductAction(id);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: 'success', text: `Produk "${name}" berhasil dihapus dari database.` });
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus produk.' });
    }
  }

  // -------------------------------------------------------------
  // GALLERY HANDLERS
  // -------------------------------------------------------------
  function openCreateGalleryModal() {
    setGalleryForm({
      title: '',
      tent_type: 'transparan',
      image_url: '',
      instagram_url: '',
      is_featured: false,
    });
    setGalleryModalOpen(true);
  }

  async function handleGalleryImageUpload(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setFeedback({ type: 'info', text: 'Mengunggah foto galeri...' });
    const res = await uploadProductImage(formData);

    if (res.success && res.url) {
      setGalleryForm((prev) => ({ ...prev, image_url: res.url }));
      setFeedback({ type: 'success', text: 'Foto galeri berhasil diunggah ke storage!' });
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal mengunggah foto.' });
    }
  }

  async function handleSubmitGallery(e) {
    e.preventDefault();
    setSubmittingGallery(true);
    setFeedback(null);

    const payload = {
      title: galleryForm.title.trim(),
      tent_type: galleryForm.tent_type,
      image_url: galleryForm.image_url.trim(),
      instagram_url: galleryForm.instagram_url.trim() || null,
      is_featured: galleryForm.is_featured,
    };

    const res = await createGalleryItemAction(payload);
    setSubmittingGallery(false);

    if (res.success) {
      setFeedback({ type: 'success', text: `Foto "${payload.title}" berhasil ditambahkan ke Galeri!` });
      setGalleryModalOpen(false);
      setGallery((prev) => [
        {
          id: res.data?.id || `new-gal-${Date.now()}`,
          ...payload,
        },
        ...prev,
      ]);
      router.refresh();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menyimpan item galeri.' });
    }
  }

  async function handleDeleteGallery(id, title) {
    if (!confirm(`Hapus foto "${title}" dari galeri?`)) return;

    setFeedback(null);
    const res = await deleteGalleryItemAction(id);

    if (res.success) {
      setGallery((prev) => prev.filter((g) => g.id !== id));
      setFeedback({ type: 'success', text: `Foto "${title}" berhasil dihapus dari galeri.` });
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal menghapus item galeri.' });
    }
  }

  // -------------------------------------------------------------
  // MEDIA UPLOADER HANDLER (TAB 3)
  // -------------------------------------------------------------
  async function handleStandaloneUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadProductImage(formData);
    setUploadingMedia(false);

    if (res.success && res.url) {
      setUploadedFiles((prev) => [
        { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB', url: res.url, time: 'Baru saja' },
        ...prev,
      ]);
      setFeedback({ type: 'success', text: `File "${file.name}" berhasil diunggah ke bucket arum-media!` });
    } else {
      setFeedback({ type: 'error', text: res.error || 'Gagal mengunggah file.' });
    }
  }

  function copyToClipboard(url) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  }

  return (
    <div className="admin-shell">
    <div className="admin-app">
      {/* ============================================================ */}
      {/* SIDEBAR                                                      */}
      {/* ============================================================ */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-logo">A</div>
          <div className="admin-brand-info">
            <h2>ARUM TENDA</h2>
            <small>CMS PENGELOLAAN</small>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            aria-label="Katalog Produk"
            aria-current={activeTab === 'products' ? 'page' : undefined}
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="admin-nav-icon">
              <span>📦</span>
              <i className="bi bi-grid-1x2-fill" aria-hidden="true" />
              <span>Katalog Produk</span>
            </span>
            <span className="admin-nav-badge">{products.length}</span>
          </button>

          <button
            type="button"
            aria-label="Galeri Acara"
            aria-current={activeTab === 'gallery' ? 'page' : undefined}
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span className="admin-nav-icon">
              <span>🖼️</span>
              <i className="bi bi-images" aria-hidden="true" />
              <span>Galeri Acara</span>
            </span>
            <span className="admin-nav-badge">{gallery.length}</span>
          </button>

          <button
            type="button"
            aria-label="Media Storage"
            aria-current={activeTab === 'media' ? 'page' : undefined}
            className={`admin-nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className="admin-nav-icon">
              <span>📁</span>
              <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
              <span>Media Storage</span>
            </span>
            <span className="admin-nav-badge">5 MB</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {initialUser?.email ? initialUser.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-email" title={initialUser?.email || 'admin@arumtenda.com'}>
                {initialUser?.email || 'admin@arumtenda.com'}
              </span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <Link href="/" target="_blank" className="admin-sidebar-btn" title="Buka website publik">
              <span>Website ↗</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-sidebar-btn"
              style={{ color: '#fca5a5' }}
              title="Keluar dari CMS"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT                                                 */}
      {/* ============================================================ */}
      <main className="admin-content">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span className="admin-eyebrow">ARUM TENDA / CMS</span>
            <h1>
              {activeTab === 'products' && 'Produk'}
              {activeTab === 'gallery' && 'Galeri'}
              {activeTab === 'media' && 'Media'}
            </h1>
            <p>
              {activeTab === 'products' && `${filteredProducts.length} produk ditemukan`}
              {activeTab === 'gallery' && `${filteredGallery.length} foto ditemukan`}
              {activeTab === 'media' && 'Kelola file media situs.'}
            </p>
          </div>

          <div className="admin-topbar-actions">
            {activeTab === 'products' && (
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={openCreateProductModal}
              >
                <span>＋</span> Tambah Produk Baru
              </button>
            )}
            {activeTab === 'gallery' && (
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={openCreateGalleryModal}
              >
                <span>＋</span> Tambah Foto Galeri
              </button>
            )}
            <div className="admin-icon-button" aria-hidden="true">
              <i className="bi bi-bell" aria-hidden="true" />
              <span className="admin-notification-dot" />
            </div>
            <div className="admin-top-avatar" title={initialUser?.email || 'Admin'}>
              {initialUser?.email ? initialUser.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <Link
              href="/katalog"
              target="_blank"
              className="admin-btn admin-btn-secondary"
            >
              Lihat Katalog Live ↗
            </Link>
          </div>
        </header>

        {/* STATS OVERVIEW */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Total Produk</div>
              <div className="admin-stat-value">{products.length}</div>
            </div>
            <div className="admin-stat-icon">📦</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Baris Harga Dealer</div>
              <div className="admin-stat-value">{totalPricesCount}</div>
            </div>
            <div className="admin-stat-icon">🏷️</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Dokumentasi Galeri</div>
              <div className="admin-stat-value">{gallery.length}</div>
            </div>
            <div className="admin-stat-icon">🖼️</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-label">Status Storage Bucket</div>
              <div className="admin-stat-value" style={{ fontSize: '16px', color: '#16a34a' }}>
                arum-media (Aktif)
              </div>
            </div>
            <div className="admin-stat-icon">☁️</div>
          </div>
        </section>

        {/* BODY AREA */}
        <div className="admin-body">
          {/* FEEDBACK ALERT */}
          {feedback && (
            <div
              className={`admin-alert ${
                feedback.type === 'success'
                  ? 'admin-alert-success'
                  : feedback.type === 'info'
                  ? 'admin-alert-neutral'
                  : 'admin-alert-error'
              }`}
            >
              <span>{feedback.text}</span>
              <button
                type="button"
                className="admin-alert-close"
                onClick={() => setFeedback(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: KATALOG PRODUK                                        */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="admin-view">
            <div className="admin-card">
              <div className="admin-list-tabs" role="tablist" aria-label="Filter status produk">
                <button type="button" role="tab" aria-selected={statusFilter === 'all'} className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>Semua produk <span>{products.length}</span></button>
                <button type="button" role="tab" aria-selected={statusFilter === 'active'} className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Aktif <span>{products.filter((product) => product.is_active).length}</span></button>
                <button type="button" role="tab" aria-selected={statusFilter === 'draft'} className={statusFilter === 'draft' ? 'active' : ''} onClick={() => setStatusFilter('draft')}>Draft <span>{products.filter((product) => !product.is_active).length}</span></button>
              </div>
              {/* TOOLBAR */}
              <div className="admin-card-header">
                <div className="admin-toolbar-search">
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Cari nama produk atau slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="admin-toolbar-filter">
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>KATEGORI:</span>
                  <select
                    className="admin-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TABLE */}
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Foto</th>
                      <th>Nama &amp; Slug Produk</th>
                      <th>Kategori</th>
                      <th>Tanggal</th>
                      <th>Daftar Harga Spek</th>
                      <th>Varian Warna</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          Tidak ada produk yang sesuai dengan pencarian atau filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((p) => {
                        const firstImage =
                          p.colors?.[0]?.image_url ||
                          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=120&q=80';
                        const lowestPrice =
                          p.prices && p.prices.length > 0
                            ? Math.min(...p.prices.map((item) => Number(item.price)))
                            : null;

                        return (
                          <tr
                            key={p.id}
                            data-product-row={p.id}
                            className={selectedRowId === p.id ? 'is-selected' : ''}
                            tabIndex={0}
                            onClick={() => setSelectedRowId(p.id)}
                            onKeyDown={(event) => { if (event.key === 'Enter') setSelectedRowId(p.id); }}
                          >
                            <td>
                              <img src={firstImage} alt={p.name} className="admin-product-thumb" />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>
                                <code>/{p.slug}</code>
                                <Link
                                  href={`/katalog/${p.slug}`}
                                  target="_blank"
                                  style={{ marginLeft: '6px', color: 'var(--admin-primary)', textDecoration: 'underline' }}
                                >
                                  Preview ↗
                                </Link>
                              </div>
                            </td>
                            <td>
                              <span className="admin-badge admin-badge-neutral">
                                {p.category?.name || 'Umum'}
                              </span>
                            </td>
                            <td>{p.created_at ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(p.created_at)) : '-'}</td>
                            <td>
                              {lowestPrice ? (
                                <div>
                                  <span style={{ fontWeight: 600 }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                                    {' '}
                                    ({p.prices.length} spesifikasi)
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '11px' }}>Belum ada harga</span>
                              )}
                            </td>
                            <td>
                              <div className="admin-table-swatches">
                                {p.colors && p.colors.length > 0 ? (
                                  p.colors.map((c, i) => (
                                    <span
                                      key={i}
                                      className="admin-mini-swatch"
                                      style={{ backgroundColor: c.hex_code }}
                                      title={`${c.color_name} (${c.hex_code})`}
                                    />
                                  ))
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>-</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`admin-badge ${
                                  p.is_active ? 'admin-badge-success' : 'admin-badge-neutral'
                                }`}
                              >
                                {p.is_active ? 'Aktif' : 'Draft'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                style={{ marginRight: '6px' }}
                                onClick={() => openEditProductModal(p)}
                              >
                                ✏️ Ubah
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                              >
                                🗑️ Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="admin-table-footer">
                <span>Menampilkan {filteredProducts.length ? (productPage - 1) * productPageSize + 1 : 0}–{Math.min(productPage * productPageSize, filteredProducts.length)} dari {filteredProducts.length} produk</span>
                <div className="admin-pagination" aria-label="Halaman produk">
                  <button type="button" onClick={() => setProductPage((page) => Math.max(1, page - 1))} disabled={productPage === 1} aria-label="Halaman sebelumnya"><i className="bi bi-chevron-left" aria-hidden="true" /></button>
                  {visibleProductPages.map((page) => (
                    <button key={page} type="button" className={productPage === page ? 'active' : ''} onClick={() => setProductPage(page)}>{page}</button>
                  ))}
                  <button type="button" onClick={() => setProductPage((page) => Math.min(productPageCount, page + 1))} disabled={productPage >= productPageCount} aria-label="Halaman berikutnya"><i className="bi bi-chevron-right" aria-hidden="true" /></button>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: DOKUMENTASI GALERI                                    */}
          {/* ============================================================ */}
          {activeTab === 'gallery' && (
            <div className="admin-view">
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-toolbar-filter">
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TIPE TENDA:</span>
                  <select
                    className="admin-select"
                    value={galleryTypeFilter}
                    onChange={(e) => setGalleryTypeFilter(e.target.value)}
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="transparan">Transparan</option>
                    <option value="kerut">Kerut</option>
                    <option value="blukat">Blukat</option>
                    <option value="piramid">Piramid</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Foto</th>
                      <th>Judul Foto</th>
                      <th>Tipe Tenda</th>
                      <th>Tautan Instagram</th>
                      <th>Sorotan (Featured)</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGallery.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          Belum ada foto galeri untuk tipe tenda ini.
                        </td>
                      </tr>
                    ) : (
                      filteredGallery.map((g) => (
                        <tr key={g.id} className={selectedRowId === g.id ? 'is-selected' : ''} onClick={() => setSelectedRowId(g.id)}>
                          <td>
                            <img
                              src={g.image_url}
                              alt={g.title}
                              className="admin-product-thumb"
                              style={{ width: '56px', height: '56px' }}
                            />
                          </td>
                          <td>
                            <strong style={{ fontSize: '13px' }}>{g.title}</strong>
                          </td>
                          <td>
                            <span className="admin-badge admin-badge-neutral" style={{ textTransform: 'capitalize' }}>
                              {g.tent_type}
                            </span>
                          </td>
                          <td>
                            {g.instagram_url ? (
                              <a
                                href={g.instagram_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontSize: '11px', color: 'var(--admin-primary)', textDecoration: 'underline' }}
                              >
                                Buka Post IG ↗
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '11px' }}>-</span>
                            )}
                          </td>
                          <td>
                            {g.is_featured ? (
                              <span className="admin-badge admin-badge-warning">⭐ Featured</span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '11px' }}>Biasa</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteGallery(g.id, g.title)}
                            >
                              🗑️ Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: MEDIA STORAGE                                         */}
          {/* ============================================================ */}
          {activeTab === 'media' && (
            <div className="admin-view admin-media-grid">
              {/* UPLOAD BOX */}
              <div className="admin-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', fontFamily: 'var(--serif)' }}>
                  Unggah Media Baru
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
                  Aset file akan tersimpan secara terdesentralisasi di bucket <code>arum-media</code> dengan akses publik
                  dan batas ukuran 5MB (format: JPG, PNG, WebP).
                </p>

                <label className="admin-dropzone" htmlFor="media-upload-input">
                  <div className="admin-dropzone-icon">☁️</div>
                  <p className="admin-dropzone-text">
                    {uploadingMedia ? 'Mengunggah ke Supabase Storage...' : 'Klik untuk memilih file foto'}
                  </p>
                  <p className="admin-dropzone-sub">Maksimal 5MB per file • Format WebP, PNG, JPEG</p>
                  <input
                    id="media-upload-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingMedia}
                    onChange={handleStandaloneUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* RECENT UPLOADS */}
              <div className="admin-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', fontFamily: 'var(--serif)' }}>
                  Aset Baru Sesi Ini ({uploadedFiles.length})
                </h3>
                {uploadedFiles.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Belum ada gambar yang diunggah pada sesi ini. File yang Anda unggah akan muncul di sini beserta tautan
                    publiknya.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '6px',
                          background: '#f8fafc',
                        }}
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {file.name}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>{file.size}</span>
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => copyToClipboard(file.url)}
                        >
                          {copiedUrl === file.url ? '✓ Tersalin!' : 'Salin URL'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODAL: TAMBAH / UBAH PRODUK                                  */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setProductModalOpen(false)}>
          <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>{editingProduct ? `Ubah Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setProductModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} style={{ display: 'contents' }}>
              <div className="admin-modal-body">
                {/* 1. INFORMASI DASAR */}
                <div className="admin-form-section">
                  <h4 className="admin-form-section-title">1. Informasi Dasar Produk</h4>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Nama Produk *</label>
                      <input
                        type="text"
                        required
                        className="admin-form-input"
                        placeholder="Contoh: Tenda Roder VIP"
                        value={prodForm.name}
                        onChange={handleProductNameChange}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Slug URL *</label>
                      <input
                        type="text"
                        required
                        className="admin-form-input"
                        placeholder="tenda-roder-vip"
                        value={prodForm.slug}
                        onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Kategori</label>
                      <select
                        className="admin-form-select"
                        value={prodForm.category_id}
                        onChange={(e) => setProdForm({ ...prodForm, category_id: e.target.value })}
                      >
                        <option value="">Pilih Kategori...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group" style={{ justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '18px' }}>
                        <input
                          type="checkbox"
                          checked={prodForm.is_active}
                          onChange={(e) => setProdForm({ ...prodForm, is_active: e.target.checked })}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Tampilkan di Website (Aktif)</span>
                      </label>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Deskripsi Lengkap</label>
                    <textarea
                      rows={3}
                      className="admin-form-textarea"
                      placeholder="Jelaskan keunggulan, bahan, dan peruntukan acara produk ini..."
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. DAFTAR SPESIFIKASI & HARGA DEALER */}
                <div className="admin-form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="admin-form-section-title" style={{ border: 'none', margin: 0 }}>
                      2. Spesifikasi &amp; Pricelist Sewa
                    </h4>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={addPriceRow}
                    >
                      ＋ Tambah Baris Spek
                    </button>
                  </div>

                  {prodForm.prices.map((priceItem, idx) => (
                    <div key={idx} className="admin-dynamic-row">
                      <div className="admin-dynamic-row-header">
                        <strong style={{ fontSize: '11px', color: '#64748b' }}>SPESIFIKASI #{idx + 1}</strong>
                        {prodForm.prices.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePriceRow(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Hapus Baris
                          </button>
                        )}
                      </div>

                      <div className="admin-dynamic-row-grid">
                        <div className="admin-form-group">
                          <label className="admin-form-label">Nama Spek *</label>
                          <input
                            type="text"
                            required
                            className="admin-form-input"
                            placeholder="Bentang 10m / Ukuran 4x6"
                            value={priceItem.spec_name}
                            onChange={(e) => updatePriceRow(idx, 'spec_name', e.target.value)}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Harga (Rp) *</label>
                          <input
                            type="number"
                            required
                            min={1}
                            className="admin-form-input"
                            placeholder="85000"
                            value={priceItem.price}
                            onChange={(e) => updatePriceRow(idx, 'price', e.target.value)}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Satuan *</label>
                          <input
                            type="text"
                            required
                            className="admin-form-input"
                            placeholder="m² / set / hari"
                            value={priceItem.unit}
                            onChange={(e) => updatePriceRow(idx, 'unit', e.target.value)}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Min. Order</label>
                          <input
                            type="number"
                            min={1}
                            className="admin-form-input"
                            value={priceItem.min_order}
                            onChange={(e) => updatePriceRow(idx, 'min_order', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="Catatan tambahan (opsional, misal: Termasuk instalasi & kain serut)"
                          value={priceItem.notes || ''}
                          onChange={(e) => updatePriceRow(idx, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. VARIAN WARNA & GAMBAR */}
                <div className="admin-form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="admin-form-section-title" style={{ border: 'none', margin: 0 }}>
                      3. Varian Warna &amp; Visual Produk
                    </h4>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={addColorRow}
                    >
                      ＋ Tambah Varian Warna
                    </button>
                  </div>

                  {prodForm.colors.map((colorItem, idx) => (
                    <div key={idx} className="admin-dynamic-row">
                      <div className="admin-dynamic-row-header">
                        <strong style={{ fontSize: '11px', color: '#64748b' }}>VARIAN WARNA #{idx + 1}</strong>
                        {prodForm.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColorRow(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Hapus Varian
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1.2fr 2fr', gap: '10px', alignItems: 'center' }}>
                        <div>
                          <label className="admin-form-label">Kode Warna</label>
                          <input
                            type="color"
                            value={colorItem.hex_code}
                            onChange={(e) => updateColorRow(idx, 'hex_code', e.target.value)}
                            style={{
                              width: '42px',
                              height: '38px',
                              padding: '2px',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'block',
                            }}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-label">Nama Warna *</label>
                          <input
                            type="text"
                            required
                            className="admin-form-input"
                            placeholder="Ivory / Emerald"
                            value={colorItem.color_name}
                            onChange={(e) => updateColorRow(idx, 'color_name', e.target.value)}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-label">URL Foto / Unggah Langsung</label>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              className="admin-form-input"
                              placeholder="https://images.unsplash.com/... atau unggah"
                              value={colorItem.image_url || ''}
                              onChange={(e) => updateColorRow(idx, 'image_url', e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <label
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              📁 Upload
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                style={{ display: 'none' }}
                                onChange={(e) => handleColorImageUpload(idx, e.target.files?.[0])}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {colorItem.image_url && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                          <img
                            src={colorItem.image_url}
                            alt="Pratinjau"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>
                            Pratinjau visual untuk varian {colorItem.color_name || 'ini'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-modal-foot">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setProductModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="admin-btn admin-btn-primary"
                >
                  {submittingProduct
                    ? 'Menyimpan ke Supabase...'
                    : editingProduct
                    ? 'Simpan Perubahan Produk'
                    : 'Simpan Produk Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: TAMBAH FOTO GALERI                                    */}
      {/* ============================================================ */}
      {galleryModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setGalleryModalOpen(false)}>
          <div className="admin-modal-panel" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Tambah Dokumentasi Galeri</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setGalleryModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGallery} style={{ display: 'contents' }}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Foto / Acara *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="Contoh: Resepsi Mewah Tenda Transparan"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Jenis Tenda *</label>
                    <select
                      className="admin-form-select"
                      value={galleryForm.tent_type}
                      onChange={(e) => setGalleryForm({ ...galleryForm, tent_type: e.target.value })}
                    >
                      <option value="transparan">Transparan</option>
                      <option value="kerut">Kerut</option>
                      <option value="blukat">Blukat</option>
                      <option value="piramid">Piramid</option>
                    </select>
                  </div>

                  <div className="admin-form-group" style={{ justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '18px' }}>
                      <input
                        type="checkbox"
                        checked={galleryForm.is_featured}
                        onChange={(e) => setGalleryForm({ ...galleryForm, is_featured: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Tampilkan sebagai Sorotan</span>
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">URL Foto / Unggah Langsung *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      required
                      className="admin-form-input"
                      placeholder="https://images.unsplash.com/... atau klik unggah"
                      value={galleryForm.image_url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <label
                      className="admin-btn admin-btn-secondary"
                      style={{ whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      📁 Unggah
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleGalleryImageUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>

                {galleryForm.image_url && (
                  <div style={{ marginTop: '4px' }}>
                    <img
                      src={galleryForm.image_url}
                      alt="Pratinjau galeri"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-form-label">Tautan Postingan Instagram (Opsional)</label>
                  <input
                    type="url"
                    className="admin-form-input"
                    placeholder="https://www.instagram.com/p/..."
                    value={galleryForm.instagram_url}
                    onChange={(e) => setGalleryForm({ ...galleryForm, instagram_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-foot">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setGalleryModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingGallery}
                  className="admin-btn admin-btn-primary"
                >
                  {submittingGallery ? 'Menyimpan...' : 'Simpan Foto Galeri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
