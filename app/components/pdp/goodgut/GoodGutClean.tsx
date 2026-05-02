// "What's NOT in our drops" — exclusion list. Lifted from the Native
// Pet "Ingredients We Refuse" pattern. Single dark-cream band with a
// tight 2x or 3x grid of crossed-out items, each with a one-line
// reason. Builds trust at the moment a customer is scanning for what
// might *trigger* their dog.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingSection, SectionHeader} from './primitives';

type Refusal = {label: string; reason: string};

const REFUSED: Refusal[] = [
  {
    label: 'Artificial colours',
    reason: 'No FD&C dyes — only the natural amber of the herb extract.',
  },
  {
    label: 'Artificial flavours',
    reason: 'Dogs accept it because it tastes like food, not bubblegum.',
  },
  {
    label: 'Synthetic preservatives',
    reason: 'No BHA, BHT, ethoxyquin, or sodium benzoate.',
  },
  {
    label: 'Fillers & binders',
    reason: 'No wheat starch or maltodextrin to pad the dropper.',
  },
  {
    label: 'Sugar & sweeteners',
    reason: 'No xylitol (toxic to dogs), sucralose, or stevia.',
  },
  {
    label: 'Soy, dairy, or gluten',
    reason: 'Common allergy triggers — left out by default.',
  },
  {
    label: 'GMO ingredients',
    reason: 'Every herb traceable to a wild-harvest or organic farm.',
  },
  {
    label: 'Mystery proprietary blends',
    reason: 'Each ingredient and its dose is on the bottle.',
  },
];

export function GoodGutClean() {
  return (
    <LandingSection tone="cream" className="border-y border-line">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="What we refuse"
          eyebrowTone="clay"
          title={<>The list is short on purpose.</>}
          body="Eight categories of additive that other supplements use to cut cost or mask taste. None of them belong in a daily ritual for a 30-pound family member."
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {REFUSED.map((r) => (
            <li
              key={r.label}
              className="group relative rounded-3xl border border-line/70 bg-paper/70 p-5 transition hover:border-clay/40 hover:bg-paper sm:p-6"
            >
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-clay/12 text-clay"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <p className="mt-4 font-display text-[1rem] leading-tight text-ink line-through decoration-clay/60 decoration-[1.5px] underline-offset-4 sm:text-[1.1rem]">
                {r.label}
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-ink-soft sm:text-[13px] sm:leading-[1.6]">
                {r.reason}
              </p>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal kind="fade" className="mt-7 sm:mt-9">
        <p className="text-center text-[11.5px] uppercase tracking-[0.22em] text-ink-muted sm:text-[12px]">
          Made in an FDA-registered, ISO 22000 / HACCP audited facility.
        </p>
      </ScrollReveal>
    </LandingSection>
  );
}
