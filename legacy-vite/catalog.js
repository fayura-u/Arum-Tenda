import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const products = [
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
].map(([name, photo]) => ({
  name,
  image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=82`,
}));

const grid = document.querySelector('#catalog-product-grid');
const modal = document.querySelector('.modal');
const modalContent = modal?.querySelector('.content');
const modalOverlay = modal?.querySelector('.overlay');
const boxes = [];
let boxIndex;
let activeBox;
let previousBodyPaddingRight = '';

if (grid && modal && modalContent && modalOverlay) {
  grid.innerHTML = products.map((product, index) => `
    <div class="box">
      <button class="catalog-product-card box-content" type="button" data-product-index="${index}" aria-label="Lihat ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span>${product.name}</span>
      </button>
    </div>`).join('');

  boxes.push(...gsap.utils.toArray('.boxes-container .box'));
  const boxesContent = gsap.utils.toArray('.box-content');

  function closePreview() {
    if (boxIndex === undefined || !activeBox) return;
    const index = boxIndex;
    const boxContent = activeBox;
    const state = Flip.getState(boxContent);
    boxes[index].appendChild(boxContent);
    boxIndex = undefined;
    activeBox = undefined;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    gsap.to([modal, modalOverlay], { autoAlpha: 0, ease: 'power1.inOut', duration: 0.35 });
    Flip.from(state, {
      duration: 0.7,
      ease: 'power1.inOut',
      absolute: true,
      onComplete: () => {
        gsap.set(boxContent, { zIndex: 'auto' });
        document.body.classList.remove('catalog-modal-open');
        document.body.style.paddingRight = previousBodyPaddingRight;
        gsap.set(boxContent, { willChange: 'auto' });
        boxesContent[index]?.focus({ preventScroll: true });
      },
    });
    gsap.set(boxContent, { zIndex: 1002 });
  }

  boxesContent.forEach((boxContent, index) => {
    boxContent.addEventListener('click', () => {
      if (boxIndex !== undefined) {
        closePreview();
        return;
      }
      const state = Flip.getState(boxContent);
      modalContent.appendChild(boxContent);
      boxIndex = index;
      activeBox = boxContent;
      modal.setAttribute('aria-label', `Pratinjau ${products[index].name}`);
      modal.setAttribute('aria-hidden', 'false');
      previousBodyPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('catalog-modal-open');
      gsap.set(boxContent, { willChange: 'transform' });
      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, { duration: 0.7, ease: 'power1.inOut' });
      gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35 });
    });
  });

  modalOverlay.addEventListener('click', closePreview);
  modalContent.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && boxIndex !== undefined) closePreview();
  });
}
