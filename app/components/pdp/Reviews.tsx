// Curated testimonial / review section. Five short, honest-feeling quotes
// rendered as editorial cards on a cream band, with stars + name + dog +
// optional verified-purchase pill. Static for now — when a real reviews app
// integration lands, swap the DEFAULT_REVIEWS array for query data.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';

type Review = {
  rating: number;
  title: string;
  body: string;
  author: string;
  authorMeta?: string;
  verified?: boolean;
};

const DEFAULT_REVIEWS: Review[] = [
  {
    rating: 5,
    title: 'She finally sleeps through fireworks',
    body: 'Diwali used to mean a sleepless night. The Ashwagandha chews were the first thing in five years that actually helped — calm, not zonked.',
    author: 'Anika R.',
    authorMeta: 'Indie · 4 yrs · Mumbai',
    verified: true,
  },
  {
    rating: 5,
    title: 'Worth every rupee',
    body: 'Two weeks in and our senior lab is going up the stairs without that awful pause at the bottom. The yak chews keep him busy for hours.',
    author: 'Ravi M.',
    authorMeta: 'Bruno · 11 yrs · Bangalore',
    verified: true,
  },
  {
    rating: 5,
    title: "He's obsessed",
    body: "I'm not exaggerating — he hears the bag and runs. Lasts hours. No greasy residue. Vet says his coat looks better too.",
    author: 'Priya S.',
    authorMeta: 'Mocha · 2 yrs · Pune',
    verified: true,
  },
  {
    rating: 5,
    title: 'Switched from chemical-y treats',
    body: 'Our vet recommended cleaning up his treat shelf. These are the only ones I trust now — readable label, lab certificates online.',
    author: 'Sahil & Tanvi',
    authorMeta: 'Coco · 6 yrs · Delhi',
    verified: true,
  },
  {
    rating: 4,
    title: 'Pricey but premium',
    body: "Not the cheapest. But after watching the tummy upsets from bargain treats, I'm happy paying for clean ingredients.",
    author: 'Kavya N.',
    authorMeta: 'Pickle · 3 yrs · Chennai',
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

export function Reviews({reviews = DEFAULT_REVIEWS}: {reviews?: Review[]}) {
  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              What pet parents say
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Real homes. Real dogs. Real change.
            </h2>
          </div>
          <div className="flex items-center gap-5 rounded-full border border-line bg-paper px-5 py-3 shadow-[0_8px_24px_rgba(31,26,20,0.06)]">
            <div>
              <p className="font-display text-2xl leading-none text-ink">
                <CountUpStat value={4.9} decimals={1} />
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Average rating
              </p>
            </div>
            <span aria-hidden className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl leading-none text-ink">
                <CountUpStat value={9340} suffix="+" />
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Verified reviews
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Asymmetric grid: two larger left cards, three stacked on the right.
            On mobile it just stacks all five. */}
        <ScrollReveal kind="rise-soft" stagger className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {reviews.slice(0, 5).map((r, i) => (
              <article
                key={`${r.author}-${r.title}`}
                className={
                  'flex flex-col rounded-[1.25rem] border border-line bg-paper p-6 shadow-[0_10px_30px_rgba(31,26,20,0.04)] transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(31,26,20,0.08)] sm:p-7' +
                  (i === 0 ? ' lg:row-span-2' : '')
                }
              >
                <Stars value={r.rating} />
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
