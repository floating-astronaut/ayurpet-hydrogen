// Digestive-drops specific FAQ. Native <details>/<summary> for SSR-
// friendly accordion. Tone is clinical-but-warm and matches the rest of
// the GoodGut+ page.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

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
    <section className="bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
            Quick answers
          </p>
          <h2 className="mt-4 break-words font-display text-[1.85rem] leading-[1.05] tracking-tight text-ink sm:text-[2.4rem] lg:text-[3rem]">
            What pet parents ask about the drops.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-7 text-ink-muted sm:text-[15px] sm:leading-8">
            Still wondering? Email{' '}
            <a
              href="mailto:hello@theayurpet.store"
              className="text-brand underline decoration-saffron underline-offset-4 transition hover:text-brand-deep"
            >
              hello@theayurpet.store
            </a>{' '}
            — we read every one.
          </p>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="min-w-0">
          <ul className="divide-y divide-line border-y border-line">
            {ITEMS.map((it) => (
              <li key={it.q}>
                <details className="ayur-faq group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
                    <span className="font-display text-lg leading-tight text-ink sm:text-xl">
                      {it.q}
                    </span>
                    <span
                      aria-hidden
                      className="ayur-faq__toggle mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition"
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
                  <div className="ayur-faq__body pb-5 pr-12 text-[14px] leading-7 text-ink-muted sm:text-[15px]">
                    {it.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
