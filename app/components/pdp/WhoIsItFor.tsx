// Two-column "Made for / Not for". Builds trust by being honest about who
// the product helps — and who should look elsewhere. Per the CRO checklist
// (Product Page row 103).
const MADE_FOR = [
  'Pet parents who want a daily wellness ritual, not a one-off treat',
  'Adult dogs comfortable with chew time or daily supplement drops',
  'Households looking for clean, single-ingredient sourcing',
  'Owners of anxious, senior, or sensitive-stomach dogs',
];

const NOT_FOR = [
  'Puppies under 6 months without veterinary supervision',
  'Dogs with diagnosed dairy allergies (yak cheese chews only)',
  'Households shopping purely on lowest price',
  'Anyone replacing prescription veterinary care',
];

export function WhoIsItFor() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            Honest about fit
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Made for some dogs. Not for every dog.
          </h2>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12 lg:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
              Made for
            </p>
            <ul className="mt-5 space-y-4">
              {MADE_FOR.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[1.25rem_1fr] items-start gap-3 text-[15px] leading-7 text-ink"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mt-1.5 h-3.5 w-3.5 shrink-0 text-brand"
                    aria-hidden
                  >
                    <path
                      d="M3 10.5l4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-clay">
              Not for
            </p>
            <ul className="mt-5 space-y-4">
              {NOT_FOR.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[1.25rem_1fr] items-start gap-3 text-[15px] leading-7 text-ink-muted"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mt-1.5 h-3.5 w-3.5 shrink-0 text-clay"
                    aria-hidden
                  >
                    <path
                      d="M5 5l10 10M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
