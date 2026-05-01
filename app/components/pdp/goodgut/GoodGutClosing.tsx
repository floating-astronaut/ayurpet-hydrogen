// Closing CTA for GoodGut+. Restates the symptom-led pitch + price
// anchor and bounces the visitor back to the purchase panel via the
// data-purchase-anchor scroll target.
import {Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

export function GoodGutClosing({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  return (
    <section className="ayur-band-ink relative overflow-hidden border-t border-line/40 px-5 py-14 text-paper sm:px-6 sm:py-18 lg:px-10 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_18%_30%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_82%_70%,#d99441_0%,transparent_50%)]"
      />
      <ScrollReveal
        kind="rise-soft"
        className="relative mx-auto flex max-w-5xl flex-col items-start gap-8 sm:items-center sm:text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-saffron-soft">
          Start the routine
        </p>
        <h2 className="break-words font-display text-[2rem] leading-[1.02] tracking-tight sm:text-[2.7rem] lg:text-[3.4rem]">
          Calmer digestion is 30 seconds and a few drops away.
        </h2>
        <p className="max-w-2xl text-[14.5px] leading-7 text-paper/80 sm:text-[15.5px] sm:leading-8">
          Skip the food-swap rabbit hole. Start your dog on GoodGut+ today —
          if the first 30 days don&rsquo;t show calmer digestion, we&rsquo;ll
          refund the bottle.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#purchase"
            onClick={(e) => {
              e.preventDefault();
              if (typeof document !== 'undefined') {
                const el = document.querySelector('[data-purchase-anchor]');
                el?.scrollIntoView({behavior: 'smooth', block: 'start'});
              }
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-ink shadow-[0_14px_30px_rgba(217,148,65,0.35)] transition hover:bg-saffron-soft sm:text-[13px]"
          >
            Add GoodGut+ to my routine
            {selectedVariant ? (
              <span aria-hidden className="ml-2 opacity-70">
                <Money as="span" data={selectedVariant.price} />
              </span>
            ) : null}
            <span aria-hidden>→</span>
          </a>
          <span className="text-[12px] uppercase tracking-[0.22em] text-paper/65">
            30-day money-back guarantee
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}
