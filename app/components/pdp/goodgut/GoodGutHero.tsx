// GoodGut+ landing hero — mobile-compressed, conversion-led.
//
// Audit: previous mobile hero was 2,811px because it bundled the
// trust strip, full bundle picker, payment-trust band, and thumb
// gallery into one giant section. This rebuild keeps ONLY the
// purchase decision inside the hero <section>:
//
//   ABOVE THE FOLD (mobile-390 ≤ ~1,300px):
//     1. Eyebrow ("Daily digestive support")
//     2. H1 — symptom-led, 3 lines max
//     3. ONE-line promise paragraph
//     4. Star rating + 4.9 + review count
//     5. Hero campaign image (4:5)
//     6. Single tight purchase card:
//          - selected size + price + save%
//          - tax/checkout microcopy
//          - bundle picker (per-day math)
//          - Add to cart (full visible text)
//          - one-line shipping reassurance
//
// Trust chips and PaymentTrust are pulled OUT of the hero and rendered
// as their own slim sections via the orchestrator. The thumb gallery
// is also extracted into a separate component used by the orchestrator.
//
// On desktop (lg+) the layout collapses to a 2-column split where the
// gallery sits left and the same purchase decision sits right — no
// duplicated content.
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import type {ProductForm} from '~/components/ProductForm';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {ShopPayExpress} from '~/components/ShopPayExpress';
import {ExpressCheckoutButton} from '~/components/ExpressCheckoutButton';
import {GoodGutVariantPicker} from './GoodGutVariantPicker';

type Props = {
  product: ProductFragment;
  productOptions: React.ComponentProps<typeof ProductForm>['productOptions'];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  galleryImages: StorefrontImage[];
};

export function GoodGutHero({
  productOptions,
  selectedVariant,
  galleryImages,
}: Props) {
  const compareAt = selectedVariant?.compareAtPrice;
  const showCompare =
    compareAt &&
    Number(compareAt.amount) > Number(selectedVariant?.price.amount);
  const heroImage = galleryImages[0] ?? null;

  const variantTitle =
    selectedVariant?.title &&
    selectedVariant.title.toLowerCase() !== 'default title'
      ? selectedVariant.title
      : 'Single bottle';
  const priceAmount = selectedVariant
    ? Number(selectedVariant.price.amount).toFixed(0)
    : '—';
  const compareAmount =
    showCompare && compareAt ? Number(compareAt.amount).toFixed(0) : null;
  const savePct =
    showCompare && compareAt
      ? Math.round(
          ((Number(compareAt.amount) -
            Number(selectedVariant!.price.amount)) /
            Number(compareAt.amount)) *
            100,
        )
      : null;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* Soft brand-clinical wash so the section reads as wellness */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#fdfaf2_0%,#f0ebde_55%,#e1dac5_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_18%_22%,rgba(74,140,94,0.16),transparent_38%),radial-gradient(circle_at_82%_28%,rgba(184,94,62,0.10),transparent_36%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-5 pt-9 pb-10 sm:px-6 sm:pt-12 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:pt-14 lg:pb-16">
        {/* Right column on desktop, top on mobile */}
        <div className="min-w-0 lg:order-2">
          <p className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.32em] text-brand">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            Daily digestive support
          </p>

          <h1 className="mt-4 break-words font-display text-[2.05rem] font-medium leading-[0.96] tracking-[-0.018em] text-ink sm:mt-5 sm:text-[2.85rem] lg:text-[3.4rem] xl:text-[3.9rem]">
            Your dog can&rsquo;t say{' '}
            <em className="not-italic text-brand [text-decoration:underline] [text-decoration-color:var(--color-saffron)] [text-decoration-thickness:3px] [text-underline-offset:6px]">
              my stomach hurts.
            </em>
          </h1>

          <p className="mt-4 max-w-xl text-[14.5px] leading-[1.6] text-ink-soft sm:text-[15.5px] sm:leading-[1.7]">
            Vet-formulated daily drops for gas, picky eating, and calmer
            stools. <strong className="text-ink">Liquid format</strong> for
            faster uptake — no powders, no pills.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted sm:gap-2.5">
            <span aria-hidden className="tracking-[0.18em] text-saffron-deep">
              ★★★★★
            </span>
            <span className="font-bold text-ink">4.9</span>
            <span aria-hidden className="text-ink-muted/60">·</span>
            <span>2,840+ verified reviews</span>
          </div>

          {/* MOBILE-ONLY hero image — sits between paragraph and purchase
              card so the first viewport stack reads:
              eyebrow → H1 → promise → stars → image → purchase. */}
          <div className="mt-6 lg:hidden">
            <HeroGalleryStage image={heroImage} priority />
          </div>

          {/* Single purchase card — same on mobile and desktop. The
              picker, price, ATC, and one-line shipping note all sit in
              one place so the user never has to scroll between price
              and decision. */}
          <div className="mt-5 lg:mt-7">
            <PurchaseCard
              variantTitle={variantTitle}
              priceAmount={priceAmount}
              compareAmount={compareAmount}
              savePct={savePct}
              selectedVariant={selectedVariant}
              productOptions={productOptions}
            />
          </div>
        </div>

        {/* Desktop-only gallery column. Mobile shows the image inline
            inside the text column above. */}
        <div className="hidden min-w-0 lg:order-1 lg:block">
          <ScrollReveal kind="rise-soft" className="lg:sticky lg:top-24">
            <HeroGalleryStage image={heroImage} priority />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// HERO IMAGE STAGE — campaign frame around the packshot.
