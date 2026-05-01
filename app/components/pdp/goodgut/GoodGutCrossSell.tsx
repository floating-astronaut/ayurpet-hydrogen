// "Two targeted formulas, one complete system" cross-sell band.
//
// The merchant's own A+ artboard ("Hip-O-Joint+ vs GoodGut+") already
// pitches stacking the two formulas. This component lifts that pitch
// out of the artboard and turns it into a real shoppable rail with a
// link to the joint-care product, surfacing AOV upside the page was
// previously only suggesting visually.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

const COMPANION_HANDLE =
  'hip-o-joint-daily-ayurvedic-drops-with-glucosamine';

export function GoodGutCrossSell() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <ScrollReveal
          kind="rise-soft"
          className="overflow-hidden rounded-[1.5rem] border border-line bg-cream shadow-[0_18px_60px_rgba(31,26,20,0.06)] lg:flex lg:items-stretch"
        >
          {/* Left: editorial copy */}
          <div className="p-6 sm:p-9 lg:flex-1 lg:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
              Two targeted formulas
            </p>
            <h2 className="mt-3 break-words font-display text-[1.65rem] leading-[1.05] tracking-tight text-ink sm:text-[2rem] lg:text-[2.4rem]">
              One complete daily system.
            </h2>
            <p className="mt-4 max-w-md text-[14.5px] leading-7 text-ink-soft sm:text-[15px] sm:leading-8">
              Pet parents on GoodGut+ for digestion often pair it with{' '}
              <strong className="text-ink">Hip-O-Joint+</strong> — our
              glucosamine + Ashwagandha + Shallaki drops for senior mobility.
              Same liquid format, same daily dropper, calmer stairs.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2 text-[12.5px] text-ink-soft sm:max-w-md">
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
                    <strong className="text-ink">{k}</strong> — {v}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to={`/products/${COMPANION_HANDLE}`}
              prefetch="intent"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-paper transition hover:bg-brand hover:border-brand"
            >
              Add Hip-O-Joint+ too
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Right: side-by-side compare card */}
          <div className="relative grid grid-cols-2 divide-x divide-line/70 border-t border-line bg-paper lg:w-[44%] lg:border-l lg:border-t-0">
            {[
              {
                tag: 'Joint support',
                title: 'Hip-O-Joint+',
                bullets: ['Glucosamine', 'Shallaki', 'Ashwagandha', 'Guggul'],
                accent: 'text-saffron-deep',
              },
              {
                tag: 'Digestive support',
                title: 'GoodGut+',
                bullets: ['Milk Thistle', 'Triphala', 'Fennel', 'Sweet Potato'],
                accent: 'text-brand',
              },
            ].map((c) => (
              <div key={c.title} className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-muted">
                  {c.tag}
                </p>
                <p className={`mt-2 font-display text-[1.2rem] leading-tight text-ink sm:text-[1.35rem]`}>
                  {c.title}
                </p>
                <ul className={`mt-3 space-y-1.5 text-[12.5px] ${c.accent}`}>
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-1.5">
                      <span aria-hidden>✓</span>
                      <span className="text-ink-soft">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
