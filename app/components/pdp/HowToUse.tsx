// Three-step explainer. Editorial restraint: numbers as serif type, no
// decorative cards. Matches the "Choose by outcome" rhythm on the homepage.
const STEPS = [
  {
    n: '01',
    title: 'Open the pouch',
    body: 'Resealable, smell-locked pouch. Single-ingredient yak chew or Ayurvedic supplement, ready to serve.',
  },
  {
    n: '02',
    title: 'Offer once a day',
    body: 'For chews, hand-feed or place on a clean mat. For drops, mix into food or water. Two to three sessions per week is a typical rhythm.',
  },
  {
    n: '03',
    title: 'Watch the routine',
    body: 'Most pet parents see calmer evenings, firmer stools, or quieter chew time within two weeks. Pause anytime; resume on the dog’s pace.',
  },
];

export function HowToUse() {
  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-10 lg:py-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            How to use
          </p>
          <h2
            className="mt-4 font-display leading-[0.96] text-ink"
            style={{
              fontSize: 'clamp(1.85rem, 3.6vw, 3.25rem)',
              letterSpacing: '-0.012em',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            Three steps. Two to three weeks to a real change.
          </h2>
        </div>

        <ol className="divide-y divide-line border-t border-line">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[3rem_1fr] items-start gap-x-5 gap-y-1.5 py-6"
            >
              <span className="font-display text-2xl leading-none text-saffron-deep">
                {s.n}
              </span>
              <h3 className="font-display text-xl text-ink sm:text-2xl">
                {s.title}
              </h3>
              <span aria-hidden />
              <p className="text-sm leading-7 text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
