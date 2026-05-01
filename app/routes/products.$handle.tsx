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

const TRUST_POINTS: Array<[string, string]> = [
  ['Vet-informed formulas', 'Built around daily wellness, not pet-store filler.'],
  ['Ayurvedic actives', 'Turmeric, ashwagandha, and Himalayan ingredient lineage.'],
  ['Native Shopify checkout', 'Fast cart, trusted payments, customer accounts.'],
  ['30-day return window', 'If the routine doesn’t fit, send it back.'],
];

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
    <main className="bg-paper text-ink">
      {/* Hero: split editorial layout. Sticky gallery on desktop, stacked on mobile. */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(155deg,#ebe0c9_0%,#fdfaf2_45%,#f7f0e1_100%)]" />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[linear-gradient(180deg,rgba(74,140,94,0.08),transparent)]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_90px_rgba(31,26,20,0.10)] sm:rounded-[2.25rem]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {activeImage ? (
                  <Image
                    key={activeImage.id}
                    data={activeImage}
                    aspectRatio="4/5"
                    sizes="(min-width:1024px) 48vw, 92vw"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-5xl text-brand">
                    AyurPet
                  </div>
                )}
              </div>
            </div>

            {galleryAll.length > 1 ? (
              <div
                className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 lg:flex-wrap lg:snap-none lg:overflow-visible"
                aria-label="Product images"
              >
                {galleryAll.slice(0, 8).map((image) => {
                  const isActive = image.id === activeImage?.id;
                  return (
                    <button
                      key={image.id}
                      type="button"
                      aria-label="View image"
                      aria-pressed={isActive}
                      onClick={() => {
                        if (image.id) setActiveImageId(image.id);
                      }}
                      className={`relative h-[68px] w-[68px] shrink-0 snap-start overflow-hidden rounded-xl bg-white transition sm:h-20 sm:w-20 ${
                        isActive
                          ? 'ring-2 ring-brand ring-offset-2 ring-offset-paper'
                          : 'opacity-70 hover:opacity-100'
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
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand">
              {product.vendor || 'AyurPet Global'}
            </p>
            <h1
              className="mt-4 font-display leading-[0.96] text-ink"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
                letterSpacing: '-0.015em',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}
            >
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
              <p className="mt-7 max-w-xl text-[15px] leading-7 text-ink-soft sm:text-base sm:leading-8">
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
            <div className="mt-10 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_22px_60px_rgba(31,26,20,0.08)] sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
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

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[2.25rem] leading-none text-ink">
                  <Money data={selectedVariant.price} />
                </span>
                {showCompare ? (
                  <span className="text-base text-ink-muted line-through">
                    <Money data={compareAt} />
                  </span>
                ) : null}
                <span className="text-sm text-ink-muted">incl. taxes</span>
              </div>

              <div className="mt-7">
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </div>

              <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                Free shipping over USD 60 · 30-day returns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — denser horizontal row of 4 facets, not card grid */}
      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10 lg:py-14">
          {TRUST_POINTS.map(([title, body]) => (
            <div key={title}>
              <h2 className="font-display text-lg text-ink sm:text-xl">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it fits — editorial split with description-rich content */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-10 lg:py-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              Why it fits
            </p>
            <h2
              className="mt-4 font-display leading-[0.98]"
              style={{
                fontSize: 'clamp(1.85rem, 3.6vw, 3.25rem)',
                letterSpacing: '-0.012em',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}
            >
              Care details without the crowded pet-store feel.
            </h2>
          </div>
          <div className="text-[15px] leading-8 text-ink-soft sm:text-base">
            {product.descriptionHtml ? (
              <div
                className="ayur-prose"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />
            ) : (
              <p>{product.description}</p>
            )}
          </div>
        </div>
      </section>

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
