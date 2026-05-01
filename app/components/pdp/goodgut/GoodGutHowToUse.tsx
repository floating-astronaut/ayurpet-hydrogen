// "How to use GoodGut+" — three-step daily ritual + dosage table.
// LandingCard wraps the dosage panel so it sits flush with the rest of
// the page's card grammar.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

const STEPS: Array<{n: string; title: string; body: string}> = [
  {
    n: '01',
    title: 'Add to food or water',
    body: 'Squeeze the dropper, count drops based on weight, mix into your dog’s normal meal or water bowl. Takes 10 seconds.',
  },
  {
    n: '02',
    title: 'Once a day, every day',
    body: 'Best given with the morning meal so the formula works alongside the day’s food. Skipping a day is fine — it builds, not depletes.',
  },
  {
    n: '03',
    title: 'Visible comfort builds in',
    body: 'Most dogs show calmer digestion within 7–10 days. The 28-day mark is when stool, energy, and skin really turn around.',
  },
];

const DOSAGE: Array<{weight: string; drops: string}> = [
  {weight: 'Under 5 kg', drops: '5 drops'},
  {weight: '5 – 15 kg', drops: '10 drops'},
  {weight: '15 – 30 kg', drops: '15 drops'},
  {weight: '30 kg +', drops: '20 drops'},
];

export function GoodGutHowToUse() {
  return (
    <LandingSection tone="paper">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <SectionHeader
            eyebrow="How to use it"
            title={<>Built into a 30-second daily ritual.</>}
            body="No mixing tools. No food transitions. Just drop, stir, serve. Designed to be the easiest supplement you’ve ever given a dog."
          />

          <ol className="ayur-timeline mt-8 border-t border-line">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="ayur-timeline-step grid grid-cols-[2.4rem_1fr] items-start gap-x-4 border-b border-line py-5 last:border-b-0"
              >
                <span className="block pl-2 font-display text-[1.4rem] leading-none text-saffron-deep">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" className="min-w-0">
          <LandingCard tone="cream" className="h-full">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-clay">
              Daily dosage
            </p>
            <h3 className="mt-2 font-display text-[1.35rem] leading-tight text-ink sm:text-[1.5rem]">
              Drops by body weight.
            </h3>

            <table className="mt-5 w-full table-auto border-separate border-spacing-y-1.5 text-left">
              <tbody>
                {DOSAGE.map((d) => (
                  <tr key={d.weight} className="text-[13.5px] sm:text-[14px]">
                    <th
                      scope="row"
                      className="rounded-l-xl bg-paper px-4 py-3 font-semibold text-ink"
                    >
                      {d.weight}
                    </th>
                    <td className="rounded-r-xl bg-paper px-4 py-3 text-right font-display text-[1.05rem] text-brand sm:text-[1.15rem]">
                      {d.drops}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 text-[12px] leading-[1.6] text-ink-muted">
              One bottle = ~30 days at the average daily dose. Safe for puppies
              6 months and up · seniors love the gentleness on their stomachs.
            </p>
          </LandingCard>
        </ScrollReveal>
      </div>
    </LandingSection>
  );
}
