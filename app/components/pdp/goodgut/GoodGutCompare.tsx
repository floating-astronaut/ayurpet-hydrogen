// "Us vs. them" comparison block. Lifted from the Native Pet PDP
// pattern — a head-to-head side-by-side that reframes GoodGut+ against
// the typical "more capsules, more powder, more confusion" routine.
//
// Editorial-only block (no assets required). The brand-green left
// column carries the GoodGut+ row of green ✓ ticks, the muted right
// column carries the typical-routine row of clay ✗ marks. Mobile
// stacks to two cards; desktop runs them side-by-side with a thin
// vertical divider.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingSection, SectionHeader} from './primitives';

type Row = {claim: string; us: string; them: string};

const ROWS: Row[] = [
  {
    claim: 'Format',
    us: 'Single liquid dropper, mixes invisibly into food or water',
    them: 'Capsules, powders, multi-tub stacks',
  },
  {
    claim: 'Daily ritual',
    us: '10 seconds, once a day',
    them: '2–3 separate supplements at different meals',
  },
  {
    claim: 'Approach',
    us: 'Vet-formulated · Ayurvedic-led · root-cause focused',
    them: 'Single-symptom probiotics, no prebiotic backbone',
  },
  {
    claim: 'Sourcing',
    us: 'Wild-harvested herbs, hill-grown milk thistle, FDA-registered facility',
    them: 'Generic synthetic blends, opaque sourcing',
  },
  {
    claim: 'Taste battle',
    us: '92% of dogs took it without resistance',
    them: 'Pill-pocketing, cheese-wrapping, refusal',
  },
  {
    claim: 'Guarantee',
    us: '30-day money-back if no calmer digestion',
    them: 'No outcome promise, just a return label',
  },
];

export function GoodGutCompare() {
  return (
    <LandingSection tone="paper">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="Why one drop, not three jars"
          title={<>GoodGut+ vs. the typical multi-supplement routine.</>}
          body="Most digestive support stacks ask you to juggle a probiotic, a fibre powder, and an enzyme blend. We collapsed the routine into a single liquid dropper — so the dog actually takes it, every day."
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" className="mt-9 sm:mt-10">
        <div className="overflow-hidden rounded-3xl border border-line/70 bg-cream/60 shadow-[0_18px_60px_rgba(31,26,20,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-line/60">
            {/* US — GoodGut+ */}
            <div className="bg-paper p-6 sm:p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded-full bg-brand text-paper"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="font-display text-[1.2rem] leading-tight text-ink sm:text-[1.35rem]">
                  GoodGut+
                </p>
              </div>
              <ul className="mt-5 space-y-4">
                {ROWS.map((r) => (
                  <li key={r.claim}>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-brand">
                      {r.claim}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-soft sm:text-[14px] sm:leading-[1.65]">
                      {r.us}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* THEM — typical stack */}
            <div className="border-t border-line/60 bg-cream/80 p-6 sm:p-7 lg:border-t-0 lg:p-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded-full bg-clay/30 text-clay"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="font-display text-[1.2rem] leading-tight text-ink-muted sm:text-[1.35rem]">
                  The typical routine
                </p>
              </div>
              <ul className="mt-5 space-y-4">
                {ROWS.map((r) => (
                  <li key={r.claim}>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-clay/80">
                      {r.claim}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-muted sm:text-[14px] sm:leading-[1.65]">
                      {r.them}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </LandingSection>
  );
}
