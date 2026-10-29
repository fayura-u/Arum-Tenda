'use client';

import { memo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import SubpageHeader from '../components/subpage-header';
import SubpageFooter from '../components/subpage-footer';

gsap.registerPlugin(Flip);

const instagramUrl = 'https://www.instagram.com/arumtenda/';
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
  postUrl: instagramUrl,
  index,
}));

const InteractiveGallery = memo(function InteractiveGallery({ filterRef }) {
  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const modalMediaRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const instagramLinkRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    const filter = filterRef.current;
    const modal = modalRef.current;
    const modalMedia = modalMediaRef.current;
    const overlay = overlayRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const instagramLink = instagramLinkRef.current;
    if (!grid || !modal || !modalMedia || !overlay) return undefined;

    const boxes = [...grid.querySelectorAll('.gallery-box')];
    const images = boxes.map((box) => box.querySelector('.gallery-box-content'));
    let activeIndex;
    let activeImage;
    let previousBodyPaddingRight = '';

    function closeGalleryModal() {
      if (activeIndex === undefined || !activeImage) return;
      const index = activeIndex;
      const image = activeImage;
      const state = Flip.getState(image);
      boxes[index].appendChild(image);
      activeIndex = undefined;
      activeImage = undefined;
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');
      gsap.to([modal, overlay], { autoAlpha: 0, duration: 0.35, ease: 'power1.inOut' });
      Flip.from(state, {
        duration: 0.7,
        ease: 'power1.inOut',
        absolute: true,
        onComplete: () => {
          gsap.set(image, { clearProps: 'zIndex,willChange' });
          document.body.classList.remove('gallery-modal-open');
          document.body.style.paddingRight = previousBodyPaddingRight;
          images[index]?.focus({ preventScroll: true });
        },
      });
      gsap.set(image, { zIndex: 1002 });
    }

    function openGalleryModal(index, image) {
      if (activeIndex !== undefined) {
        closeGalleryModal();
        return;
      }
      const state = Flip.getState(image);
      modalMedia.appendChild(image);
      activeIndex = index;
      activeImage = image;
      const item = galleryItems[index];
      title.textContent = item.title;
      description.textContent = `${item.type} · Inspirasi penataan tenda dan perlengkapan untuk acara Anda.`;
      instagramLink.href = item.postUrl;
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-label', `Pratinjau ${item.title}`);
      modal.classList.add('is-open');
      previousBodyPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('gallery-modal-open');
      gsap.set(image, { willChange: 'transform' });
      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, { duration: 0.7, ease: 'power1.inOut' });
      gsap.to(overlay, { autoAlpha: 0.65, duration: 0.35 });
    }

    const imageHandlers = images.map((image, index) => {
      const handler = () => openGalleryModal(index, image);
      image.addEventListener('click', handler);
      return handler;
    });
    const onFilter = () => {
      const type = filter.value;
      boxes.forEach((box) => { box.hidden = type !== 'all' && box.dataset.galleryType !== type; });
    };
    const onEscape = (event) => { if (event.key === 'Escape') closeGalleryModal(); };
    filter?.addEventListener('change', onFilter);
    overlay.addEventListener('click', closeGalleryModal);
    modal.querySelector('.gallery-modal-close')?.addEventListener('click', closeGalleryModal);
    document.addEventListener('keydown', onEscape);

    return () => {
      if (activeIndex !== undefined && activeImage) boxes[activeIndex].appendChild(activeImage);
      images.forEach((image, index) => image.removeEventListener('click', imageHandlers[index]));
      filter?.removeEventListener('change', onFilter);
      overlay.removeEventListener('click', closeGalleryModal);
      modal.querySelector('.gallery-modal-close')?.removeEventListener('click', closeGalleryModal);
      document.removeEventListener('keydown', onEscape);
      gsap.killTweensOf([modal, overlay, ...images]);
      gsap.set([modal, overlay, ...images], { clearProps: 'all' });
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('gallery-modal-open');
      document.body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [filterRef]);

  return <>
    <div className="event-gallery-grid boxes-container" id="event-gallery-grid" ref={gridRef} aria-live="polite">
      {galleryItems.map((item) => <div className="gallery-box" data-gallery-type={item.type.toLowerCase()} key={item.index}>
        <button className="gallery-box-content" type="button" aria-label={`Lihat foto: ${item.title}`}><img src={item.image} alt={item.title} loading="lazy" /><span>{item.title}</span></button>
      </div>)}
    </div>
    <div className="gallery-modal" ref={modalRef} aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
      <button className="gallery-modal-overlay" type="button" aria-label="Tutup foto" ref={overlayRef} />
      <section className="gallery-modal-layout"><div className="gallery-modal-media" ref={modalMediaRef} /><div className="gallery-modal-caption"><p className="eyebrow">GALERI TENDA</p><h2 id="gallery-modal-title" ref={titleRef} /><p className="gallery-modal-description" ref={descriptionRef} /><a className="button button-dark gallery-instagram-link" href={instagramUrl} target="_blank" rel="noreferrer" ref={instagramLinkRef}>Lihat Post di IG <span>↗</span></a><button type="button" className="gallery-modal-close">Kembali ke galeri</button></div></section>
    </div>
  </>;
});

export default function GalleryClient() {
  const filterRef = useRef(null);

  return <div className="subpage">
    <SubpageHeader activePage="/galeri" />
    <main className="gallery-page-main">
      <div className="gallery-page-heading"><div><p className="eyebrow">INSPIRASI ACARA ARUM TENDA</p><h1>Galeri Tenda</h1></div><label className="gallery-filter-label" htmlFor="gallery-filter"><span>JENIS TENDA</span><select id="gallery-filter" ref={filterRef} defaultValue="all"><option value="all">Semua jenis</option><option value="transparan">Transparan</option><option value="kerut">Kerut</option><option value="blukat">Blukat</option><option value="piramid">Piramid</option></select></label></div>
      <p className="gallery-page-note">Kumpulan suasana dan inspirasi untuk membantu Anda membayangkan acara yang ingin disiapkan.</p>
      <InteractiveGallery filterRef={filterRef} />
    </main>
    <SubpageFooter activePage="/galeri" />
  </div>;
}
