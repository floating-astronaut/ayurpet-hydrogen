// "Does your dog need GoodGut+?" — symptom checker strip. Editorial cards
// of common gut-imbalance symptoms, framed as a self-diagnostic so the
// visitor connects the product to their own dog quickly.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Symptom = {
  emoji: string;
  label: string;
  body: string;
};

const SYMPTOMS: Symptom[] = [
  {
    emoji: '🌫️',
    label: 'Gas & bloating',
    body: 'Belly rumble, sudden room-clearing wind, post-meal restlessness.',
  },
  {
    emoji: '👅',
    label: 'Paw licking · scratching',
    body: 'Itchy paws, ear flicks, tear stains — gut inflammation often shows on the skin first.',
  },
  {
    emoji: '🥣',
    label: 'Low or fussy appetite',
    body: 'Skips meals, sniffs and walks away, only eats when food is hand-fed.',
  },
  {
    emoji: '💩',
    label: 'Inconsistent stool',
    body: 'Loose one day, dry the next. Tummy that can&rsquo;t hold a routine.',
  },
  {
    emoji: '😮‍💨',
    label: 'Bad breath',
    body: 'Sour or metallic breath that doesn&rsquo;t go away with brushing.',
  },
  {
    emoji: '🌿',
    label: 'Seasonal allergy signals',
    body: 'Sneezing, scratching, eye gunk that flares with weather changes.',
  },
];

export function SymptomChecker() {
  return (
    <section className="relative bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-clay">
            Could it be gut imbalance?
          </p>
          <h2 className="mt-4 break-words font-display text-[1.85rem] leading-[1.05] tracking-tight text-ink sm:text-[2.4rem] lg:text-[3rem]">
            If you&rsquo;ve seen any of these, your dog is probably trying to tell you something.
          </h2>
          <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-ink-soft sm:text-[15.5px] sm:leading-8">
            Gut imbalance shows up everywhere except the gut. GoodGut+ is built
            to address the root, not the surface.
          </p>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-10">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {SYMPTOMS.map((s, i) => (
              <li
                key={s.label}
                className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-line/70 bg-paper p-5 shadow-[0_10px_30px_rgba(31,26,20,0.04)] transition-all duration-500 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_22px_52px_rgba(31,26,20,0.10)] sm:p-6"
              >
                {/* Quiet brand wash on hover so the card has a sense of action */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-12 h-12 bg-gradient-to-t from-brand/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Counter chip — small editorial signal that the strip is a checklist */}
                <span
                  aria-hidden
                  className="absolute right-4 top-4 text-[10px] font-bold uppercase tracking-[0.22em] text-ink-muted/70"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-xl ring-1 ring-line/60 transition group-hover:bg-brand/10 group-hover:ring-brand/30 sm:h-12 sm:w-12"
                >
                  {s.emoji}
                </span>
                <div className="min-w-0 pr-6">
                  <p className="font-display text-[16px] leading-tight text-ink sm:text-[17.5px]">
                    {s.label}
                  </p>
                  <p
                    className="mt-1.5 text-[13px] leading-6 text-ink-soft"
                    dangerouslySetInnerHTML={{__html: s.body}}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal kind="fade" className="mt-10">
          <p className="rounded-2xl border border-line bg-paper p-4 text-center text-[13px] leading-6 text-ink-soft shadow-[0_10px_30px_rgba(31,26,20,0.04)] sm:p-5 sm:text-[14px]">
            <strong className="text-ink">Two or more boxes ticked?</strong>{' '}
            That&rsquo;s typically the dog parent we built GoodGut+ for.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
