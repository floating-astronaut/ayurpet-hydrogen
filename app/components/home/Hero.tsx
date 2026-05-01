// Editorial home hero — full-bleed, parallax product, animated callout chips,
// scrolling brand marquee strip at the bottom.
import {useRef} from 'react';
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
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yProduct = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-cream px-6 pt-20 pb-32 md:px-12 lg:pt-32"
    >
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
            <motion.p
              initial={{opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, ease: 'easeOut'}}
              className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-brand"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
            className="font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] text-ink"
          >
            {headline}
          </motion.h1>
          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2, ease: 'easeOut'}}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {sub}
          </motion.p>
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.35}}
            className="mt-10"
          >
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
          </motion.div>

          {badges.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
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
          initial={{opacity: 0, scale: 0.92}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
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
          <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.6}}
            className="absolute -left-6 top-12 hidden rounded-2xl bg-paper px-5 py-3 shadow-lg md:block"
          >
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">
              Ingredient
            </div>
            <div className="font-display text-lg text-ink">Ashwagandha</div>
          </motion.div>
          <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.8}}
            className="absolute -right-4 bottom-16 hidden rounded-2xl bg-brand px-5 py-3 text-paper shadow-lg md:block"
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Origin
            </div>
            <div className="font-display text-lg">Himalayan</div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-line bg-cream-deep py-4">
        <motion.div
          animate={{x: ['0%', '-50%']}}
          transition={{duration: 30, repeat: Infinity, ease: 'linear'}}
          className="flex shrink-0 gap-12 whitespace-nowrap font-display text-xl text-ink-soft"
        >
          {Array.from({length: 2}).flatMap((_, k) =>
            ['Vet-approved', '·', 'Lab-tested', '·', 'Himalayan-sourced', '·', 'Buy 1 · Help 1', '·', 'No nasties', '·'].map(
              (t, i) => (
                <span key={`${k}-${i}`} className="px-2">
                  {t}
                </span>
              ),
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
