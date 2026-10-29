const WA_NUMBER = '6281234567890'; // Ganti dengan nomor WhatsApp bisnis, kode negara tanpa tanda +.
const INSTAGRAM_URL = 'https://www.instagram.com/arumtenda/'; // Ganti dengan akun Instagram yang benar.
const STORAGE_KEY = 'arum-tenda-catalog-v1';
const EQUIPMENT_SEED_KEY = 'arum-tenda-equipment-seeded-v1';

const defaultProducts = [
  { id: 'roder', name: 'Tenda Roder', price: 85000, unit: 'm²', type: 'tent', description: 'Ruang luas tanpa banyak tiang tengah, cocok untuk acara besar.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=82' },
  { id: 'dekorasi', name: 'Tenda Dekorasi', price: 65000, unit: 'm²', type: 'tent', description: 'Kanopi dengan pilihan dekorasi untuk suasana yang lebih personal.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=82' },
  { id: 'sarnafil', name: 'Tenda Sarnafil', price: 350000, unit: '3 × 3 m', type: 'tent', description: 'Pilihan praktis untuk bazar, area penerima tamu, dan acara keluarga.', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=82' },
  { id: 'tableware', name: 'Paket Alat Makan', price: 18000, unit: 'set', type: 'equipment', description: 'Paket contoh berisi piring, sendok, garpu, dan gelas untuk jamuan.', image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=1100&q=82' },
  { id: 'glassware', name: 'Gelas & Glassware', price: 7000, unit: 'pcs', type: 'equipment', description: 'Pilihan gelas untuk melengkapi meja tamu dan meja jamuan.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1100&q=82' },
  { id: 'table-chair', name: 'Meja & Kursi', price: 45000, unit: 'set', type: 'equipment', description: 'Perlengkapan meja dan kursi untuk area makan atau penerima tamu.', image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1100&q=82' },
];

let products = loadProducts();
let activeCategory = 'all';
let editingProductId = null;

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(EQUIPMENT_SEED_KEY, 'done');
      return [...defaultProducts];
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [...defaultProducts];
    const normalized = parsed.map(product => ({
      ...product,
      type: product.type || (product.category === 'equipment' ? 'equipment' : 'tent'),
    }));
    if (localStorage.getItem(EQUIPMENT_SEED_KEY) !== 'done') {
      const savedIds = new Set(normalized.map(product => product.id));
      const migrated = [...normalized, ...defaultProducts.filter(product => product.type === 'equipment' && !savedIds.has(product.id))];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      localStorage.setItem(EQUIPMENT_SEED_KEY, 'done');
      return migrated;
    }
    return normalized;
  } catch {
    return [...defaultProducts];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

function whatsappUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function configureSocialLinks() {
  document.querySelectorAll('.wa-link').forEach(link => {
    const label = link.classList.contains('order-link') ? link.dataset.productName : 'konsultasi sewa tenda';
    const message = label
      ? `Halo Arum Tenda, saya tertarik dengan ${label}. Boleh minta informasi ketersediaan dan penawaran?`
      : 'Halo Arum Tenda, saya ingin konsultasi mengenai kebutuhan sewa tenda untuk acara.';
    link.href = whatsappUrl(message);
    link.target = '_blank';
    link.rel = 'noreferrer';
  });
  document.querySelectorAll('.ig-link').forEach(link => { link.href = INSTAGRAM_URL; });
}

const productDetailDialog = document.querySelector('#product-detail-dialog');
let selectedDetailProduct = null;
let detailQuantity = 1;
let detailTentColor = { hex: '#f0ece0', name: 'Ivory' };
const detailScenes = {
  garden: { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85', alt: 'Contoh suasana tenda di taman' },
  reception: { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85', alt: 'Contoh suasana tenda untuk resepsi' },
  evening: { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85', alt: 'Contoh suasana tenda pada malam hari' },
};

function updateDetailOrder() {
  if (!selectedDetailProduct) return;
  const type = selectedDetailProduct.type || (selectedDetailProduct.category === 'equipment' ? 'equipment' : 'tent');
  const colorText = type === 'tent' ? ` Warna kanopi yang saya pilih: ${detailTentColor.name}.` : '';
  const message = `Halo Arum Tenda, saya tertarik dengan ${selectedDetailProduct.name} sebanyak ${detailQuantity} ${selectedDetailProduct.unit}.${colorText} Mohon info ketersediaan dan penawaran.`;
  document.querySelector('#detail-order').href = whatsappUrl(message);
}

function openProductDetail(product) {
  selectedDetailProduct = product;
  detailQuantity = 1;
  detailTentColor = { hex: '#f0ece0', name: 'Ivory' };
  const type = product.type || (product.category === 'equipment' ? 'equipment' : 'tent');
  const isTent = type === 'tent';
  const image = document.querySelector('#detail-image');
  const tentPreview = document.querySelector('#detail-tent-preview');
  image.src = product.image;
  image.alt = `Foto ${product.name}`;
  image.hidden = isTent;
  tentPreview.hidden = !isTent;
  document.querySelector('#detail-photo-caption').hidden = isTent;
  document.querySelector('#tent-color-options').hidden = !isTent;
  document.querySelector('#detail-category').textContent = isTent ? 'KATALOG TENDA · SIMULASI WARNA' : 'KATALOG PERLENGKAPAN ACARA';
  document.querySelector('#detail-name').textContent = product.name;
  document.querySelector('#detail-price').textContent = `Mulai Rp ${formatPrice(product.price)} / ${product.unit}`;
  const description = product.description || 'Hubungi kami untuk detail produk dan ketersediaan.';
  document.querySelector('#detail-description').textContent = description;
  const specifications = product.specifications || `Kategori: ${isTent ? 'Tenda acara' : 'Perlengkapan acara'}\nSatuan harga: ${product.unit}\nKetersediaan: Konfirmasi melalui WhatsApp\nCatatan: Ukuran, jumlah, dan biaya pengiriman dikonfirmasi saat konsultasi.`;
  document.querySelector('#detail-specifications').textContent = specifications;
  productDetailDialog.querySelectorAll('.product-accordion').forEach(section => { section.open = false; });
  document.querySelector('#detail-quantity').textContent = String(detailQuantity).padStart(2, '0');
  document.querySelector('#detail-tent-preview').style.setProperty('--tent-color', detailTentColor.hex);
  document.querySelector('#detail-color-name').textContent = detailTentColor.name;
  document.querySelectorAll('.detail-swatch').forEach(button => button.classList.toggle('active', button.dataset.label === detailTentColor.name));
  document.querySelectorAll('.detail-scene').forEach(button => button.classList.toggle('active', button.dataset.scene === 'garden'));
  document.querySelector('#detail-tent-preview').dataset.scene = 'garden';
  document.querySelector('#detail-scene-photo').src = detailScenes.garden.src;
  document.querySelector('#detail-scene-photo').alt = detailScenes.garden.alt;
  updateDetailOrder();
  productDetailDialog.showModal();
}

function makeProductCard(product, index) {
  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.category = product.type || (product.category === 'equipment' ? 'equipment' : 'tent');
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'product-open';
  open.setAttribute('aria-label', `Lihat detail ${product.name}, mulai Rp ${formatPrice(product.price)} per ${product.unit}`);
  open.addEventListener('click', () => openProductDetail(product));
  const photo = document.createElement('div');
  photo.className = 'product-photo';
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = `Contoh ${product.name}`;
  img.loading = 'lazy';
  const fallback = document.createElement('span');
  fallback.className = 'photo-placeholder';
  fallback.textContent = 'Foto produk';
  img.addEventListener('error', () => { img.hidden = true; fallback.hidden = false; }, { once: true });
  fallback.hidden = true;
  const number = document.createElement('span');
  number.className = 'product-number';
  number.textContent = `PRODUK ${String(index + 1).padStart(2, '0')}`;
  photo.append(img, fallback, number);

  const info = document.createElement('div');
  info.className = 'product-info';
  const category = document.createElement('span');
  category.className = 'product-category';
  const categoryLabels = { tent: 'TENDA', equipment: 'PERLENGKAPAN ACARA' };
  category.textContent = categoryLabels[article.dataset.category] || 'PERLENGKAPAN';
  const name = document.createElement('h3');
  name.textContent = product.name;
  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = product.description || 'Tanya tim kami untuk detail produk dan ketersediaan.';
  const bottom = document.createElement('div');
  bottom.className = 'product-bottom';
  const price = document.createElement('div');
  price.className = 'product-price';
  const from = document.createElement('small');
  from.textContent = 'MULAI DARI';
  const amount = document.createElement('strong');
  amount.textContent = `Rp ${formatPrice(product.price)} `;
  const unit = document.createElement('em');
  unit.textContent = `/ ${product.unit}`;
  amount.append(unit);
  price.append(from, amount);
  const details = document.createElement('span');
  details.className = 'detail-link';
  details.textContent = 'Lihat detail ↗';
  bottom.append(price, details);
  info.append(category, name, description, bottom);
  open.append(photo, info);
  article.append(open);
  return article;
}

function renderProducts() {
  const grid = document.querySelector('#product-grid');
  grid.replaceChildren();
  const visible = products.filter(product => activeCategory === 'all' || (product.type || (product.category === 'equipment' ? 'equipment' : 'tent')) === activeCategory);
  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-catalog';
    empty.textContent = 'Belum ada produk pada kategori ini.';
    grid.append(empty);
    return;
  }
  visible.forEach((product, index) => grid.append(makeProductCard(product, index)));
  configureSocialLinks();
}

function renderAdminList() {
  const list = document.querySelector('#admin-list');
  list.replaceChildren();
  products.forEach(product => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    const name = document.createElement('strong');
    name.textContent = product.name;
    const price = document.createElement('span');
    price.textContent = `Rp ${formatPrice(product.price)} / ${product.unit}`;
    const image = document.createElement('span');
    image.textContent = product.image;
    image.title = product.image;
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Ubah';
    edit.addEventListener('click', () => openProductDialog(product));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-product';
    remove.textContent = 'Hapus';
    remove.addEventListener('click', () => {
      if (!window.confirm(`Hapus ${product.name} dari katalog di browser ini?`)) return;
      products = products.filter(item => item.id !== product.id);
      saveProducts();
      renderProducts();
      renderAdminList();
    });
    row.append(name, price, image, edit, remove);
    list.append(row);
  });
}

const productDialog = document.querySelector('#product-dialog');
const productForm = document.querySelector('#product-form');

function openProductDialog(product = null) {
  editingProductId = product?.id || null;
  document.querySelector('#dialog-title').textContent = product ? 'Ubah produk' : 'Tambah produk';
  productForm.elements.name.value = product?.name || '';
  productForm.elements.price.value = product?.price ?? '';
  productForm.elements.unit.value = product?.unit || '';
  productForm.elements.type.value = product?.type || (product?.category === 'equipment' ? 'equipment' : 'tent');
  productForm.elements.image.value = product?.image || '';
  productForm.elements.description.value = product?.description || '';
  productForm.elements.specifications.value = product?.specifications || '';
  productDialog.showModal();
}

productForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(productForm);
  const product = {
    id: editingProductId || `product-${Date.now()}`,
    name: String(form.get('name')).trim(),
    price: Number(form.get('price')),
    unit: String(form.get('unit')).trim(),
    type: String(form.get('type')),
    image: String(form.get('image')).trim(),
    description: String(form.get('description')).trim(),
    specifications: String(form.get('specifications')).trim(),
  };
  if (editingProductId) products = products.map(item => item.id === editingProductId ? product : item);
  else products.push(product);
  saveProducts();
  renderProducts();
  renderAdminList();
  productDialog.close();
});

document.querySelector('.dialog-close').addEventListener('click', () => productDialog.close());
document.querySelector('.dialog-cancel').addEventListener('click', () => productDialog.close());
productDialog.addEventListener('click', event => {
  if (event.target === productDialog) productDialog.close();
});

document.querySelector('.admin-toggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const panel = document.querySelector('#catalog-admin');
  const open = panel.hidden;
  panel.hidden = !open;
  button.setAttribute('aria-expanded', String(open));
  button.innerHTML = open ? '<span>×</span> Tutup pengaturan' : '<span>⚙</span> Atur katalog';
  if (open) renderAdminList();
});
document.querySelector('.admin-add').addEventListener('click', () => openProductDialog());

document.querySelectorAll('.catalog-filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.catalog-filter.active')?.classList.remove('active');
    button.classList.add('active');
    activeCategory = button.dataset.filter;
    renderProducts();
  });
});

