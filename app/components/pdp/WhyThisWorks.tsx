// Editorial ingredient → benefit mapping. Sits between the trust band and
// the timeline as the "why this works" answer to the buyer's biggest
// question. Each card is one ingredient: short Latin name, one-line "what
// it does for the dog", and a small structural facet (Origin / Form / Dose).
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Ingredient = {
  name: string;
  latin?: string;
  benefit: string;
  body: string;
  origin: string;
  form: string;
  emoji: string;
};

const DEFAULT_INGREDIENTS: Ingredient[] = [
  {
    name: 'Ashwagandha',
    latin: 'Withania somnifera',
    benefit: 'Calms the nervous system',
    body: 'A traditional Ayurvedic adaptogen that downshifts the cortisol response — without sedation. Helps with storms, vet visits, separation anxiety.',
    origin: 'Organic, Indian-grown',
    form: 'Slow-infused into yak cheese',
    emoji: '🌿',
  },
  {
    name: 'Turmeric',
    latin: 'Curcuma longa',
    benefit: 'Anti-inflammatory for joints + skin',
    body: "Curcumin's anti-inflammatory profile is a quiet hero for senior joints and skin. Paired with black pepper for absorption.",
    origin: 'Hand-picked, sun-dried',
    form: 'Co-aged with the cheese',
    emoji: '✨',
  },
  {
    name: 'Himalayan Yak Milk',
    latin: 'Bos grunniens',
    benefit: 'Single-ingredient long chew',
    body: 'Slow-aged yak cheese from 4,000m altitudes — high-protein, lactose-light, hours of chew time. Sustainably sourced from Himalayan yak herders.',
    origin: 'Nepal · 4,000m+',
    form: 'Hard-pressed yak cheese',
    emoji: '🏔',
  },
];

export function WhyThisWorks({
  ingredients = DEFAULT_INGREDIENTS,
}: {
  ingredients?: Ingredient[];
}) {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            Why this works
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Three ingredients. Centuries of evidence.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
            Every formula maps a single Ayurvedic active to a measurable outcome.
            No proprietary blends, no twelve-syllable mystery powders.
          </p>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-12">
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {ingredients.map((ing) => (
              <article
                key={ing.name}
                className="ayur-card-frame relative flex flex-col overflow-hidden rounded-[1.25rem] p-6 transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(31,26,20,0.10)] sm:p-7"
              >
                <span
                  aria-hidden
                  className="grid h-12 w-12 place-items-center rounded-full bg-paper text-2xl shadow-[0_6px_18px_rgba(31,26,20,0.08)]"
                >
                  {ing.emoji}
                </span>
                <h3 className="mt-5 font-display text-2xl leading-tight text-ink sm:text-[1.625rem]">
                  {ing.name}
                </h3>
                {ing.latin ? (
                  <p className="mt-1 font-display italic text-sm text-ink-muted">
                    {ing.latin}
                  </p>
                ) : null}
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                  {ing.benefit}
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{ing.body}</p>
                <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-[12px]">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Origin
                    </dt>
                    <dd className="mt-1 font-medium text-ink">{ing.origin}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Form
                    </dt>
                    <dd className="mt-1 font-medium text-ink">{ing.form}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
