// Premium "Shop by routine" merchandising block. Five image-led editorial
// tiles, each linking into a curated collection. The first tile is taller
// (lg:row-span-2) to break the rhythm and feel intentional rather than a
// generated grid. Static art direction (gradient + glyph + headline) means
// it ships even before real lifestyle photography is plugged in — when art
// arrives, swap the gradient block for an <Image>.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Tile = {
  label: string;
  title: string;
  body: string;
  to: string;
  /** Tailwind gradient classes for the art block until real imagery lands. */
  art: string;
  /** Decorative initial behind the headline — sets the tile's character. */
  glyph: string;
  /** When true, this tile pops up taller in the lg layout. */
  feature?: boolean;
};

const TILES: Tile[] = [
  {
    label: 'For anxious dogs',
    title: 'Calming routines',
    body: 'Ashwagandha-led rituals for fireworks, travel, vet visits, and quiet evenings.',
    to: '/collections/calming',
    art: 'bg-[linear-gradient(140deg,#2d5a3d_0%,#3d6f4d_50%,#1a3a26_100%)]',
    glyph: '☾',
    feature: true,
  },
  {
    label: 'Gut · skin · coat',
    title: 'Daily wellness',
    body: 'Turmeric and gut-support formulas for itchy skin, tear stains, and sensitive bellies.',
    to: '/collections/gut-support',
    art: 'bg-[linear-gradient(140deg,#d99441_0%,#e9a85a_55%,#b8772f_100%)]',
    glyph: '✿',
  },
  {
    label: 'Chew · enrich',
    title: 'Yak chew rituals',
    body: 'Slow-aged Himalayan yak cheese chews — six hours of dental engagement, no fillers.',
    to: '/collections/yak-chews',
    art: 'bg-[linear-gradient(140deg,#b85e3e_0%,#cc7252_55%,#8a3f24_100%)]',
    glyph: '✦',
  },
  {
    label: 'For senior dogs',
    title: 'Joint support',
    body: 'Turmeric, boswellia, and ghee-based blends to keep stairs, walks, and zoomies easy.',
    to: '/collections/joint-care',
    art: 'bg-[linear-gradient(140deg,#3d3526_0%,#5a4d36_55%,#2a2419_100%)]',
    glyph: '◈',
  },
  {
    label: 'Save & simplify',
    title: 'Routine bundles',
    body: 'Curated three-product kits at a single bundled price — calm, gut, and chew in one box.',
    to: '/collections/bundles',
    art: 'bg-[linear-gradient(140deg,#f0d29e_0%,#e6bf76_55%,#c79747_100%)]',
    glyph: '✧',
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
                key={t.label}
                to={t.to}
                prefetch="intent"
                className={
                  'group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-line/60 shadow-[0_18px_50px_rgba(31,26,20,0.08)] transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(31,26,20,0.16)]' +
                  (t.feature ? ' lg:row-span-2' : '')
                }
              >
                <div
                  className={
                    'relative flex flex-1 flex-col justify-between p-7 text-paper sm:p-9 ' +
                    t.art +
                    (t.feature ? ' min-h-[440px]' : ' min-h-[260px]')
                  }
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_20%_20%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_80%_85%,#000_0%,transparent_55%)]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-6 top-4 select-none font-display text-[8rem] leading-none text-paper/15 sm:text-[10rem]"
                  >
                    {t.glyph}
                  </span>

                  <p className="relative text-[10px] font-semibold uppercase tracking-[0.32em] text-paper/75">
                    {t.label}
                  </p>

                  <div className="relative">
                    <h3
                      className={
                        'font-display leading-[0.95] tracking-tight text-paper ' +
                        (t.feature
                          ? 'text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem]'
                          : 'text-[1.85rem] sm:text-[2.2rem]')
                      }
                    >
                      {t.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[13px] leading-7 text-paper/80 sm:text-[14px]">
                      {t.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-paper transition group-hover:gap-3">
                      Shop the routine
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
