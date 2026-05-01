// "Shop by routine" tile rail. Each tile is a real link into the matching
// curated collection, with a distinct AyurPet-shot lifestyle or product
// visual so no packshot is repeated across the row. Calming is featured
// (lg:row-span-2) so the rhythm reads intentional.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Tile = {
  label: string;
  title: string;
  body: string;
  to: string;
  /** Public path stem — `/brand/{img}.{webp|jpg}`. */
  img: string;
  imgAlt: string;
  feature?: boolean;
  /** Object-position for the tile photo. */
  pos?: string;
};

const TILES: Tile[] = [
  {
    label: 'For anxious dogs',
    title: 'Calming routines',
    body: 'Ashwagandha-led rituals for fireworks, travel, vet visits, anxious nights.',
    to: '/collections/calming',
    img: 'lifestyle-two-dogs-1200',
    imgAlt: 'Two dogs being offered a yak cheese chew',
    feature: true,
    pos: 'object-[center_30%]',
  },
  {
    label: 'Gut · skin · coat',
    title: 'Daily wellness',
    body: 'Turmeric and gut-support formulas for itchy skin, tear stains, and sensitive bellies.',
    to: '/collections/gut-support',
    img: 'lifestyle-corgi-chew-1200',
    imgAlt: 'A corgi running with a chew',
  },
  {
    label: 'Chew · enrich',
    title: 'Yak chew rituals',
    body: 'Slow-aged Himalayan yak cheese chews — six hours of dental engagement, no fillers.',
    to: '/collections/yak-chews',
    img: 'lifestyle-kelpie-resting-1200',
    imgAlt: 'A brown kelpie resting with a yak cheese chew',
  },
  {
    label: 'For senior dogs',
    title: 'Joint support',
    body: 'Turmeric, boswellia, and ghee-based blends to keep stairs and walks easy.',
    to: '/collections/joint-care',
    img: 'turmeric-lifestyle',
    imgAlt: 'Healing turmeric chew — boosts joint health and mobility',
  },
  {
    label: 'Save & simplify',
    title: 'Routine bundles',
    body: 'Curated three-product kits at a single bundled price.',
    to: '/collections/bundles',
    img: 'original-sizes',
    imgAlt: 'Three pack sizes of Original Himalayan yak cheese chews',
  },
];

export function ShopTheShelf() {
  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              Shop by routine
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Five rituals. One clean shelf.
            </h2>
          </div>
          <Link
            to="/collections/all"
            prefetch="intent"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand transition hover:text-brand-deep"
          >
            View all products
            <span aria-hidden>→</span>
          </Link>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {TILES.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                prefetch="intent"
                className={
                  'group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.5rem] text-paper shadow-[0_18px_50px_rgba(31,26,20,0.08)] ring-1 ring-line/40 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(31,26,20,0.16)]' +
                  (t.feature ? ' lg:row-span-2 lg:min-h-[440px]' : '')
                }
              >
                {/* Real photo */}
                <picture>
                  <source srcSet={`/brand/${t.img}.webp`} type="image/webp" />
                  <img
                    src={`/brand/${t.img}.jpg`}
                    alt={t.imgAlt}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${t.pos ?? 'object-center'}`}
                    loading="lazy"
                    width={1200}
                    height={t.feature ? 1500 : 800}
                  />
                </picture>
                {/* Brand-color overlay so copy stays legible regardless of photo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0.10)_0%,rgba(31,26,20,0.30)_45%,rgba(31,26,20,0.78)_85%,rgba(31,26,20,0.92)_100%)]"
                />

                <div className="relative p-6 sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper/75">
                    {t.label}
                  </p>
                  <h3
                    className={
                      'mt-2 font-display leading-[0.95] tracking-tight text-paper ' +
                      (t.feature
                        ? 'text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem]'
                        : 'text-[1.85rem] sm:text-[2.1rem]')
                    }
                  >
                    {t.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[13px] leading-6 text-paper/80 sm:text-[14px]">
                    {t.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-paper transition group-hover:gap-3">
                    Shop the routine
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
