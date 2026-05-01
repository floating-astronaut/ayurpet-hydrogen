// Digestive-drops specific FAQ. Native <details>/<summary> for SSR-
// friendly accordion + visual rhythm matching the rest of the page.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingSection, SectionHeader} from './primitives';

type Item = {q: string; a: string};

const ITEMS: Item[] = [
  {
    q: 'How fast will I see a difference?',
    a: 'Most owners notice calmer digestion within 7–10 days — less gas, fewer post-meal disturbances. Stool consistency and skin/paw signs typically improve over 28 days, which is why we sell a 30-day starter bottle.',
  },
  {
    q: 'How does GoodGut+ taste? Will my dog accept it?',
    a: 'In our 2025 trial, 92% of dogs took it without resistance — most don’t notice it’s there. The drops mix into food or water with no clumping and no scent. We made the format specifically for picky eaters.',
  },
  {
    q: 'Can I give it with my dog’s current food or medication?',
    a: 'GoodGut+ is a food-grade liquid supplement, so it sits well alongside any kibble or wet food. If your dog is on prescription medication, we recommend a 1-hour gap and a quick check with your vet before starting.',
  },
  {
    q: 'Is it safe for puppies and senior dogs?',
    a: 'Yes — for puppies 6 months and up, and seniors of any age. The Ayurvedic herb blend is intentionally gentle, and the liquid format is easier on senior digestion than capsules or powders.',
  },
  {
    q: 'How is GoodGut+ different from regular probiotics?',
    a: 'Most probiotics deliver bacteria but no food for them — they don’t survive long. GoodGut+ uses prebiotics + Ayurvedic carminatives + milk thistle, which build the gut environment those bacteria actually need to thrive.',
  },
  {
    q: 'Can I stop and restart?',
    a: 'Yes. The formula builds rather than depletes, so a missed day or a travel break won’t undo progress. Many parents go onto a 5-days-on / 2-days-off rhythm after the first month.',
  },
];

export function GoodGutFAQ() {
  return (
    <LandingSection tone="paper">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <SectionHeader
            eyebrow="Quick answers"
            title={<>What pet parents ask about the drops.</>}
          >
            <p className="mt-4 max-w-md text-[14px] leading-[1.65] text-ink-muted sm:text-[14.5px]">
              Still wondering? Email{' '}
              <a
                href="mailto:hello@theayurpet.store"
                className="text-brand underline decoration-saffron underline-offset-4 transition hover:text-brand-deep"
              >
                hello@theayurpet.store
              </a>{' '}
              — we read every one.
            </p>
          </SectionHeader>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="min-w-0">
          <ul className="divide-y divide-line border-y border-line">
            {ITEMS.map((it) => (
              <li key={it.q}>
                <details className="ayur-faq group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 text-left">
                    <span className="font-display text-[16px] leading-tight text-ink sm:text-[17px]">
                      {it.q}
                    </span>
                    <span
                      aria-hidden
                      className="ayur-faq__toggle mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1v14M1 8h14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="ayur-faq__body pb-5 pr-12 text-[13.5px] leading-[1.7] text-ink-muted sm:text-[14.5px]">
                    {it.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </LandingSection>
  );
}
