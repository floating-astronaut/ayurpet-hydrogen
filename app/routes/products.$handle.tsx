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
import {ScrollReveal} from '~/components/motion/ScrollReveal';

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

  // Build a stable gallery: dedupe by id, prefer variant image first.
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
          {/* Gallery */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal kind="rise-soft" className="ayur-card-frame relative overflow-hidden rounded-[1.5rem] p-3 shadow-[0_30px_90px_rgba(31,26,20,0.10)] sm:rounded-[2.25rem] sm:p-4">
              {/* Soft light-well behind the photo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-6 h-32 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_70%)]"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-paper sm:rounded-[1.85rem]">
                {activeImage ? (
                  <Image
                    key={activeImage.id}
                    data={activeImage}
                    aspectRatio="4/5"
                    sizes="(min-width:1024px) 48vw, 92vw"
                    className="ayur-gallery-image h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-5xl text-brand">
                    AyurPet
                  </div>
                )}
              </div>
            </ScrollReveal>

            {galleryAll.length > 1 ? (
              <div
                className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:snap-none lg:overflow-visible lg:px-0"
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
                      className={`relative h-[68px] w-[68px] shrink-0 snap-start overflow-hidden rounded-xl bg-white transition-all duration-300 sm:h-20 sm:w-20 ${
                        isActive
                          ? 'opacity-100 ring-[1.5px] ring-brand ring-offset-2 ring-offset-paper after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:bg-brand'
                          : 'opacity-60 hover:opacity-100'
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
            <h1 className="mt-4 break-words font-display text-[1.875rem] leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl xl:text-6xl">
              {displayTitle}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              <span className="tracking-[0.16em] text-saffron-deep" aria-hidden>
                ★★★★★
              </span>
              <span className="font-semibold text-ink">4.9</span>
              <span aria-hidden>·</span>
              <span>9,340+ verified reviews</span>
            </div>

            {product.description ? (
              <p className="mt-7 max-w-xl break-words text-[15px] leading-7 text-ink-soft sm:text-base sm:leading-8">
                {product.description}
              </p>
            ) : null}

            <ul className="mt-7 flex flex-wrap gap-2">
              {OUTCOMES.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[12px] tracking-wide text-ink"
                >
                  {outcome}
                </li>
              ))}
            </ul>

            {/* Purchase panel — single editorial card, not a stack of cards */}
            <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_22px_60px_rgba(31,26,20,0.08)]">
              <div className="p-5 sm:p-7">
                {/* Variant + SKU eyebrow row */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
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

                {/* Price block — display weight, larger leading, savings pill */}
                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="font-display text-[2.5rem] leading-[0.9] tracking-tight text-ink sm:text-[3rem]">
                    <Money data={selectedVariant.price} />
                  </span>
                  {showCompare ? (
                    <>
                      <span className="text-lg text-ink-muted line-through">
                        <Money data={compareAt} />
                      </span>
                      <span className="rounded-full bg-clay/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-clay">
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
                <p className="mt-1 text-xs text-ink-muted">Tax included · Calculated at checkout</p>

                {/* Variant picker + AddToCart */}
                <div className="mt-7">
                  <ProductForm
                    productOptions={productOptions}
                    selectedVariant={selectedVariant}
                  />
                </div>
              </div>

              {/* Microcopy strip under the CTA */}
              <ul className="grid grid-cols-3 divide-x divide-line border-t border-line bg-cream/50 text-center">
                {[
                  ['🚚', 'Ships same day', 'Before 14:00 IST'],
                  ['🔒', 'Secure Shopify', 'Trusted checkout'],
                  ['↩', '30-day returns', 'Unopened items'],
                ].map(([emoji, title, sub]) => (
                  <li key={title} className="px-2 py-3 sm:px-3 sm:py-4">
                    <span aria-hidden className="block text-base sm:text-lg">
                      {emoji}
                    </span>
                    <p className="mt-1 text-[11px] font-semibold leading-tight text-ink">
                      {title}
                    </p>
                    <p className="mt-0.5 hidden text-[10px] leading-tight text-ink-muted sm:block">
                      {sub}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Payment + secure-checkout strip */}
              <div className="border-t border-line p-5 sm:p-7">
                <PaymentTrust />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RichTrustBand />

      <HowItWorksTimeline />
      <WhoIsItFor />
      <ShippingReturns />

      {/* Why it fits — editorial split with description-rich content */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-10 lg:py-24">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              Why it fits
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Care details without the crowded pet-store feel.
            </h2>
          </div>
          <div className="min-w-0 text-[15px] leading-7 text-ink-soft sm:text-base sm:leading-8">
            {product.descriptionHtml ? (
              <div
                className="ayur-prose"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />
            ) : (
              <p className="break-words">{product.description}</p>
            )}
          </div>
        </div>
      </section>

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
