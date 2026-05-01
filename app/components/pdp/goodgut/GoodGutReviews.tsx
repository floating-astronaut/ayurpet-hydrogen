// Compressed digestive testimonial set. Audit said the reviews section
// hit 2,085px on mobile — too much vertical real estate. Fix:
//   - Show ONLY the 3 strongest cards by default.
//   - Keep the asymmetric grid on lg+ (first card row-spans).
//   - Hide the remaining 2 reviews behind a "Read 2 more" disclosure
//     so social proof stays available without taxing the scroll.
//
// Padding/border/radius come from LandingCard so cards align with the
// rest of the page's grammar.
import {useState} from 'react';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

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

function ReviewCard({
  review,
  feature,
}: {
  review: Review;
  feature?: boolean;
}) {
  return (
    <LandingCard
      as="article"
      className={
        'flex h-full flex-col transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(31,26,20,0.08)] ' +
        (feature ? 'lg:row-span-2' : '')
      }
    >
      <div className="flex items-center justify-between gap-3">
        <Stars value={review.rating} />
        <span className="rounded-full bg-brand/8 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-brand">
          {review.symptom}
        </span>
      </div>
      <h3 className="mt-4 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">
        {review.title}
      </h3>
      <p className="mt-3 flex-1 text-[13.5px] leading-[1.7] text-ink-soft sm:text-[14.5px]">
        &ldquo;{review.body}&rdquo;
      </p>
      <footer className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-4 text-[12px]">
        <span className="font-semibold text-ink">{review.author}</span>
        {review.authorMeta ? (
          <span className="text-ink-muted">· {review.authorMeta}</span>
        ) : null}
        {review.verified ? (
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
    </LandingCard>
  );
}

export function GoodGutReviews() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? REVIEWS : REVIEWS.slice(0, 3);
  const moreCount = REVIEWS.length - 3;

  return (
    <LandingSection tone="cream" className="border-y border-line">
      <ScrollReveal
        kind="rise-soft"
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <SectionHeader
          eyebrow="What pet parents are saying"
          title={<>Real bowls. Real bellies. Real change.</>}
          className="max-w-2xl"
        />
        <div className="flex items-center gap-5 rounded-full border border-line bg-paper px-5 py-3 shadow-[0_8px_24px_rgba(31,26,20,0.06)]">
          <div>
            <p className="font-display text-[1.4rem] leading-none text-ink sm:text-[1.5rem]">
              <CountUpStat value={4.9} decimals={1} />
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Avg rating
            </p>
          </div>
          <span aria-hidden className="h-8 w-px bg-line" />
          <div>
            <p className="font-display text-[1.4rem] leading-none text-ink sm:text-[1.5rem]">
              <CountUpStat value={2840} suffix="+" />
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Reviews
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {visible.map((r, i) => (
            <ReviewCard
              key={`${r.author}-${r.title}`}
              review={r}
              feature={i === 0}
            />
          ))}
        </div>
      </ScrollReveal>

      {moreCount > 0 ? (
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.22em] text-ink transition hover:border-brand hover:text-brand"
          >
            {expanded ? 'Show fewer' : `Read ${moreCount} more reviews`}
            <span
              aria-hidden
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              ↓
            </span>
          </button>
        </div>
      ) : null}
    </LandingSection>
  );
}
