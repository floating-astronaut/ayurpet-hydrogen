// Multi-row brand marquee. Each row scrolls at its own speed and direction,
// with mixed font weights and opacities, layered for an editorial feel.
// Pure CSS @keyframes — no JS, no jank.
type Row = {
  text: string;
  speed?: number; // seconds for one full cycle
  reverse?: boolean;
  weight?: 'display' | 'sans';
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
};

const DEFAULT_ROWS: Row[] = [
  {text: 'Vet-approved · Lab-tested · Himalayan-sourced · Buy 1 · Help 1', speed: 38, weight: 'display', size: 'md', opacity: 0.85},
  {text: 'No nasties · Single-ingredient · Same-day dispatch · 30-day returns', speed: 28, reverse: true, weight: 'sans', size: 'sm', opacity: 0.55},
];

export function MultiRowMarquee({
  rows = DEFAULT_ROWS,
  className = '',
}: {
  rows?: Row[];
  className?: string;
}) {
  return (
    <div className={`ayur-multi-marquee ${className}`}>
      {rows.map((r) => (
        <Lane
          key={`${r.text}-${r.speed ?? 32}-${r.reverse ?? false}`}
          text={r.text}
          speed={r.speed ?? 32}
          reverse={r.reverse ?? false}
          weight={r.weight ?? 'display'}
          size={r.size ?? 'md'}
          opacity={r.opacity ?? 0.85}
        />
      ))}
      <style>{`
        @keyframes ayur-marquee-l { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @keyframes ayur-marquee-r { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
        @media (prefers-reduced-motion: reduce) {
          .ayur-multi-marquee .ayur-multi-marquee__track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function Lane({
  text,
  speed,
  reverse,
  weight,
  size,
  opacity,
}: Required<Row>) {
  const sizeClass =
    size === 'lg'
      ? 'text-2xl sm:text-4xl lg:text-5xl'
      : size === 'md'
        ? 'text-lg sm:text-2xl lg:text-3xl'
        : 'text-[11px] sm:text-xs lg:text-[13px]';
  const weightClass =
    weight === 'display'
      ? 'font-display tracking-tight'
      : 'font-sans uppercase tracking-[0.18em]';

  return (
    <div className="ayur-multi-marquee__lane overflow-hidden whitespace-nowrap">
      <div
        className={`ayur-multi-marquee__track flex shrink-0 gap-12 ${weightClass} ${sizeClass} text-ink will-change-transform`}
        style={{
          opacity,
          animationName: reverse ? 'ayur-marquee-r' : 'ayur-marquee-l',
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          width: 'max-content',
        }}
      >
        {(['a', 'b'] as const).map((copy) => (
          <span key={copy} className="flex shrink-0 items-center gap-12 px-6">
            {text.split('·').map((chunk) => {
              const trimmed = chunk.trim();
              return (
                <span
                  key={`${copy}-${trimmed}`}
                  className="inline-flex items-center gap-12"
                >
                  <span>{trimmed}</span>
                  <span aria-hidden className="text-saffron">
                    ·
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
