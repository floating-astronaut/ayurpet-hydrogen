// Ingredient pillars + liquid-format callout. Uses LandingCard +
// SectionHeader so spacing aligns with the rest of the GoodGut page.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

type Ingredient = {
  name: string;
  latin?: string;
  role: string;
  body: string;
  source: string;
};

const INGREDIENTS: Ingredient[] = [
  {
    name: 'Milk thistle',
    latin: 'Silybum marianum',
    role: 'Liver + gut detox',
    body: 'Silymarin compounds support liver function and bile flow — the cleanup crew that keeps digestion smooth.',
    source: 'Hill-grown · cold-pressed extract',
  },
  {
    name: 'Prebiotics',
    latin: 'Inulin · sweet potato fibre',
    role: 'Feeds beneficial bacteria',
    body: 'Soluble fibre that the good gut microbes feed on — without it, probiotics have nothing to grow.',
    source: 'Plant-derived, vegetarian',
  },
  {
    name: '6 Ayurvedic herbs',
    latin: 'Triphala · Fennel · Slippery elm + 3 more',
    role: 'Soothes & rebalances',
    body: 'A classical Ayurvedic blend used for centuries to calm the digestive tract and ease bloating.',
    source: 'Wild-harvested in India',
  },
];

export function GoodGutIngredients() {
  return (
    <LandingSection tone="paper">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="What’s actually inside"
          title={<>Three pillars. One liquid drop.</>}
          body="Vet-formulated and Ayurvedic-led. Every ingredient earns its place; nothing is in the bottle to look impressive on a label."
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <ul className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {INGREDIENTS.map((it) => (
            <LandingCard as="li" key={it.name} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-[1.35rem] leading-tight text-ink sm:text-[1.5rem]">
                    {it.name}
                  </h3>
                  {it.latin ? (
                    <p className="mt-1 text-[12px] italic leading-snug text-ink-muted">
                      {it.latin}
                    </p>
                  ) : null}
                </div>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1c1.7 1.8 3 3.6 3 5.5a3 3 0 0 1-6 0C4 4.6 5.3 2.8 7 1z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 8v5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>

              <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.22em] text-brand">
                {it.role}
              </p>
              <p className="mt-2 flex-1 text-[14px] leading-[1.65] text-ink-soft">
                {it.body}
              </p>

              <p className="mt-5 border-t border-line/70 pt-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Source ·{' '}
                <span className="normal-case tracking-normal text-ink-soft">
                  {it.source}
                </span>
              </p>
            </LandingCard>
          ))}
        </ul>
      </ScrollReveal>

      {/* Liquid-format dark callout */}
      <ScrollReveal
        kind="rise-soft"
        className="ayur-band-ink relative mt-10 overflow-hidden rounded-[1.5rem] px-6 py-9 text-paper sm:mt-12 sm:px-9 sm:py-11 lg:flex lg:items-center lg:gap-12 lg:px-12 lg:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_18%_30%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_82%_70%,#d99441_0%,transparent_50%)]"
        />
        <div className="relative max-w-xl">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-saffron-soft">
            Liquid · not powder
          </p>
          <h3 className="mt-3 font-display text-[1.65rem] leading-[1.08] tracking-tight sm:text-[2rem]">
            2× faster relief. 3× easier than powders.
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] text-paper/80 sm:text-[15px]">
            Powdered supplements clump, get refused, and only release after
            digestion starts. A liquid extract absorbs from the moment your
            dog licks the bowl &mdash; and takes seconds to add to food or water.
          </p>
        </div>
        <ul className="relative mt-7 grid grid-cols-2 gap-2.5 lg:mt-0 lg:grid-cols-1 lg:gap-2.5">
          {[
            'Mixes easily with food or water',
            'Zero taste battles · even for picky eaters',
            'No clumps · no choking',
            'Perfect for long-term daily use',
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 rounded-xl border border-paper/15 bg-paper/5 px-3 py-2.5 text-[12.5px] leading-[1.5] text-paper/90"
            >
              <span aria-hidden className="mt-0.5 text-saffron-soft">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </LandingSection>
  );
}
