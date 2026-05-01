// Honest expectations — paired "Made for / Not a substitute for" cards.
// Uses LandingCard primitive so both columns get identical padding,
// border radius, and shadow (audit feedback: top edges + bottom CTAs
// must align across multi-column desktop cards).
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

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
  'Cats — formulated for canine digestion only',
];

export function MadeForNotFor() {
  return (
    <LandingSection tone="paper">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="Honest expectations"
          title={<>Who GoodGut+ is for &mdash; and where it isn&rsquo;t the right call.</>}
        />
      </ScrollReveal>

      <div className="mt-9 grid gap-4 sm:gap-5 lg:grid-cols-2">
        <ScrollReveal kind="rise-soft">
          <LandingCard className="h-full border-brand/30">
            <p className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.28em] text-brand">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-brand text-paper">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Made for
            </p>
            <ul className="mt-5 space-y-3 text-[13.5px] leading-[1.55] text-ink-soft sm:text-[14.5px] sm:leading-[1.65]">
              {MADE_FOR.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </LandingCard>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft">
          <LandingCard className="h-full border-clay/40">
            <p className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.28em] text-clay">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-clay text-paper">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              Not a substitute for
            </p>
            <ul className="mt-5 space-y-3 text-[13.5px] leading-[1.55] text-ink-soft sm:text-[14.5px] sm:leading-[1.65]">
              {NOT_FOR.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-cream/80 p-3 text-[12px] leading-[1.55] text-ink-soft">
              If your dog has any acute symptom, please call your vet first.
              Supplements support routines &mdash; they don&rsquo;t replace
              diagnosis.
            </p>
          </LandingCard>
        </ScrollReveal>
      </div>
    </LandingSection>
  );
}
