// Editorial home hero — full-bleed, parallax product, animated callout chips,
// scrolling brand marquee strip at the bottom.
//
// Animation strategy: the only motion that fires on first paint uses CSS
// keyframes triggered by a `data-loaded` attribute we set after hydration.
// This keeps server HTML identical to client HTML (no hydration mismatch),
// while still giving us a polished entry. Scroll-driven animations use
// Framer Motion's `useScroll`, which is SSR-safe (renders identical
// transform: 'none' on server and progresses on client scroll).
import {useEffect, useRef, useState} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';

type Props = {
  eyebrow?: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  productImage: Pick<ImageType, 'url' | 'altText' | 'width' | 'height'> | null;
  badges?: string[];
};

export function Hero({
  eyebrow = 'Ancient Ayurveda × Modern Vet Science',
  headline,
  sub,
  ctaLabel,
  ctaHref,
  productImage,
  badges = ['Vet-approved', 'Lab-tested', 'Himalayan-sourced', 'Buy 1 · Help 1'],
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yProduct = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-loaded={loaded ? '' : undefined}
      className="ayur-hero relative min-h-[100svh] overflow-hidden bg-cream px-6 pt-20 pb-32 md:px-12 lg:pt-32"
    >
      <style>{`
        .ayur-hero [data-stagger] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ayur-hero[data-loaded] [data-stagger] { opacity: 1; transform: translateY(0); }
        .ayur-hero[data-loaded] [data-stagger="1"] { transition-delay: 0.05s; }
        .ayur-hero[data-loaded] [data-stagger="2"] { transition-delay: 0.18s; }
        .ayur-hero[data-loaded] [data-stagger="3"] { transition-delay: 0.32s; }
        .ayur-hero[data-loaded] [data-stagger="4"] { transition-delay: 0.45s; }
        .ayur-hero[data-loaded] [data-stagger="5"] { transition-delay: 0.6s; }
        .ayur-hero[data-loaded] [data-stagger="6"] { transition-delay: 0.78s; }

        .ayur-hero-marquee {
          animation: ayur-hero-marquee 30s linear infinite;
        }
        @keyframes ayur-hero-marquee {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ayur-hero [data-stagger] { transition: none; opacity: 1; transform: none; }
          .ayur-hero-marquee { animation: none; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-32 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{background: 'radial-gradient(circle, var(--color-brand-leaf) 0%, transparent 70%)'}}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
        style={{background: 'radial-gradient(circle, var(--color-saffron) 0%, transparent 70%)'}}
      />

      <motion.div
        style={{opacity}}
        className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16"
      >
        <div className="lg:col-span-7">
          {eyebrow && (
            <p
              data-stagger="1"
              className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-brand"
            >
              {eyebrow}
            </p>
          )}
          <h1
            data-stagger="2"
            className="font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] text-ink"
          >
            {headline}
          </h1>
          <p
            data-stagger="3"
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {sub}
          </p>
          <div data-stagger="4" className="mt-10">
            <Link
              to={ctaHref}
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand px-10 text-base font-medium text-paper transition hover:bg-brand-deep"
            >
              {ctaLabel}
              <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 8h14M9 2l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {badges.length > 0 && (
            <div
              data-stagger="5"
              className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted"
            >
              {badges.map((b) => (
                <span key={b} className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        <motion.div
          style={{y: yProduct}}
          data-stagger="3"
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] bg-cream-deep shadow-2xl">
            {productImage ? (
              <Image
                data={productImage}
                aspectRatio="4/5"
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-ink-muted">
                <span className="font-display text-2xl">Ayurpet</span>
              </div>
            )}
          </div>
          <div
            data-stagger="6"
            className="absolute -left-6 top-12 hidden rounded-2xl bg-paper px-5 py-3 shadow-lg md:block"
          >
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">
              Ingredient
            </div>
            <div className="font-display text-lg text-ink">Ashwagandha</div>
          </div>
          <div
            data-stagger="6"
            className="absolute -right-4 bottom-16 hidden rounded-2xl bg-brand px-5 py-3 text-paper shadow-lg md:block"
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Origin
            </div>
            <div className="font-display text-lg">Himalayan</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-line bg-cream-deep py-4">
        <div className="ayur-hero-marquee flex shrink-0 gap-12 whitespace-nowrap font-display text-xl text-ink-soft will-change-transform">
          {Array.from({length: 2}).flatMap((_, k) =>
            ['Vet-approved', '·', 'Lab-tested', '·', 'Himalayan-sourced', '·', 'Buy 1 · Help 1', '·', 'No nasties', '·'].map(
              (t, i) => (
                <span key={`${k}-${i}`} className="px-2">
                  {t}
                </span>
              ),
            ),
          )}
        </div>
      </div>
    </section>
  );
}
