// Final closing CTA. Full-bleed image-left / copy-right card on a deep
// brand band, with a clear primary action (scroll to purchase panel) and
// a soft secondary trust line. Sits at the very bottom of the PDP, above
// the StickyAtc.
import {useEffect, useState} from 'react';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Props = {
  productTitle: string;
  /** Real Storefront image URL or a fallback hero image URL. */
  imageUrl: string;
  /** Optional override for the headline. */
  headline?: string;
};

export function ClosingCta({productTitle, imageUrl, headline}: Props) {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(typeof window !== 'undefined' && typeof window.scrollTo === 'function');
  }, []);

  const scrollToPurchase = () => {
    if (!supported) return;
    const target =
      document.querySelector<HTMLElement>('[data-purchase-anchor]') ??
      document.querySelector<HTMLElement>('main');
    target?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#2a1110_0%,#1a3a26_60%,#2d5a3d_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.10] [background-image:linear-gradient(#fdfaf2_1px,transparent_1px),linear-gradient(90deg,#fdfaf2_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 text-paper sm:px-6 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise" className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          {/* Image card */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:rounded-[2rem]">
            <div className="relative aspect-[5/6]">
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(42,17,16,0.55))]"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-saffron-soft">
                  Featured today
                </p>
                <p className="mt-2 max-w-[24ch] font-display text-2xl leading-[1.1] sm:text-3xl">
                  {productTitle.replace(/\s*\|\s*/g, ' — ')}
                </p>
              </div>
            </div>
          </div>

          {/* Copy column */}
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-saffron-soft">
              Start the routine
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[4rem]">
              {headline ?? 'A calmer dog is one chew away.'}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-paper/75 sm:text-base sm:leading-8">
              Pick the size, add to cart, keep checkout native to Shopify.
              Same-day dispatch on weekday orders before 14:00 IST. 30-day
              returns if the routine isn’t a fit.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToPurchase}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-saffron px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-saffron-soft sm:text-sm"
              >
                Add to my routine
                <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href="/collections/all"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-paper/25 bg-transparent px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-paper/8 sm:text-sm"
              >
                See the full range
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-paper/65">
              <li>🔒 Secure Shopify checkout</li>
              <li>↩ 30-day returns</li>
              <li>⏱ Same-day dispatch</li>
              <li>🐾 Buy 1 · Help 1</li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
