// "Two targeted formulas, one complete system" cross-sell band. Lifts
// the merchant artboard pitch into a real shoppable rail with a link
// to the joint-care companion product. LandingCard for chrome,
// MiniHeader for in-card eyebrow rhythm.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingSection, MiniHeader} from './primitives';

const COMPANION_HANDLE =
  'hip-o-joint-daily-ayurvedic-drops-with-glucosamine';

export function GoodGutCrossSell() {
  return (
    <LandingSection tone="paper">
      <ScrollReveal
        kind="rise-soft"
        className="overflow-hidden rounded-[1.5rem] border border-line bg-cream shadow-[0_18px_60px_rgba(31,26,20,0.06)] lg:flex lg:items-stretch"
      >
        <div className="p-6 sm:p-8 lg:flex-1 lg:p-10">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.32em] text-brand">
            Two targeted formulas
          </p>
          <h2 className="mt-3 break-words font-display text-[1.55rem] leading-[1.08] tracking-tight text-ink sm:text-[1.95rem] lg:text-[2.3rem]">
            One complete daily system.
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-[1.65] text-ink-soft sm:text-[14.5px] sm:leading-[1.7]">
            Pet parents on GoodGut+ for digestion often pair it with{' '}
            <strong className="text-ink">Hip-O-Joint+</strong> &mdash; our
            glucosamine + Ashwagandha + Shallaki drops for senior mobility.
            Same liquid format, same daily dropper, calmer stairs.
          </p>

          <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2 text-[12.5px] leading-[1.5] text-ink-soft sm:max-w-md">
            {[
              ['Glucosamine', 'cushions joints'],
              ['Shallaki', 'reduces inflammation'],
              ['Ashwagandha', 'easier mobility'],
              ['Guggul', 'long-term joint care'],
            ].map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-2">
                <span className="font-display text-[14px] leading-none text-brand">
                  ✓
                </span>
                <span>
                  <strong className="text-ink">{k}</strong> &mdash; {v}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to={`/products/${COMPANION_HANDLE}`}
            prefetch="intent"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.22em] text-paper transition hover:border-brand hover:bg-brand sm:px-6 sm:py-3 sm:text-[12px]"
          >
            Add Hip-O-Joint+ too
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Side-by-side compare card on desktop; collapses to a tidy
            2-col strip on mobile so the column heights match. */}
        <div className="relative grid grid-cols-2 divide-x divide-line/70 border-t border-line bg-paper lg:w-[44%] lg:border-l lg:border-t-0">
          {[
            {
              tag: 'Joint support',
              title: 'Hip-O-Joint+',
              bullets: ['Glucosamine', 'Shallaki', 'Ashwagandha', 'Guggul'],
              eyebrowTone: 'saffron' as const,
            },
            {
              tag: 'Digestive support',
              title: 'GoodGut+',
              bullets: ['Milk Thistle', 'Triphala', 'Fennel', 'Sweet Potato'],
              eyebrowTone: 'brand' as const,
            },
          ].map((c) => (
            <div key={c.title} className="flex flex-col p-5 sm:p-6">
              <MiniHeader
                eyebrow={c.tag}
                title={c.title}
                eyebrowTone={c.eyebrowTone}
              />
              <ul className="mt-3 space-y-1.5 text-[12.5px] leading-[1.55]">
                {c.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-baseline gap-1.5 text-ink-soft"
                  >
                    <span aria-hidden className="text-brand">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </LandingSection>
  );
}
