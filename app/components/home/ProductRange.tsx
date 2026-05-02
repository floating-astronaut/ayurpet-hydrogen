// Product range carousel. Reads live products from the Storefront API
// (passed in via the homepage loader). Swiper-driven horizontal scroll.
import {motion} from 'framer-motion';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, FreeMode, Mousewheel} from 'swiper/modules';
import type {RangeProductFragment} from 'storefrontapi.generated';
// Three distinct CSS subpaths from swiper share one .d.ts barrel, which
// trips eslint's import/no-duplicates. They are not duplicates at runtime.
/* eslint-disable import/no-duplicates */
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
/* eslint-enable import/no-duplicates */

type ProductLite = RangeProductFragment;

type Props = {
  eyebrow?: string;
  title?: string;
  products: ProductLite[];
};


function benefitFor(p: ProductLite): string | null {
  const handle = p.handle.toLowerCase();
  const title = p.title.toLowerCase();
  if (handle.includes('goodgut') || title.includes('digestive')) return 'Digestive enzyme drops';
  if (handle.includes('ashwagandha') || title.includes('ashwagandha')) return 'Calming chew ritual';
  if (handle.includes('turmeric') || title.includes('turmeric')) return 'Joint + skin support';
  if (handle.includes('himalayan') || title.includes('himalayan')) return 'Single-ingredient yak chew';
  if (handle.includes('pack-of-3') || handle.includes('combo')) return 'Routine bundle';
  return null;
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*\|\s*/g, ' · ')
    .replace(/\s*Advanced Ayurveda \+ Science Backed Formulation\s*/i, '')
    .replace(/\s*6-Hour Long Lasting Dental Chew\s*/i, '');
}
function badgeFor(p: ProductLite): string | null {
  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  if (tags.includes('bestseller')) return 'Bestseller';
  if (tags.includes('new')) return 'New';
  const compare = Number(p.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  const price = Number(p.priceRange.minVariantPrice.amount);
  if (compare > 0 && compare > price) return 'Save';
  return null;
}

export function ProductRange({
  eyebrow = 'The full range',
  title = 'Made for every chapter of dog life.',
  products,
}: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1] text-ink">
              {title}
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous"
              className="ayur-prev grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-ink transition hover:bg-brand hover:text-paper"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 2L4 8l6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              className="ayur-next grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-ink transition hover:bg-brand hover:text-paper"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, FreeMode, Mousewheel]}
        slidesPerView={1.15}
        spaceBetween={16}
        freeMode={{enabled: true, momentum: true}}
        mousewheel={{forceToAxis: true, sensitivity: 1}}
        navigation={{prevEl: '.ayur-prev', nextEl: '.ayur-next'}}
        breakpoints={{
          640: {slidesPerView: 2.15, spaceBetween: 20},
          1024: {slidesPerView: 3.15, spaceBetween: 24},
          1280: {slidesPerView: 3.5, spaceBetween: 28},
        }}
        className="!px-6 md:!px-12"
      >
        {products.map((p, i) => {
          const badge = badgeFor(p);
          const benefit = benefitFor(p);
          return (
            <SwiperSlide key={p.id}>
              <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.3}}
                transition={{duration: 0.5, delay: (i % 4) * 0.08}}
              >
                <Link to={`/products/${p.handle}`} prefetch="intent" className="group block">
                  <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-cream">
                    <div className="aspect-[4/5]">
                      {p.featuredImage ? (
                        <Image
                          data={p.featuredImage}
                          aspectRatio="4/5"
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 90vw"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-ink-muted">—</div>
                      )}
                    </div>
                    {badge && (
                      <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-saffron px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 rounded-[1.1rem] border border-line/70 bg-paper/82 p-4 shadow-[0_12px_30px_rgba(31,26,20,0.04)]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 font-display text-[1.05rem] leading-[1.15] tracking-tight text-ink sm:text-[1.15rem]">
                        {cleanTitle(p.title)}
                      </h3>
                      <span className="shrink-0 whitespace-nowrap font-sans text-sm font-bold text-ink">
                        <Money data={p.priceRange.minVariantPrice} />
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {benefit ? (
                        <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                          {benefit}
                        </span>
                      ) : null}
                      {p.vendor ? (
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                          {p.vendor.replace('International', '').trim()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
