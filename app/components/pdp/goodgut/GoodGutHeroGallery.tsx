// Premium PDP gallery for GoodGut+ — replaces the previous static
// HeroGalleryStage. Two responsibilities:
//
// 1. Mobile (default): swipe-able Swiper carousel of every gallery
//    image with a slim pagination strip below. Tapping any image opens
//    the fullscreen lightbox.
// 2. Desktop (lg+): single sticky hero packshot. Clicking the image
//    opens the same fullscreen lightbox so customers can pinch-zoom or
//    browse alternate angles without leaving the page.
//
// The lightbox itself is a framer-motion overlay backed by a second
// Swiper instance — keyboard arrows, drag-to-dismiss, and a tap-the-
// backdrop close, all without adding a new dependency. Vaul, Radix,
// and react-medium-image-zoom were considered; the in-house version
// stays under 4KB and matches the brand's calm-Ayurvedic motion
// language better than any shipped premium dialog.
import {useCallback, useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {AnimatePresence, motion} from 'framer-motion';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Swiper as SwiperType} from 'swiper';
import {Pagination, Keyboard, A11y} from 'swiper/modules';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
/* eslint-disable import/no-duplicates */
import 'swiper/css';
import 'swiper/css/pagination';
/* eslint-enable import/no-duplicates */

type Props = {
  images: StorefrontImage[];
  priority?: boolean;
};

export function GoodGutHeroGallery({images, priority}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  if (!images.length) return null;

  return (
    <>
      {/* MOBILE — swipe carousel of every gallery image */}
      <div className="lg:hidden">
        <MobileSwipeGallery images={images} onZoom={open} priority={priority} />
      </div>

      {/* DESKTOP — single hero stage with click-to-zoom */}
      <div className="hidden lg:block">
        <DesktopHeroStage
          image={images[0] ?? null}
          allCount={images.length}
          onZoom={() => open(0)}
          priority={priority}
        />
      </div>

      {/* Shared fullscreen lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null ? (
          <Lightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// MOBILE — swipe-able Swiper carousel. Each slide is a tap-able image
// inside the brand-frame (same gradient + rounded chrome the static
// HeroGalleryStage had). Pagination dots sit below the frame.
// ---------------------------------------------------------------------------
function MobileSwipeGallery({
  images,
  onZoom,
  priority,
}: {
  images: StorefrontImage[];
  onZoom: (i: number) => void;
  priority?: boolean;
}) {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Keyboard, A11y]}
        spaceBetween={14}
        slidesPerView={1}
        keyboard={{enabled: true}}
        a11y={{enabled: true}}
        pagination={{
          clickable: true,
          el: '.goodgut-hero-pagination',
          bulletClass: 'goodgut-hero-bullet',
          bulletActiveClass: 'goodgut-hero-bullet-active',
        }}
        className="!overflow-visible"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.id ?? i}>
            <button
              type="button"
              onClick={() => onZoom(i)}
              aria-label={`Zoom image ${i + 1} of ${images.length}`}
              className="group block w-full focus:outline-none"
            >
              <HeroFrame>
                <Image
                  data={img}
                  aspectRatio="4/5"
                  sizes="92vw"
                  loading={i === 0 && priority ? 'eager' : 'lazy'}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {i === 0 ? <FloatingBadge /> : null}
                <ZoomHint />
              </HeroFrame>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination strip — slim line of dots under the frame */}
      <div className="goodgut-hero-pagination mt-4 flex justify-center gap-1.5" />

      <style>{`
        .goodgut-hero-bullet {
          display: inline-block;
          width: 16px;
          height: 4px;
          border-radius: 999px;
          background: rgba(31, 26, 20, 0.16);
          transition: background 0.2s, width 0.2s;
          cursor: pointer;
        }
        .goodgut-hero-bullet-active {
          width: 28px;
          background: var(--color-brand, #2d5a3d);
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DESKTOP — single hero packshot, clickable to open the lightbox.
// Indicates additional angles with a small "1 / N" caption + zoom
// hint icon.
// ---------------------------------------------------------------------------
function DesktopHeroStage({
  image,
  allCount,
  onZoom,
  priority,
}: {
  image: StorefrontImage | null;
  allCount: number;
  onZoom: () => void;
  priority?: boolean;
}) {
  if (!image) return null;
  return (
    <button
      type="button"
      onClick={onZoom}
      aria-label="Open product image gallery"
      className="group block w-full focus:outline-none"
    >
      <HeroFrame>
        <Image
          data={image}
          aspectRatio="4/5"
          sizes="48vw"
          loading={priority ? 'eager' : undefined}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <FloatingBadge />
        <ZoomHint />
        {allCount > 1 ? (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-paper backdrop-blur">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M5 9l2-2 2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            {allCount} angles
          </span>
        ) : null}
      </HeroFrame>
    </button>
  );
}

// ---------------------------------------------------------------------------
// HeroFrame — shared chrome (gradient ring + rounded corners + paper
// inset). Everything the old HeroGalleryStage had, just refactored so
// both mobile and desktop variants render identically.
// ---------------------------------------------------------------------------
function HeroFrame({children}: {children: React.ReactNode}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#ebe0c9_0%,#dccfb3_55%,#c7b89a_100%)] p-2.5 shadow-[0_30px_90px_rgba(31,26,20,0.14)] sm:p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[linear-gradient(180deg,#fdfaf2_0%,#f0e6d0_100%)] sm:rounded-[1.35rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-12 top-8 h-44 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_70%)]"
        />
        {children}
      </div>
    </div>
  );
}

function FloatingBadge() {
  return (
    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M6 1c1.5 2 3 4 3 6a3 3 0 0 1-6 0c0-2 1.5-4 3-6z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      Liquid drops · daily
    </div>
  );
}

function ZoomHint() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-paper/85 text-ink shadow-[0_6px_18px_rgba(31,26,20,0.12)] backdrop-blur transition group-hover:scale-105 group-hover:bg-paper"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3.5 3.5M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Lightbox — fullscreen modal with a Swiper for image navigation,
// keyboard support, and tap-the-backdrop close. framer-motion handles
// the entrance / exit motion.
// ---------------------------------------------------------------------------
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: StorefrontImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.22}}
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{opacity: 0, scale: 0.96}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.96}}
        transition={{duration: 0.25, ease: [0.22, 0.61, 0.36, 1]}}
        className="relative w-full max-w-5xl px-4 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Keyboard, A11y]}
          initialSlide={initialIndex}
          spaceBetween={20}
          slidesPerView={1}
          keyboard={{enabled: true}}
          a11y={{enabled: true}}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id ?? i}>
              <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-paper sm:aspect-[3/4]">
                <Image
                  data={img}
                  sizes="90vw"
                  className="block max-h-full max-w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Counter + close */}
        <div className="mt-4 flex items-center justify-between text-paper">
          <span className="text-[11.5px] font-bold uppercase tracking-[0.28em]">
            {activeIndex + 1} / {images.length}
          </span>
          <div className="flex items-center gap-2">
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => swiper?.slidePrev()}
                  className="grid h-10 w-10 place-items-center rounded-full border border-paper/30 text-paper transition hover:bg-paper/10"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => swiper?.slideNext()}
                  className="grid h-10 w-10 place-items-center rounded-full border border-paper/30 text-paper transition hover:bg-paper/10"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Close affordance — corner button */}
      <button
        type="button"
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-paper/15 text-paper backdrop-blur transition hover:bg-paper/25 sm:right-6 sm:top-6"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  );
}
