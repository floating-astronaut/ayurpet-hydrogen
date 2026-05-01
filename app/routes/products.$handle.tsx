import {useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import {ProductForm} from '~/components/ProductForm';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {HowItWorksTimeline} from '~/components/pdp/HowItWorksTimeline';
import {WhoIsItFor} from '~/components/pdp/WhoIsItFor';
import {ShippingReturns} from '~/components/pdp/ShippingReturns';
import {PaymentTrust} from '~/components/pdp/PaymentTrust';
import {StickyAtc} from '~/components/pdp/StickyAtc';
import {RichTrustBand} from '~/components/pdp/RichTrustBand';
import {BrandStrip} from '~/components/pdp/BrandStrip';
import {WhyThisWorks} from '~/components/pdp/WhyThisWorks';
import {Reviews} from '~/components/pdp/Reviews';
import {FaqAccordion} from '~/components/pdp/FaqAccordion';
import {ClosingCta} from '~/components/pdp/ClosingCta';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {GoodGutLanding} from '~/components/pdp/goodgut/GoodGutLanding';

// Handle-based custom landing pages. Add a handle here to render a
// dedicated landing component instead of the generic PDP flow.
const GOODGUT_HANDLE =
  'goodgut-digestive-enzyme-drops-for-dog-natural-ayurvedic-formula';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  return [
    {title: product?.seo?.title || `${product?.title ?? 'Product'} | AyurPet Global`},
    {
      name: 'description',
      content:
        product?.seo?.description ||
        product?.description ||
        'Premium Ayurvedic wellness for modern pets.',
    },
    {
      rel: 'canonical',
      href: `/products/${product?.handle ?? ''}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

const OUTCOMES = [
  'Gut comfort',
  'Calmer days',
  'Chew engagement',
  'Daily ritual',
];

// Display title without the awkward `|` separator some Shopify titles carry.
function cleanTitle(title: string): string {
  return title.replace(/\s*\|\s*/g, ' — ');
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Gallery state lives here at the top of the component so React's
  // rules-of-hooks are satisfied even when the GoodGut+ branch returns
  // early below. The GoodGut landing builds its own gallery internally
  // and this state simply goes unused for that handle.
  const galleryAll: StorefrontImage[] = (() => {
    const acc: StorefrontImage[] = [];
    const seen = new Set<string>();
    const push = (img?: StorefrontImage | null) => {
      if (img?.id && !seen.has(img.id)) {
        seen.add(img.id);
        acc.push(img);
      }
    };
    push(selectedVariant?.image as StorefrontImage | undefined);
    push(product.featuredImage as StorefrontImage | undefined);
    product.images.nodes.forEach((n) => push(n as StorefrontImage));
    return acc;
  })();
  const [activeImageId, setActiveImageId] = useState<string | undefined>(
    () => galleryAll[0]?.id ?? undefined,
  );

  // Custom landing pages keyed by product handle.
  // GoodGut+ gets its own symptom-led page; the generic PDP keeps
  // serving every other product unchanged.
  if (product.handle === GOODGUT_HANDLE) {
    return (
      <>
        <GoodGutLanding
          product={product}
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </>
    );
  }

  const activeImage =
    galleryAll.find((i) => i.id === activeImageId) ?? galleryAll[0] ?? null;

  const compareAt = selectedVariant?.compareAtPrice;
  const showCompare =
    compareAt &&
    Number(compareAt.amount) > Number(selectedVariant?.price.amount);
  const displayTitle = cleanTitle(product.title);

  return (
    <main className="overflow-x-clip bg-paper pb-24 text-ink lg:pb-0">
      {/* Hero: split editorial layout. Sticky gallery on desktop, stacked on mobile. */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(155deg,#ebe0c9_0%,#fdfaf2_45%,#f7f0e1_100%)]" />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[linear-gradient(180deg,rgba(74,140,94,0.08),transparent)]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-10 lg:py-16">
          {/* Gallery — campaign-style image stage */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal
              kind="rise-soft"
              className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#ebe0c9_0%,#dccfb3_50%,#c7b89a_100%)] p-2 shadow-[0_40px_120px_rgba(31,26,20,0.16)] sm:rounded-[2rem] sm:p-3"
            >
              {/* Brand color halo + subtle vignette so flat product packaging photographs reads as designed campaign art. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_22%_22%,rgba(74,140,94,0.18),transparent_42%),radial-gradient(circle_at_78%_85%,rgba(184,94,62,0.18),transparent_45%)]"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#fdfaf2_0%,#f0e6d0_100%)] sm:rounded-[1.85rem]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-12 top-8 h-44 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_70%)]"
                />
                {activeImage ? (
                  <Image
                    key={activeImage.id}
                    data={activeImage}
                    aspectRatio="4/5"
                    sizes="(min-width:1024px) 48vw, 92vw"
                    className="ayur-gallery-image absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center font-display text-5xl text-brand">
                    AyurPet
                  </div>
                )}

                {/* Subtle bottom shade so a sticky pill / chip reads against any photo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(31,26,20,0.10))]"
                />
              </div>
            </ScrollReveal>

            {galleryAll.length > 1 ? (
              <div
                className="-mx-4 mt-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:snap-none lg:overflow-visible lg:px-0"
                aria-label="Product images"
              >
                {galleryAll.slice(0, 8).map((image, idx) => {
                  const isActive = image.id === activeImage?.id;
                  return (
                    <button
                      key={image.id}
                      type="button"
                      aria-label={`View image ${idx + 1} of ${Math.min(galleryAll.length, 8)}`}
                      aria-pressed={isActive}
                      onClick={() => {
                        if (image.id) setActiveImageId(image.id);
                      }}
                      className={`relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-[0.85rem] bg-cream transition-all duration-300 sm:h-[72px] sm:w-[72px] ${
                        isActive
                          ? 'ring-2 ring-brand ring-offset-2 ring-offset-paper'
                          : 'opacity-65 ring-1 ring-line hover:opacity-100 hover:ring-brand/40'
                      }`}
                    >
                      <Image
                        data={image}
                        aspectRatio="1/1"
                        sizes="80px"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Detail */}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand">
              {product.vendor || 'AyurPet Global'}
            </p>
            <h1 className="mt-3 break-words font-display text-[1.85rem] leading-[1.04] tracking-[-0.01em] text-ink sm:mt-4 sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[3.75rem]">
              {displayTitle}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[13px] text-ink-muted sm:mt-6 sm:gap-3 sm:text-sm">
              <span className="tracking-[0.18em] text-saffron-deep" aria-hidden>
                ★★★★★
              </span>
              <span className="font-bold text-ink">4.9</span>
              <span aria-hidden className="text-ink-muted/60">
                ·
              </span>
              <span>9,340+ verified reviews</span>
            </div>

            {product.description ? (
              <p className="mt-5 max-w-xl break-words text-[14.5px] leading-7 text-ink-soft sm:mt-6 sm:text-[15.5px] sm:leading-8">
                {product.description}
              </p>
            ) : null}

            <ul className="mt-5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
              {OUTCOMES.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-full border border-line bg-white/80 px-3 py-1 text-[11.5px] font-medium tracking-wide text-ink-soft"
                >
                  {outcome}
                </li>
              ))}
            </ul>

            {/* Purchase panel — tightened, conversion-focused. */}
            <div
              data-purchase-anchor
              className="mt-8 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_22px_60px_rgba(31,26,20,0.08)] sm:mt-10"
            >
              <div className="p-5 sm:p-6">
                {/* Variant + SKU eyebrow row */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand">
                    {selectedVariant?.title &&
                    selectedVariant.title.toLowerCase() !== 'default title'
                      ? selectedVariant.title
                      : 'Single pack'}
                  </p>
                  {selectedVariant?.sku ? (
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      SKU {selectedVariant.sku}
                    </p>
                  ) : null}
                </div>

                {/* Price block */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                  <Money
                    as="span"
                    data={selectedVariant.price}
                    className="font-display text-[2.25rem] leading-[0.9] tracking-tight text-ink sm:text-[2.75rem]"
                  />
                  {showCompare ? (
                    <>
                      <Money
                        as="span"
                        data={compareAt}
                        className="text-lg text-ink-muted line-through"
                      />
                      <span className="rounded-full bg-clay/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-clay">
                        Save{' '}
                        {Math.round(
                          ((Number(compareAt!.amount) -
                            Number(selectedVariant.price.amount)) /
                            Number(compareAt!.amount)) *
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

                {/* Variant picker + AddToCart */}
                <div className="mt-5 sm:mt-6">
                  <ProductForm
                    productOptions={productOptions}
                    selectedVariant={selectedVariant}
                  />
                </div>
              </div>

              {/* Microcopy strip under the CTA */}
              <ul className="grid grid-cols-3 divide-x divide-line border-t border-line bg-cream/40 text-center">
                {[
                  ['🚚', 'Ships same day', 'Before 14:00 IST'],
                  ['🔒', 'Secure Shopify', 'Trusted checkout'],
                  ['↩', '30-day returns', 'Unopened items'],
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

              {/* Payment + secure-checkout strip */}
              <div className="border-t border-line p-5 sm:p-6">
                <PaymentTrust />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RichTrustBand />

      <BrandStrip />

      <WhyThisWorks />
      <HowItWorksTimeline />
      <WhoIsItFor />
      <Reviews />
      <ShippingReturns />
      <FaqAccordion />

      {/* Why it fits — editorial split with description-rich content */}
      {product.descriptionHtml || product.description ? (
        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-10 lg:py-24">
            <ScrollReveal kind="rise-soft" className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
                The full story
              </p>
              <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Care details, written for pet parents.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
                Lifted directly from the product source-of-truth in Shopify, so
                what you read here is what merchandising actually wrote.
              </p>
            </ScrollReveal>
            <ScrollReveal
              kind="rise-soft"
              className="min-w-0 rounded-[1.25rem] border border-line bg-paper p-6 text-[15px] leading-7 text-ink-soft shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-8 sm:text-base sm:leading-8"
            >
              {product.descriptionHtml ? (
                <div
                  className="ayur-prose"
                  dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                />
              ) : (
                <p className="break-words">{product.description}</p>
              )}
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      <ClosingCta
        productTitle={displayTitle}
        imageUrl={
          (activeImage as StorefrontImage | null)?.url ??
          'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_21.19.22.jpg?v=1757964471'
        }
      />

      <StickyAtc
        productTitle={displayTitle}
        thumbnail={(activeImage as StorefrontImage | null) ?? null}
        selectedVariant={selectedVariant}
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </main>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
