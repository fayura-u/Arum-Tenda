import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const galleryItems = [
  ['Pesta di ruang yang hangat', 'Transparan', 'photo-1519167758481-83f550bb49b3'],
  ['Detail dekorasi untuk jamuan', 'Kerut', 'photo-1464366400600-7168b8af9bc3'],
  ['Perayaan bersama keluarga', 'Blukat', 'photo-1511795409834-ef04bbd61622'],
  ['Ruang terbuka untuk berkumpul', 'Piramid', 'photo-1507504031003-b417219a0fde'],
  ['Tata meja untuk hari istimewa', 'Transparan', 'photo-1493857671505-72967e2e2760'],
  ['Warna dan detail perayaan', 'Kerut', 'photo-1492684223066-81342ee5ff30'],
  ['Suasana resepsi malam', 'Blukat', 'photo-1519225421980-715cb0215aed'],
  ['Ruang acara yang tertata', 'Piramid', 'photo-1507504031003-b417219a0fde'],
  ['Jamuan untuk para tamu', 'Transparan', 'photo-1513558161293-cdaf765edfd7'],
  ['Dekorasi yang menyambut', 'Kerut', 'photo-1464366400600-7168b8af9bc3'],
].map(([title, type, photo], index) => ({
  title,
  type,
  image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1100&q=84`,
  postUrl: `https://www.instagram.com/arumtenda/`,
  index,
}));

const grid = document.querySelector('#event-gallery-grid');
const filter = document.querySelector('#gallery-filter');
const modal = document.querySelector('.gallery-modal');
const modalMedia = modal?.querySelector('.gallery-modal-media');
const modalOverlay = modal?.querySelector('.gallery-modal-overlay');
const modalTitle = document.querySelector('#gallery-modal-title');
const modalDescription = document.querySelector('.gallery-modal-description');
const instagramLink = document.querySelector('.gallery-instagram-link');
const galleryBoxes = [];
let activeIndex;
let activeImage;
let bodyPaddingRight = '';

if (grid && modal && modalMedia && modalOverlay) {
  grid.innerHTML = galleryItems.map((item, index) => `
    <div class="gallery-box" data-gallery-type="${item.type.toLowerCase()}">
      <button class="gallery-box-content" type="button" data-gallery-index="${index}" aria-label="Lihat foto: ${item.title}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span>${item.title}</span>
      </button>
    </div>`).join('');

  galleryBoxes.push(...gsap.utils.toArray('.event-gallery-grid .gallery-box'));
  const images = gsap.utils.toArray('.gallery-box-content');

  function closeGalleryModal() {
    if (activeIndex === undefined || !activeImage) return;
    const index = activeIndex;
    const image = activeImage;
    const state = Flip.getState(image);
    galleryBoxes[index].appendChild(image);
    activeIndex = undefined;
    activeImage = undefined;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    gsap.to([modal, modalOverlay], { autoAlpha: 0, duration: 0.35, ease: 'power1.inOut' });
    Flip.from(state, {
      duration: 0.7,
      ease: 'power1.inOut',
      absolute: true,
      onComplete: () => {
        gsap.set(image, { zIndex: 'auto', willChange: 'auto' });
        document.body.classList.remove('gallery-modal-open');
        document.body.style.paddingRight = bodyPaddingRight;
        images[index]?.focus({ preventScroll: true });
      },
    });
    gsap.set(image, { zIndex: 1002 });
  }

  images.forEach((image, index) => {
    image.addEventListener('click', () => {
      if (activeIndex !== undefined) {
        closeGalleryModal();
        return;
      }
      const state = Flip.getState(image);
      modalMedia.appendChild(image);
      activeIndex = index;
      activeImage = image;
      modalTitle.textContent = galleryItems[index].title;
      modalDescription.textContent = `${galleryItems[index].type} · Inspirasi penataan tenda dan perlengkapan untuk acara Anda.`;
      instagramLink.href = galleryItems[index].postUrl;
      modal.setAttribute('aria-hidden', 'false');
      bodyPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('gallery-modal-open');
      gsap.set(image, { willChange: 'transform' });
      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, { duration: 0.7, ease: 'power1.inOut' });
      gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35 });
    });
  });

  filter?.addEventListener('change', () => {
    const type = filter.value;
    galleryBoxes.forEach(box => {
      box.hidden = type !== 'all' && box.dataset.galleryType !== type;
    });
  });
  modalOverlay.addEventListener('click', closeGalleryModal);
  modal.querySelector('.gallery-modal-close')?.addEventListener('click', closeGalleryModal);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeIndex !== undefined) closeGalleryModal();
  });
}