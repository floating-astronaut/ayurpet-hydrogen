// Shared layout primitives for the GoodGut+ landing page.
//
// Audit feedback: across the page, cards used one-off padding values,
// eyebrows/headings/badges drifted out of alignment, and mobile cards
// felt randomly placed. These primitives enforce a single source of
// truth for:
//   - card chrome (rounded corner, border, shadow, padding)
//   - section headers (eyebrow → heading → optional body, vertical rhythm)
//   - chips/pills (proof chips for trust + symptom)
//   - stat cards (number + caption)
//   - review cards (rating row + symptom + body + author footer)
//
// Padding scale used everywhere on this page:
//   mobile    p-5  (20px)
//   sm/tablet p-6  (24px)
//   lg+       p-7  (28px)
// Sections use py-12 / sm:py-14 / lg:py-20 unless intentionally edge-to-edge.
// Inner gap rhythm:  mt-3 / mt-4 between header → body, mt-6 / mt-7 to CTA.
import {forwardRef, type ReactNode} from 'react';

// ---------------------------------------------------------------------------
// LandingCard — base card chrome.
// Use for any rectangular content container on this page so corner radius,
// border, shadow, padding, and background are consistent.
// ---------------------------------------------------------------------------
type LandingCardProps = {
  as?: 'div' | 'article' | 'li';
  tone?: 'paper' | 'cream' | 'ink';
  /** Render with no internal padding (image-led card). */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
};

export const LandingCard = forwardRef<HTMLDivElement, LandingCardProps>(
  function LandingCard({as: Tag = 'div', tone = 'paper', bleed = false, className = '', children}, ref) {
    const toneClass =
      tone === 'cream'
        ? 'bg-cream'
        : tone === 'ink'
          ? 'bg-ink text-paper'
          : 'bg-paper';
    const padding = bleed ? '' : 'p-5 sm:p-6 lg:p-7';
    const TagComponent = Tag as React.ElementType;
    return (
      <TagComponent
        ref={ref}
        className={`relative overflow-hidden rounded-[1.25rem] border border-line/70 ${toneClass} ${padding} shadow-[0_10px_30px_rgba(31,26,20,0.04)] ${className}`}
      >
        {children}
      </TagComponent>
    );
  },
);

// ---------------------------------------------------------------------------
// LandingSection — wraps a content section in consistent vertical rhythm
// (py-12 / sm:py-14 / lg:py-20) and max-width container with px-5 sm:px-6.
// ---------------------------------------------------------------------------
export function LandingSection({
  tone = 'paper',
  children,
  className = '',
  bleed = false,
}: {
  tone?: 'paper' | 'cream' | 'ink';
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === 'cream'
      ? 'bg-cream'
      : tone === 'ink'
        ? 'bg-ink text-paper'
        : 'bg-paper';
  const inner = bleed
    ? 'py-12 sm:py-14 lg:py-20'
    : 'mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-20';
  return (
    <section className={`${toneClass} ${className}`}>
      <div className={inner}>{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader — eyebrow + heading + optional body, with consistent
// vertical rhythm (mt-3 from eyebrow, mt-4 between heading and body).
// ---------------------------------------------------------------------------
export function SectionHeader({
  eyebrow,
  eyebrowTone = 'brand',
  title,
  body,
  align = 'left',
  className = '',
  children,
}: {
  eyebrow: string;
  eyebrowTone?: 'brand' | 'clay' | 'saffron';
  title: ReactNode;
  body?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const eyebrowColor =
    eyebrowTone === 'clay'
      ? 'text-clay'
      : eyebrowTone === 'saffron'
        ? 'text-saffron-deep'
        : 'text-brand';
  const alignment =
    align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.32em] ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h2 className="mt-3 break-words font-display text-[1.75rem] leading-[1.08] tracking-tight text-ink sm:text-[2.25rem] sm:leading-[1.05] lg:text-[2.85rem]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 max-w-xl text-[14px] leading-[1.55] text-ink-soft sm:text-[15px] sm:leading-[1.65]">
          {body}
        </p>
      ) : null}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProofChip — pill chip with optional inline icon. Used for trust marks,
// benefit chips, symptom badges. Maintains consistent height + baseline.
// ---------------------------------------------------------------------------
export function ProofChip({
  icon,
  children,
  tone = 'neutral',
  size = 'md',
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'clay';
  size?: 'sm' | 'md';
}) {
  const toneClass =
    tone === 'brand'
      ? 'border-brand/40 bg-brand/8 text-brand'
      : tone === 'clay'
        ? 'border-clay/40 bg-clay/10 text-clay'
        : 'border-line bg-paper/85 text-ink';
  const sizeClass =
    size === 'sm'
      ? 'px-2.5 py-1 text-[10.5px]'
      : 'px-3 py-2 text-[11.5px]';
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border ${sizeClass} ${toneClass} font-semibold leading-tight backdrop-blur`}
    >
      {icon ? (
        <span aria-hidden className="grid h-4 w-4 shrink-0 place-items-center text-current">
          {icon}
        </span>
      ) : null}
      <span className="leading-tight">{children}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// StatCard — big number + caption. Used for trial results, hero proof.
// ---------------------------------------------------------------------------
export function StatCard({
  value,
  caption,
  align = 'center',
}: {
  value: ReactNode;
  caption: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <LandingCard className={align === 'center' ? 'text-center' : ''}>
      <p className="font-display text-[clamp(2.2rem,5vw,3.25rem)] leading-none tracking-tight text-brand">
        {value}
      </p>
      <p className="mt-3 text-[12.5px] leading-[1.55] text-ink-soft">{caption}</p>
    </LandingCard>
  );
}

// ---------------------------------------------------------------------------
// MiniHeader — smaller section header for in-card use (cross-sell, etc).
// ---------------------------------------------------------------------------
export function MiniHeader({
  eyebrow,
  title,
  eyebrowTone = 'brand',
}: {
  eyebrow: string;
  title: ReactNode;
  eyebrowTone?: 'brand' | 'clay' | 'saffron';
}) {
  const eyebrowColor =
    eyebrowTone === 'clay'
      ? 'text-clay'
      : eyebrowTone === 'saffron'
        ? 'text-saffron-deep'
        : 'text-brand';
  return (
    <div>
      <p className={`text-[10.5px] font-bold uppercase tracking-[0.28em] ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-[1.25rem] leading-tight tracking-tight text-ink sm:text-[1.4rem]">
        {title}
      </h3>
    </div>
  );
}