document.querySelectorAll('.detail-swatch').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.detail-swatch.active')?.classList.remove('active');
    button.classList.add('active');
    detailTentColor = { hex: button.dataset.color, name: button.dataset.label };
    document.querySelector('#detail-tent-preview').style.setProperty('--tent-color', detailTentColor.hex);
    document.querySelector('#detail-color-name').textContent = detailTentColor.name;
    updateDetailOrder();
  });
});

document.querySelectorAll('.detail-scene').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.detail-scene.active')?.classList.remove('active');
    button.classList.add('active');
    const scene = button.dataset.scene;
    const photo = document.querySelector('#detail-scene-photo');
    photo.src = detailScenes[scene].src;
    photo.alt = detailScenes[scene].alt;
    document.querySelector('#detail-tent-preview').dataset.scene = scene;
  });
});

document.querySelectorAll('.quantity-change').forEach(button => {
  button.addEventListener('click', () => {
    detailQuantity = Math.max(1, Math.min(99, detailQuantity + Number(button.dataset.step)));
    document.querySelector('#detail-quantity').textContent = String(detailQuantity).padStart(2, '0');
    updateDetailOrder();
  });
});
document.querySelector('.detail-close').addEventListener('click', () => productDetailDialog.close());
productDetailDialog.addEventListener('click', event => {
  if (event.target === productDetailDialog) productDetailDialog.close();
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const siteHeader = document.querySelector('.site-header');
function updateHeaderOnScroll() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  mobileNav.setAttribute('aria-hidden', String(!open));
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const quickNav = document.querySelector('.mobile-quick-nav');
const footer = document.querySelector('.site-footer');
const quickNavLinks = [...quickNav.querySelectorAll('[data-section-link]')];

function setQuickNavVisible(visible) {
  quickNav.classList.toggle('is-visible', visible);
  quickNav.setAttribute('aria-hidden', String(!visible));
  quickNav.inert = !visible;
}

if ('IntersectionObserver' in window) {
  let heroVisible = true;
  let footerVisible = false;
  const updateQuickNav = () => setQuickNavVisible(!heroVisible && !footerVisible);
  const edgeObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target.id === 'home') heroVisible = entry.isIntersecting;
      if (entry.target === footer) footerVisible = entry.isIntersecting;
    }
    updateQuickNav();
  });
  edgeObserver.observe(document.querySelector('#home'));
  edgeObserver.observe(footer);

  const sectionObserver = new IntersectionObserver(entries => {
    const current = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!current) return;
    quickNavLinks.forEach(link => {
      const active = link.dataset.sectionLink === current.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
  quickNavLinks.forEach(link => sectionObserver.observe(document.querySelector(`#${link.dataset.sectionLink}`)));
} else {
  setQuickNavVisible(window.scrollY > document.querySelector('#home').offsetHeight);
  window.addEventListener('scroll', () => {
    setQuickNavVisible(window.scrollY > document.querySelector('#home').offsetHeight && footer.getBoundingClientRect().top > innerHeight);
  }, { passive: true });
}

const packageOptions = [...document.querySelectorAll('.package-option')];
const packageImage = document.querySelector('[data-package-image]');
const packagePreviewLabel = document.querySelector('.package-preview-label');
const packageScenes = [
  { name: 'Paket A', src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85', alt: 'Tampilan Paket A: dekorasi acara keluarga' },
  { name: 'Paket B', src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85', alt: 'Tampilan Paket B: perlengkapan perayaan' },
  { name: 'Paket C', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85', alt: 'Tampilan Paket C: tata acara yang disesuaikan' },
];

packageOptions.forEach(option => {
  option.addEventListener('click', () => {
    const scene = packageScenes[Number(option.dataset.package)];
    if (!scene || !packageImage) return;
    packageOptions.forEach(item => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    packageImage.src = scene.src;
    packageImage.alt = scene.alt;
    if (packagePreviewLabel) packagePreviewLabel.textContent = scene.name.toUpperCase();
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
configureSocialLinks();
renderProducts();
