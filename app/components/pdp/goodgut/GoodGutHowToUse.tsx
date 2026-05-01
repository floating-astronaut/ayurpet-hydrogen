// "How to use GoodGut+" — three-step daily ritual. Editorial timeline
// with dosage guidance + "what to expect" timeline below.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

const STEPS: Array<{n: string; title: string; body: string}> = [
  {
    n: '01',
    title: 'Add to food or water',
    body: 'Squeeze the dropper, count the drops based on weight, mix into your dog’s normal meal or water bowl. Takes 10 seconds.',
  },
  {
    n: '02',
    title: 'Once a day, every day',
    body: 'Best given with the morning meal so the formula works alongside the day’s food. Skipping a day is fine — it builds, not depletes.',
  },
  {
    n: '03',
    title: 'Visible comfort builds in',
    body: 'Most dogs show calmer digestion within the first 7–10 days. The 28-day mark is when stool, energy, and skin really turn around.',
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
    <section className="bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
            How to use it
          </p>
          <h2 className="mt-4 break-words font-display text-[1.85rem] leading-[1.05] tracking-tight text-ink sm:text-[2.4rem] lg:text-[3rem]">
            Built into a 30-second daily ritual.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-7 text-ink-soft sm:text-[15.5px] sm:leading-8">
            No mixing tools. No transitions from kibble. Just drop, stir,
            serve. Designed to be the easiest supplement you&rsquo;ve ever
            given a dog.
          </p>

          <ol className="ayur-timeline mt-9 border-t border-line">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="ayur-timeline-step grid grid-cols-[2.4rem_1fr] items-start gap-x-4 border-b border-line py-6 last:border-b-0"
              >
                <span className="block pl-2 font-display text-2xl leading-none text-saffron-deep">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-7 text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <ScrollReveal
          kind="rise-soft"
          className="min-w-0 rounded-[1.5rem] border border-line/70 bg-cream p-6 shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-8 lg:p-10"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-clay">
            Daily dosage
          </p>
          <h3 className="mt-3 font-display text-[1.5rem] leading-tight text-ink sm:text-[1.75rem]">
            Drops by body weight.
          </h3>

          <table className="mt-5 w-full table-auto border-separate border-spacing-y-1.5 text-left">
            <tbody>
              {DOSAGE.map((d) => (
                <tr key={d.weight} className="text-[14px]">
                  <th
                    scope="row"
                    className="rounded-l-xl bg-paper px-4 py-3 font-semibold text-ink sm:text-[15px]"
                  >
                    {d.weight}
                  </th>
                  <td className="rounded-r-xl bg-paper px-4 py-3 text-right font-display text-[1.1rem] text-brand sm:text-[1.2rem]">
                    {d.drops}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-5 text-[12.5px] leading-6 text-ink-muted">
            One bottle = ~30 days at the average daily dose. Safe for puppies
            6 months and up · seniors love the gentleness on their stomachs.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
