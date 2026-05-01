// Closing CTA — symptom-led restate + variant-priced bounce-back to the
// in-page purchase anchor. Padding matches LandingSection's bleed band.
import {Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {daysFromTitle, pricePerDay} from './GoodGutVariantPicker';

export function GoodGutClosing({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const variantDays = daysFromTitle(selectedVariant?.title);
  const perDay =
    selectedVariant?.price?.amount && variantDays
      ? pricePerDay(selectedVariant.price.amount, variantDays)
      : null;

  return (
    <section className="ayur-band-ink relative overflow-hidden border-t border-line/40 px-5 py-14 text-paper sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_18%_30%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_82%_70%,#d99441_0%,transparent_50%)]"
      />
      <ScrollReveal
        kind="rise-soft"
        className="relative mx-auto flex max-w-3xl flex-col items-start gap-6 sm:items-center sm:text-center sm:gap-7"
      >
        <p className="text-[10.5px] font-bold uppercase tracking-[0.32em] text-saffron-soft">
          Start the routine
        </p>
        <h2 className="break-words font-display text-[1.85rem] leading-[1.05] tracking-tight sm:text-[2.4rem] lg:text-[3rem]">
          Calmer digestion is 30 seconds and a few drops away.
        </h2>
        <p className="max-w-2xl text-[14px] leading-[1.65] text-paper/80 sm:text-[15px]">
          Skip the food-swap rabbit hole. Start your dog on GoodGut+ today —
          if the first 30 days don&rsquo;t show calmer digestion, we&rsquo;ll
          refund the bottle.
        </p>

        {perDay !== null && variantDays ? (
          <p className="-mt-2 text-[12.5px] tracking-tight text-saffron-soft sm:text-[13px]">
            ${perDay.toFixed(2)} / day · {variantDays}-day supply
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#picker"
            onClick={(e) => {
              e.preventDefault();
              if (typeof document !== 'undefined') {
                const el = document.querySelector('[data-purchase-anchor]');
                el?.scrollIntoView({behavior: 'smooth', block: 'start'});
              }
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-saffron px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-ink shadow-[0_14px_30px_rgba(217,148,65,0.35)] transition hover:bg-saffron-soft sm:px-7 sm:py-3.5 sm:text-[12.5px]"
          >
            Add GoodGut+ to my routine
            {selectedVariant ? (
              <span aria-hidden className="ml-2 opacity-70">
                <Money as="span" data={selectedVariant.price} />
              </span>
            ) : null}
            <span aria-hidden>→</span>
          </a>
          <span className="text-[11px] uppercase tracking-[0.2em] text-paper/65 sm:text-[12px]">
            30-day money-back guarantee
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}
