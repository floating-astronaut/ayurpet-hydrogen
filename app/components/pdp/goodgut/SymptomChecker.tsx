// Symptom-led self-diagnosis card grid. Uses LandingCard + SectionHeader
// primitives so padding, eyebrow rhythm, and card chrome match every
// other GoodGut section.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

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
    <LandingSection tone="cream">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="Could it be gut imbalance?"
          eyebrowTone="clay"
          title={
            <>If you&rsquo;ve seen any of these, your dog is probably trying to tell you something.</>
          }
          body="Gut imbalance shows up everywhere except the gut. GoodGut+ is built to address the root, not the surface."
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SYMPTOMS.map((s, i) => (
            <LandingCard
              as="li"
              key={s.label}
              className="group flex h-full items-start gap-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_22px_52px_rgba(31,26,20,0.10)]"
            >
              <span
                aria-hidden
                className="absolute right-6 top-6 font-display text-[11px] tracking-[0.32em] text-ink-muted/55 sm:text-[11.5px]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-xl ring-1 ring-line/60 transition group-hover:bg-brand/10 group-hover:ring-brand/30 sm:h-12 sm:w-12"
              >
                {s.emoji}
              </span>
              <div className="min-w-0 pr-9">
                <p className="font-display text-[16px] leading-tight text-ink sm:text-[17.5px]">
                  {s.label}
                </p>
                <p
                  className="mt-2 text-[13px] leading-[1.6] text-ink-soft sm:text-[13.5px]"
                  dangerouslySetInnerHTML={{__html: s.body}}
                />
              </div>
            </LandingCard>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal kind="fade" className="mt-8 sm:mt-10">
        <LandingCard className="text-center">
          <p className="text-[13px] leading-[1.6] text-ink-soft sm:text-[14px]">
            <strong className="text-ink">Two or more boxes ticked?</strong>{' '}
            That&rsquo;s typically the dog parent we built GoodGut+ for.
          </p>
        </LandingCard>
      </ScrollReveal>
    </LandingSection>
  );
}
