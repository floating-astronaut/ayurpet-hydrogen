// Rich trust band — replaces the flat 4-column trust strip.
// Combines a count-up stat row (rating · review count · review tone · returns
// window) with iconographic dividers and a secondary copy line, animated in
// on scroll via ScrollReveal.
import {CountUpStat} from '~/components/motion/CountUpStat';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  caption?: string;
};

const DEFAULT_STATS: Stat[] = [
  {label: 'Average rating', value: 4.9, decimals: 1, caption: '★★★★★ verified buyers'},
  {label: 'Reviews', value: 9340, suffix: '+', caption: 'Across the AyurPet shelf'},
  {label: 'Hour chew', value: 6, suffix: '+', caption: 'Slow-aged Himalayan yak cheese'},
  {label: 'Day returns', value: 30, caption: 'No-questions, full refund'},
];

export function RichTrustBand({stats = DEFAULT_STATS}: {stats?: Stat[]}) {
  return (
    <section className="relative border-y border-line bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_15%_50%,rgba(45,90,61,0.08),transparent_42%),radial-gradient(circle_at_85%_50%,rgba(217,148,65,0.08),transparent_42%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <ScrollReveal kind="rise-soft" stagger>
          <ul className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-x-2">
            {stats.map((s, i) => (
              <li
                key={s.label}
                className={
                  'flex flex-col items-center text-center sm:items-start sm:text-left' +
                  (i < stats.length - 1
                    ? ' sm:border-r sm:border-line sm:pr-6'
                    : '') +
                  (i % 2 === 0 ? ' border-r border-line pr-4 sm:pr-6' : ' pl-4 sm:pl-6')
                }
              >
                <p className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-tight text-ink">
                  <CountUpStat
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
                  {s.label}
                </p>
                {s.caption ? (
                  <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">
                    {s.caption}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
