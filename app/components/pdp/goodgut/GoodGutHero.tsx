// GoodGut+ landing hero. Symptom-led headline left, product gallery right,
// purchase panel below the gallery on mobile / next to it on desktop.
//
// The hero is intentionally different from the yak-chew PDP:
// - clinical / wellness tone, less playful
// - benefit chips up top instead of buried as bullets
// - product photo + format chip ("Liquid drops · 30 days") communicate
//   format faster than text
// - copy frames the gut problem, not the brand
import {Money, Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import type {ProductForm} from '~/components/ProductForm';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {PaymentTrust} from '~/components/pdp/PaymentTrust';
import {GoodGutTrustChips} from './GoodGutTrustChips';
import {GoodGutVariantPicker} from './GoodGutVariantPicker';

type Props = {
  product: ProductFragment;
  productOptions: React.ComponentProps<typeof ProductForm>['productOptions'];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  galleryImages: StorefrontImage[];
};

const HERO_CHIPS = [
  'Fast-absorbing liquid',
  'Milk thistle + prebiotics',
  '6 Ayurvedic herbs',
  'Vegetarian, human-grade',
];

export function GoodGutHero({
  product,
  productOptions,
  selectedVariant,
  galleryImages,
}: Props) {
  const compareAt = selectedVariant?.compareAtPrice;
  const showCompare =
    compareAt &&
    Number(compareAt.amount) > Number(selectedVariant?.price.amount);

  // Use packshot first; fall back to first gallery image.
  const heroImage = galleryImages[0] ?? null;
  const secondaryImage = galleryImages[1] ?? null;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* Soft brand-clinical wash so the section feels like wellness, not retail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#fdfaf2_0%,#f0ebde_55%,#e1dac5_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_18%_22%,rgba(74,140,94,0.18),transparent_38%),radial-gradient(circle_at_82%_28%,rgba(184,94,62,0.10),transparent_36%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:py-16">
        {/* LEFT — campaign visual */}
        <div className="min-w-0 lg:order-2">
          <ScrollReveal
            kind="rise-soft"
            className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#ebe0c9_0%,#dccfb3_55%,#c7b89a_100%)] p-2 shadow-[0_30px_90px_rgba(31,26,20,0.14)] sm:rounded-[2rem] sm:p-3"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#fdfaf2_0%,#f0e6d0_100%)] sm:rounded-[1.85rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-12 top-8 h-44 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_70%)]"
              />
              {heroImage ? (
                <Image
                  data={heroImage}
                  aspectRatio="4/5"
                  sizes="(min-width:1024px) 48vw, 92vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              {/* Format chip top-left */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M6 1c1.5 2 3 4 3 6a3 3 0 0 1-6 0c0-2 1.5-4 3-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                Liquid drops · daily
              </div>
            </div>
          </ScrollReveal>

          {/* Tiny secondary thumb row — 3 chips that read as honest product
              context, not a Shopify gallery dump. */}
          {secondaryImage ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[secondaryImage, galleryImages[2], galleryImages[3]]
                .filter(Boolean)
                .slice(0, 3)
                .map((img, i) => (
                  <div
                    key={(img as StorefrontImage).id ?? i}
                    className="overflow-hidden rounded-xl bg-cream ring-1 ring-line/60"
                  >
                    <Image
                      data={img as StorefrontImage}
                      aspectRatio="1/1"
                      sizes="160px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>
          ) : null}
        </div>

        {/* RIGHT — copy + purchase */}
        <div className="min-w-0 lg:order-1">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-brand">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            Daily digestive support
          </p>

          {/* Symptom-led headline */}
          <h1 className="mt-5 break-words font-display text-[2.25rem] font-medium leading-[0.95] tracking-[-0.018em] text-ink sm:text-[3.2rem] lg:text-[3.9rem] xl:text-[4.4rem]">
            Your dog can&rsquo;t say{' '}
            <em className="not-italic text-brand [text-decoration:underline] [text-decoration-color:var(--color-saffron)] [text-decoration-thickness:3px] [text-underline-offset:6px]">
              my stomach hurts.
            </em>
          </h1>

          <p className="mt-6 max-w-xl break-words text-[14.5px] leading-7 text-ink-soft sm:text-[16px] sm:leading-8">
            So they show it &mdash; itching, licking, tear stains, gas, picky
            eating. <strong className="text-ink">GoodGut+</strong> supports
            gut balance at the source for calmer digestion and everyday
            comfort you can see.
          </p>

          {/* Benefit chips — communicate format & ingredients before scrolling */}
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:max-w-xl">
            {HERO_CHIPS.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper/90 px-3 py-2 text-[11.5px] font-semibold leading-snug text-ink"
              >
                <span
                  aria-hidden
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {c}
              </li>
            ))}
          </ul>

          {/* Native trust chips — FDA-registered facility / ISO 22000 /
              HACCP / Vet-formulated. Lifted out of the merchant artboards
              so they crawl + read above the fold. */}
          <div className="mt-5 sm:max-w-xl">
            <GoodGutTrustChips />
          </div>

          {/* Rating row */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[13px] text-ink-muted sm:gap-3 sm:text-sm">
            <span aria-hidden className="tracking-[0.18em] text-saffron-deep">
              ★★★★★
            </span>
            <span className="font-bold text-ink">4.9</span>
            <span aria-hidden className="text-ink-muted/60">·</span>
            <span>Trial: 81% saw firmer, healthier stool in 28 days</span>
          </div>

          {/* Purchase panel */}
          <div
            data-purchase-anchor
            className="mt-7 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_22px_60px_rgba(31,26,20,0.08)]"
          >
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
                  {selectedVariant?.title &&
                  selectedVariant.title.toLowerCase() !== 'default title'
                    ? selectedVariant.title
                    : 'Single bottle'}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {selectedVariant?.title?.toLowerCase().includes('day')
                    ? 'Liquid drops · once daily'
                    : 'Liquid drops'}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                {selectedVariant ? (
                  <Money
                    as="span"
                    data={selectedVariant.price}
                    className="font-display text-[2.25rem] leading-[0.9] tracking-tight text-ink sm:text-[2.75rem]"
                  />
                ) : null}
                {showCompare && compareAt ? (
                  <>
                    <Money
                      as="span"
                      data={compareAt}
                      className="text-lg text-ink-muted line-through"
                    />
                    <span className="rounded-full bg-clay/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-clay">
                      Save{' '}
                      {Math.round(
                        ((Number(compareAt.amount) -
                          Number(selectedVariant!.price.amount)) /
                          Number(compareAt.amount)) *
                          100,
                      )}
                      %
                    </span>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-[11.5px] text-ink-muted">
                Tax included · Calculated at checkout
              </p>

              <div className="mt-5 sm:mt-6">
                <GoodGutVariantPicker
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </div>

              {/* Global storefront shipping line — DDP customs +
                  Made in India provenance, surfaced near the CTA where
                  cross-border buyers actually need it. */}
              <p className="mt-4 inline-flex items-center gap-2 text-[11.5px] leading-snug text-ink-muted">
                <span
                  aria-hidden
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M1.5 6h9M6 1.5c1.5 1.5 1.5 7.5 0 9M6 1.5c-1.5 1.5-1.5 7.5 0 9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
                Crafted in India · Ships worldwide · Duties calculated at
                checkout (DDP)
              </p>
            </div>

            <ul className="grid grid-cols-3 divide-x divide-line border-t border-line bg-cream/40 text-center">
              {[
                ['🚚', 'Free over USD 60', 'Tracked global shipping'],
                ['🔒', 'Secure checkout', 'PCI-compliant Shopify'],
                ['↩', '30-day returns', 'Unopened bottles'],
              ].map(([emoji, title, sub]) => (
                <li key={title} className="px-2 py-3 sm:px-3">
                  <span aria-hidden className="block text-base sm:text-lg">
                    {emoji}
                  </span>
                  <p className="mt-1 text-[11px] font-bold leading-tight text-ink">
                    {title}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] leading-tight text-ink-muted sm:block">
                    {sub}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-line p-5 sm:p-6">
              <PaymentTrust />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
