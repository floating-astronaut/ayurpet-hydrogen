// "Featured In" press strip — type-only logos at low opacity, hover lifts them.
// Placeholder publications until real coverage is available; swap copy below
// when actual press is logged. Covers CRO Home Page row 15 / Product Page
// row 73.
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
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-10 lg:py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-ink-muted">
          As featured in
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {PRESS.map((title) => (
            <li
              key={title}
              className="font-display text-base leading-none tracking-[0.01em] text-ink/55 transition hover:text-ink sm:text-lg"
            >
              {title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
