// Merchandising spotlight rail — sits above the product grid on collection
// pages. Four editorial tiles ("Best for calming", "Best for dental chew",
// "Bundle value", "Daily gut support") guide the visitor into a routine
// before they look at the grid. Each tile is a real link into the matching
// curated collection.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Tile = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  /** Tailwind gradient classes for the art block. */
  art: string;
  glyph: string;
};

const TILES: Tile[] = [
  {
    eyebrow: 'Editor pick',
    title: 'Best for calming',
    body: 'Ashwagandha-led chews & drops for fireworks, vet visits, anxious nights.',
    cta: 'Shop calming',
    to: '/collections/calming',
    art: 'bg-[linear-gradient(140deg,#2d5a3d_0%,#3d6f4d_55%,#1a3a26_100%)]',
    glyph: '☾',
  },
  {
    eyebrow: 'Six-hour ritual',
    title: 'Best for dental chew',
    body: 'Slow-aged Himalayan yak cheese — single ingredient, no fillers, 6h+.',
    cta: 'Shop chews',
    to: '/collections/yak-chews',
    art: 'bg-[linear-gradient(140deg,#b85e3e_0%,#cc7252_55%,#8a3f24_100%)]',
    glyph: '✦',
  },
  {
    eyebrow: 'Save & simplify',
    title: 'Bundle value',
    body: 'Three-product kits — calm + gut + chew at one bundled price.',
    cta: 'Shop bundles',
    to: '/collections/bundles',
    art: 'bg-[linear-gradient(140deg,#d99441_0%,#e9a85a_55%,#b8772f_100%)]',
    glyph: '✧',
  },
  {
    eyebrow: 'Skin & coat',
    title: 'Daily gut support',
    body: 'Turmeric and digestive blends for itchy skin, tear stains, sensitive bellies.',
    cta: 'Shop wellness',
    to: '/collections/gut-support',
    art: 'bg-[linear-gradient(140deg,#3d3526_0%,#5a4d36_55%,#2a2419_100%)]',
    glyph: '✿',
  },
];

export function MerchSpotlight() {
  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <ScrollReveal kind="rise-soft" stagger>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {TILES.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                prefetch="intent"
                className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[1.25rem] p-5 text-paper shadow-[0_14px_40px_rgba(31,26,20,0.08)] ring-1 ring-line/40 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(31,26,20,0.18)] hover:ring-line/0 sm:p-6"
              >
                <div className={'pointer-events-none absolute inset-0 ' + t.art} />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_20%_20%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_80%_85%,#000_0%,transparent_55%)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1 select-none font-display text-[6.5rem] leading-none text-paper/15"
                >
                  {t.glyph}
                </span>

                <p className="relative text-[10px] font-bold uppercase tracking-[0.28em] text-paper/70">
                  {t.eyebrow}
                </p>

                <div className="relative">
                  <h3 className="font-display text-[1.5rem] leading-[1.05] tracking-tight text-paper sm:text-[1.7rem]">
                    {t.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-paper/75 sm:text-[13px]">
                    {t.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-paper transition group-hover:gap-2.5">
                    {t.cta}
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
