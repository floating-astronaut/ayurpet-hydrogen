// Merchandising spotlight rail above the collection grid. Four tiles —
// each with its own real lifestyle / product visual so the row reads as a
// curated shelf, not generic gradient boxes. Active overlay keeps the
// copy legible across photo subjects.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Tile = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  img: string;
  imgAlt: string;
};

const TILES: Tile[] = [
  {
    eyebrow: 'Editor pick',
    title: 'Best for calming',
    body: 'Ashwagandha-led chews & drops for fireworks, vet visits, anxious nights.',
    cta: 'Shop calming',
    to: '/collections/calming',
    img: 'ashwa-lifestyle',
    imgAlt: 'Calming chew lifestyle',
  },
  {
    eyebrow: 'Six-hour ritual',
    title: 'Best for dental chew',
    body: 'Slow-aged Himalayan yak cheese — single ingredient, no fillers, 6h+.',
    cta: 'Shop chews',
    to: '/collections/yak-chews',
    img: 'lifestyle-kelpie-chewing-1200',
    imgAlt: 'A dog chewing a yak cheese chew',
  },
  {
    eyebrow: 'Save & simplify',
    title: 'Bundle value',
    body: 'Three-product kits — calm + gut + chew at one bundled price.',
    cta: 'Shop bundles',
    to: '/collections/bundles',
    img: 'original-sizes',
    imgAlt: 'Three pack sizes of yak cheese chews',
  },
  {
    eyebrow: 'Skin & coat',
    title: 'Daily gut support',
    body: 'Turmeric and digestive blends for itchy skin, tear stains, sensitive bellies.',
    cta: 'Shop wellness',
    to: '/collections/gut-support',
    img: 'turmeric-lifestyle',
    imgAlt: 'Healing turmeric chew lifestyle',
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
                className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[1.25rem] p-5 text-paper shadow-[0_14px_40px_rgba(31,26,20,0.08)] ring-1 ring-line/40 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(31,26,20,0.18)] sm:p-6"
              >
                <picture>
                  <source srcSet={`/brand/${t.img}.webp`} type="image/webp" />
                  <img
                    src={`/brand/${t.img}.jpg`}
                    alt={t.imgAlt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                    loading="lazy"
                    width={1080}
                    height={1080}
                  />
                </picture>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0.0)_30%,rgba(31,26,20,0.55)_75%,rgba(31,26,20,0.82)_100%)]"
                />

                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper/75">
                    {t.eyebrow}
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.5rem] leading-[1.05] tracking-tight text-paper sm:text-[1.7rem]">
                    {t.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-paper/80 sm:text-[13px]">
                    {t.body}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-paper transition group-hover:gap-2.5">
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
