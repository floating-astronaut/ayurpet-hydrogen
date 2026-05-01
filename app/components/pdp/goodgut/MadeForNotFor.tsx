// "Made for / Not a substitute for" — sets honest expectations about
// what GoodGut+ is and what it isn't. Important on a wellness/digestive
// product so the page doesn't read as a medical claim.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

const MADE_FOR = [
  'Dogs with sensitive digestion, gas, or bloating',
  'Picky eaters and dogs with low or fluctuating appetite',
  'Skin / paw / ear flare-ups linked to gut imbalance',
  'Seniors transitioning between foods',
  'Puppies 6 months+ on a maintenance routine',
];

const NOT_FOR = [
  'A replacement for urgent veterinary care',
  'Acute vomiting, blood in stool, or sudden lethargy',
  'Dogs with diagnosed pancreatic or liver disease — please consult your vet',
  'Cats (we have a separate formula coming soon)',
];

export function MadeForNotFor() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
            Honest expectations
          </p>
          <h2 className="mt-4 break-words font-display text-[1.85rem] leading-[1.05] tracking-tight text-ink sm:text-[2.4rem] lg:text-[3rem]">
            Who GoodGut+ is for &mdash; and where it isn&rsquo;t the right call.
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:gap-6 lg:grid-cols-2">
          <ScrollReveal
            kind="rise-soft"
            className="rounded-[1.5rem] border border-brand/30 bg-paper p-6 shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-8"
          >
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-brand text-paper">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Made for
            </p>
            <ul className="mt-5 space-y-3.5 text-[14px] leading-7 text-ink-soft sm:text-[15px]">
              {MADE_FOR.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {line}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal
            kind="rise-soft"
            className="rounded-[1.5rem] border border-clay/40 bg-paper p-6 shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-8"
          >
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-clay">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-clay text-paper">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              Not a substitute for
            </p>
            <ul className="mt-5 space-y-3.5 text-[14px] leading-7 text-ink-soft sm:text-[15px]">
              {NOT_FOR.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-cream/80 p-3 text-[12px] leading-5 text-ink-soft">
              If your dog has any acute symptom, please call your vet first.
              Supplements support routines &mdash; they don&rsquo;t replace
              diagnosis.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
