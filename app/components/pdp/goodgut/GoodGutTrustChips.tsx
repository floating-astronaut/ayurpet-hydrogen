// Native HTML trust chips for the GoodGut+ hero.
//
// Audit gap: FDA / ISO / HACCP / GMP marks live ONLY inside merchant
// A+ artboards (≈70% scroll depth). Surfacing them as crawlable,
// above-the-fold native HTML chips closes the biggest authority gap
// without changing the visual brand language.
//
// Each chip pairs a short label with a tiny inline icon and renders
// without an external icon dependency.
type Chip = {
  label: string;
  caption: string;
  icon: 'shield' | 'beaker' | 'ribbon' | 'paw';
};

const CHIPS: Chip[] = [
  {label: 'FDA-registered', caption: 'manufacturing facility', icon: 'shield'},
  {label: 'ISO 22000', caption: 'food-safety certified', icon: 'beaker'},
  {label: 'HACCP', caption: 'audited supply chain', icon: 'ribbon'},
  {label: 'Vet-formulated', caption: 'reviewed in-house', icon: 'paw'},
];

function Icon({kind}: {kind: Chip['icon']}) {
  switch (kind) {
    case 'shield':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 1.5l5.5 1.5v4.3c0 3.4-2.4 6-5.5 7.2-3.1-1.2-5.5-3.8-5.5-7.2V3L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M5.5 8.2L7.2 10l3.3-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'beaker':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M6 1h4M6 1v5L2 13a1 1 0 0 0 .9 1.5h10.2A1 1 0 0 0 14 13L10 6V1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 9.8L4 14l2.5-1L8 14.5 9.5 13l2.5 1-1.5-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case 'paw':
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <ellipse cx="4.2" cy="4.6" rx="1.2" ry="1.6" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="11.8" cy="4.6" rx="1.2" ry="1.6" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="2.2" cy="8.4" rx="1.1" ry="1.4" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="13.8" cy="8.4" rx="1.1" ry="1.4" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 12.5c0-1.5 1.4-2.5 3-2.5s3 1 3 2.5c0 1.6-1.4 2-3 2s-3-.4-3-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function GoodGutTrustChips() {
  return (
    <ul
      aria-label="Quality and certifications"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5"
    >
      {CHIPS.map((c) => (
        <li
          key={c.label}
          className="group flex items-center gap-3 rounded-2xl border border-line/80 bg-paper/80 px-4 py-3.5 backdrop-blur transition hover:border-brand/40 hover:bg-paper sm:flex-col sm:items-start sm:gap-1.5 sm:px-4 sm:py-3.5"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand sm:h-9 sm:w-9">
            <Icon kind={c.icon} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11.5px] font-bold leading-tight text-ink sm:text-[12.5px]">
              {c.label}
            </span>
            <span className="block text-[10.5px] leading-tight text-ink-muted sm:text-[11px]">
              {c.caption}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
