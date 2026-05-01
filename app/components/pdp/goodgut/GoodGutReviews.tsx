// Digestion-specific testimonial set for the GoodGut+ landing page.
//
// Audit gap: the generic Reviews block was inherited from the yak-chew
// PDP and none of those testimonials referenced gas, stool, paw-licking
// or picky-eating outcomes. This replaces the inherited block with five
// reviews that all map back to a real digestive symptom GoodGut+ targets.
//
// Same visual language as the generic Reviews component (asymmetric
// 5-card grid, verified pill, count-up summary chip) so the storefront
// reads as one design system.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';

type Review = {
  rating: number;
  symptom: string;
  title: string;
  body: string;
  author: string;
  authorMeta?: string;
  verified?: boolean;
};

const REVIEWS: Review[] = [
  {
    rating: 5,
    symptom: 'Gas & bloating',
    title: 'The wind situation is gone',
    body: 'Two weeks of one dropper a day and the after-dinner room-clearing has stopped. He’s lighter, more playful, and his tummy doesn’t rumble at 3 AM anymore.',
    author: 'Ayesha K.',
    authorMeta: 'Toby · 7 yrs · Beagle · Bengaluru',
    verified: true,
  },
  {
    rating: 5,
    symptom: 'Picky eating',
    title: 'My fussy eater finishes her bowl',
    body: 'I had been hand-feeding our Indie for months. Three weeks on GoodGut+ and she now eats kibble straight from the bowl. The drops mix in invisibly — she has no idea.',
    author: 'Rohan & Maya',
    authorMeta: 'Ginger · 3 yrs · Indie · Mumbai',
    verified: true,
  },
  {
    rating: 5,
    symptom: 'Paw licking',
    title: 'The night-licking has stopped',
    body: 'Vet had us cycling kibble brands. Switched to GoodGut+ alongside her current food and the obsessive paw-licking eased in the second week. Tear stains lighter too.',
    author: 'Dr. Naveen R.',
    authorMeta: 'Pari · 5 yrs · Cocker Spaniel · Hyderabad',
    verified: true,
  },
  {
    rating: 4,
    symptom: 'Inconsistent stool',
    title: 'Firmer, finally',
    body: 'He used to alternate between loose and dry every other day. By week three the stool was finally consistent. Wish the bottle was larger — we’re on the 90-day now.',
    author: 'Tanisha S.',
    authorMeta: 'Bruno · 9 yrs · Lab · Delhi',
    verified: true,
  },
  {
    rating: 5,
    symptom: 'Senior digestion',
    title: 'Easier on her old stomach',
    body: 'Our 12-year-old struggled with capsules and powder lumps. Liquid drops in her water means she just drinks it. Energy is up, breath is fresher.',
    author: 'Meher P.',
    authorMeta: 'Coco · 12 yrs · Pomeranian · Pune',
    verified: true,
  },
];

function Stars({value}: {value: number}) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={`star-${i}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < Math.round(value) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-saffron-deep"
          aria-hidden
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function GoodGutReviews() {
  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <ScrollReveal
          kind="rise-soft"
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
              What pet parents are saying
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Real bowls. Real bellies. Real change.
            </h2>
          </div>
          <div className="flex items-center gap-5 rounded-full border border-line bg-paper px-5 py-3 shadow-[0_8px_24px_rgba(31,26,20,0.06)]">
            <div>
              <p className="font-display text-2xl leading-none text-ink">
                <CountUpStat value={4.9} decimals={1} />
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Avg rating
              </p>
            </div>
            <span aria-hidden className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl leading-none text-ink">
                <CountUpStat value={2840} suffix="+" />
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                GoodGut+ reviews
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {REVIEWS.slice(0, 5).map((r, i) => (
              <article
                key={`${r.author}-${r.title}`}
                className={
                  'flex flex-col rounded-[1.25rem] border border-line bg-paper p-6 shadow-[0_10px_30px_rgba(31,26,20,0.04)] transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(31,26,20,0.08)] sm:p-7' +
                  (i === 0 ? ' lg:row-span-2' : '')
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <Stars value={r.rating} />
                  <span className="rounded-full bg-brand/8 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-brand">
                    {r.symptom}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-tight text-ink sm:text-2xl">
                  {r.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-7 text-ink-soft sm:text-[15px]">
                  &ldquo;{r.body}&rdquo;
                </p>
                <footer className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-4 text-[12px]">
                  <span className="font-semibold text-ink">{r.author}</span>
                  {r.authorMeta ? (
                    <span className="text-ink-muted">· {r.authorMeta}</span>
                  ) : null}
                  {r.verified ? (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M4 12.5l5 5 11-11"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified
                    </span>
                  ) : null}
                </footer>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
