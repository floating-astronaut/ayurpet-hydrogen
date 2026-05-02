// Design lab — blank canvas page for iterative design exploration.
// Content added step by step under direction. Inherits the standard
// PageLayout (header, footer, cart drawer, StickyAtc helpers) so the
// canvas renders inside the real storefront chrome.
//
// Reach it at /preview while developing. Not linked from any
// navigation — discoverable only by direct URL.
//
// STEP 1: blank <main> in brand tokens.
// STEP 2: all GoodGut+ product images, edge-to-edge full-frame on
//         mobile, two-up on desktop.
// STEP 3: smooth Native Pet-style hero on top — eyebrow, big title,
//         stars + reviews, trust pills, value prop, then the bundle-
//         aware variant picker with the Subscribe & save block, then
//         the image grid below.
import {
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/preview';
import {PRODUCT_QUERY} from './products.$handle';
import {PreviewPicker} from '~/components/preview/PreviewPicker';

const GOODGUT_HANDLE =
  'goodgut-digestive-enzyme-drops-for-dog-natural-ayurvedic-formula';

export const meta: Route.MetaFunction = () => [
  {title: 'Preview · AyurPet'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: GOODGUT_HANDLE,
      selectedOptions: getSelectedProductOptions(request),
    },
  });

  if (!product) {
    throw new Response('GoodGut+ product not found', {status: 404});
  }

  return {product};
}

export default function Preview() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions ?? []);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const images = product.images?.nodes ?? [];

  return (
    <main className="min-h-[60vh] bg-paper text-ink">
      {/* HERO — narrow centered column. Generous vertical breathing
          room. Editorial cadence: eyebrow → title → stars → trust
          pills → body → variant picker → ATC → reassurance. */}
      <section className="mx-auto max-w-3xl px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:pt-20">
        <p className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.32em] text-brand">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
          Daily digestive support
        </p>

        <h1 className="mt-5 break-words font-display text-[2.25rem] font-medium leading-[0.98] tracking-[-0.018em] text-ink sm:mt-6 sm:text-[3rem] lg:text-[3.6rem]">
          Your dog can&rsquo;t say{' '}
          <em className="not-italic text-brand [text-decoration:underline] [text-decoration-color:var(--color-saffron)] [text-decoration-thickness:3px] [text-underline-offset:6px]">
            my stomach hurts.
          </em>
        </h1>

        {/* Stars + review count */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted sm:gap-2.5">
          <span aria-hidden className="tracking-[0.18em] text-saffron-deep">
            ★★★★★
          </span>
          <span className="font-bold text-ink">4.9</span>
          <span aria-hidden className="text-ink-muted/60">·</span>
          <span>2,840+ verified reviews</span>
        </div>

        {/* Trust pill row — Native Pet "#1 best seller / whole body
            health / picky eater approved" pattern, retuned to brand. */}
        <ul className="mt-5 flex flex-wrap gap-2">
          {[
            {label: '#1 in digestive drops', tone: 'brand' as const},
            {label: 'Whole-gut formula', tone: 'neutral' as const},
            {label: 'Picky-eater approved', tone: 'neutral' as const},
          ].map((p) => (
            <li
              key={p.label}
              className={
                'rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ' +
                (p.tone === 'brand'
                  ? 'border-brand/40 bg-brand/10 text-brand'
                  : 'border-line bg-paper text-ink-soft')
              }
            >
              {p.label}
            </li>
          ))}
        </ul>

        {/* Value prop body */}
        <p className="mt-6 max-w-xl text-[15px] leading-[1.65] text-ink-soft sm:text-[16px] sm:leading-[1.7]">
          Vet-formulated daily drops for gas, picky eating, and calmer stools.{' '}
          <strong className="text-ink">Liquid format</strong> for faster uptake
          &mdash; no powders, no pills.
        </p>

        {/* Variant picker — owns the size cards, subscribe vs one-time
            block, and the green Add-to-cart button. The card chrome
            below frames it so it reads as a deliberate purchase
            decision rather than a loose form. */}
        <div
          data-purchase-anchor
          id="picker"
          className="mt-9 overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_22px_60px_rgba(31,26,20,0.08)] sm:mt-10 sm:p-7 lg:p-8"
        >
          <PreviewPicker
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          {/* Reassurance line */}
          <p className="mt-5 inline-flex items-center gap-2 text-[11.5px] leading-snug text-ink-muted">
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
      </section>

      {/* IMAGE GRID — every product image, edge-to-edge full-frame on
          mobile, two-up on desktop. Carries all the product info that
          would otherwise live in long-form copy. */}
      {images.length ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2">
          {images.map((img, i) => (
            <li
              key={img.id ?? i}
              className="relative aspect-square w-full overflow-hidden bg-cream"
            >
              <Image
                data={img}
                aspectRatio="1/1"
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading={i < 2 ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
