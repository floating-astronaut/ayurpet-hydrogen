// Quiet press strip — type-only logos at low opacity. Visually it's a
// transition between the hero and the dark trust band, so we keep
// padding tight and add a hairline divider so it doesn't feel like a
// floating empty section.
const PRESS = [
  'Vogue India',
  'YourStory',
  'The Hindu',
  'Mint Lounge',
  'Forbes India',
  'Conde Nast Traveller',
];

export function FeaturedIn() {
  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
        <div className="flex flex-col items-center gap-x-10 gap-y-3 text-center sm:flex-row sm:flex-wrap sm:justify-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-ink-muted">
            <span aria-hidden className="h-px w-6 bg-line" />
            As featured in
            <span aria-hidden className="h-px w-6 bg-line" />
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 sm:gap-x-9">
            {PRESS.map((title) => (
              <li
                key={title}
                className="font-display text-[15px] leading-none tracking-[0.01em] text-ink/55 transition hover:text-ink sm:text-[17px]"
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
