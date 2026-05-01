// Trial results band — 81% / 76% / 74% / 92% in-home-study cards.
// Uses StatCard primitives so the cards stay aligned and padded.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';
import {LandingSection, SectionHeader, StatCard} from './primitives';

const STATS: Array<{value: number; suffix: string; label: string}> = [
  {value: 81, suffix: '%', label: 'had firmer, healthier stool'},
  {value: 76, suffix: '%', label: 'showed less gas & bloating'},
  {value: 74, suffix: '%', label: 'were more active & alert'},
  {value: 92, suffix: '%', label: 'loved the taste'},
];

export function TrialResults() {
  return (
    <LandingSection tone="cream" className="border-y border-line">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="Results you’ll notice"
          eyebrowTone="clay"
          align="center"
          title={<>81% of pets showed noticeable digestive improvement in 28 days.</>}
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <li key={s.label}>
              <StatCard
                value={<CountUpStat value={s.value} suffix={s.suffix} />}
                caption={s.label}
              />
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <p className="mt-6 text-center text-[11.5px] leading-[1.55] text-ink-muted">
        Based on a 2025 in-home trial of 50+ dogs and cats over 30 days.
      </p>
    </LandingSection>
  );
}