// ---------------------------------------------------------------------------
function HeroGalleryStage({
  image,
  priority,
}: {
  image: StorefrontImage | null;
  priority?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#ebe0c9_0%,#dccfb3_55%,#c7b89a_100%)] p-2 shadow-[0_30px_90px_rgba(31,26,20,0.14)] sm:rounded-[1.85rem] sm:p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#fdfaf2_0%,#f0e6d0_100%)] sm:rounded-[1.7rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-12 top-8 h-44 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_70%)]"
        />
        {image ? (
          <Image
            data={image}
            aspectRatio="4/5"
            sizes="(min-width: 1024px) 48vw, 92vw"
            loading={priority ? 'eager' : undefined}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M6 1c1.5 2 3 4 3 6a3 3 0 0 1-6 0c0-2 1.5-4 3-6z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Liquid drops · daily
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PURCHASE CARD — single source of truth for hero purchase decision.
// Same chrome on mobile and desktop. Internal padding + radius +
// shadow match the rest of the page's LandingCard primitives.
// ---------------------------------------------------------------------------
function PurchaseCard({
  variantTitle,
  priceAmount,
  compareAmount,
  savePct,
  selectedVariant,
  productOptions,
}: {
  variantTitle: string;
  priceAmount: string;
  compareAmount: string | null;
  savePct: number | null;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  productOptions: React.ComponentProps<typeof ProductForm>['productOptions'];
}) {
  const {open} = useAside();
  return (
    <div
      data-purchase-anchor
      id="picker"
      className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_22px_60px_rgba(31,26,20,0.08)]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
            {variantTitle}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Liquid · once daily
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <span className="font-display text-[2.1rem] leading-[0.9] tracking-tight text-ink sm:text-[2.5rem]">
            ${priceAmount}
          </span>
          {compareAmount ? (
            <span className="text-[16px] text-ink-muted line-through">
              ${compareAmount}
            </span>
          ) : null}
          {savePct ? (
            <span className="rounded-full bg-clay/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-clay">
              Save {savePct}%
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[11.5px] text-ink-muted">
          Tax included · Calculated at checkout
        </p>

        <div className="mt-5">
          <GoodGutVariantPicker
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
        </div>

        <ExpressCheckoutButton
          selectedVariant={selectedVariant}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-paper transition hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy it now <span aria-hidden>→</span>
        </ExpressCheckoutButton>

        <ShopPayExpress selectedVariant={selectedVariant} />

        {/* If the picker doesn't render its own ATC for some reason, we
            still expose one at the card level. The picker DOES render
            an ATC, so this is intentionally only used as a tiny shipping
            reassurance line below the picker's own button. */}
        <p className="mt-4 inline-flex items-center gap-2 text-[11.5px] leading-snug text-ink-muted">
          <span
            aria-hidden
            className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M1.5 6h9M6 1.5c1.5 1.5 1.5 7.5 0 9M6 1.5c-1.5 1.5-1.5 7.5 0 9"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
          Free over USD 60 · 30-day returns · Ships worldwide (DDP)
        </p>
      </div>
    </div>
  );
}
