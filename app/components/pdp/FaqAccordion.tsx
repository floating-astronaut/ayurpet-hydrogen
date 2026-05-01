// Editorial FAQ accordion. Native <details>/<summary> for SSR-friendly,
// keyboard-accessible accordion behavior. Animation on open/close is CSS
// only (height transitions on the inner content). Honors prefers-reduced-
// motion via the global @media block in app.css.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Item = {q: string; a: string};

const DEFAULT_ITEMS: Item[] = [
  {
    q: 'How long does one chew last?',
    a: 'Most medium dogs work on a 6-hour chew across 2–3 sessions over a week. Heavy chewers may finish faster.',
  },
  {
    q: 'Is it safe for puppies and seniors?',
    a: 'Vets we work with clear it for puppies 6 months and up. Seniors love the joint support from turmeric and the gentleness on digestion.',
  },
  {
    q: 'My dog has allergies — what’s in this?',
    a: 'Single-source yak milk, organic Ashwagandha or turmeric, and Himalayan salt. Grain-free, soy-free, preservative-free.',
  },
  {
    q: 'How is this different from regular yak chews?',
    a: 'We age the cheese longer for harder texture and infuse Ayurvedic herbs at low temperatures so the active compounds survive.',
  },
  {
    q: 'How does Buy 1 · Help 1 work?',
    a: 'Every order funds a meal for a parentless dog through partner shelters across India. We post receipts monthly on Instagram.',
  },
  {
    q: 'Shipping & returns?',
    a: 'Free worldwide shipping over USD 60. 30-day no-questions return on unopened items. Email us if your dog disagrees with the chew — we’ll make it right.',
  },
];

export function FaqAccordion({items = DEFAULT_ITEMS}: {items?: Item[]}) {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            Quick answers
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Things pet parents ask first.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
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
            {items.map((it) => (
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
