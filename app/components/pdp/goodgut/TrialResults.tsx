// Trial results band — the 81% / 76% / 74% / 92% stats from the
// in-home study. Sourced verbatim from the brand's A+ artboard, but
// rendered as native cards so the numbers read as data, not as a flat
// pasted image.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';

const STATS: Array<{value: number; suffix: string; label: string}> = [
  {value: 81, suffix: '%', label: 'had firmer, healthier stool'},
  {value: 76, suffix: '%', label: 'showed less gas & bloating'},
  {value: 74, suffix: '%', label: 'were more active & alert'},
  {value: 92, suffix: '%', label: 'loved the taste'},
];

export function TrialResults() {
  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <ScrollReveal kind="rise-soft" className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-clay">
            Results you&rsquo;ll notice
          </p>
          <h2 className="mt-3 break-words font-display text-[1.6rem] leading-[1.1] tracking-tight text-ink sm:text-[2rem] lg:text-[2.4rem]">
            81% of pets showed noticeable digestive improvement in 28 days.
          </h2>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-9">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <li
                key={s.label}
                className="rounded-2xl border border-line/70 bg-paper p-5 text-center shadow-[0_10px_30px_rgba(31,26,20,0.04)] sm:p-6"
              >
                <p className="font-display text-[clamp(2.4rem,5vw,3.5rem)] leading-none text-brand">
                  <CountUpStat value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[12.5px] leading-5 text-ink-soft sm:text-[13px]">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <p className="mt-6 text-center text-[11.5px] leading-5 text-ink-muted">
          Based on a 2025 in-home trial of 50+ dogs and cats over 30 days.
        </p>
      </div>
    </section>
  );
}
