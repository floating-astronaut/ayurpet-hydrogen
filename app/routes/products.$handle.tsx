import {redirect, useLoaderData} from 'react-router';
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
      content: product?.seo?.description || product?.description || 'Premium Ayurvedic wellness for modern pets.',
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

  return {
    product,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

const PROOF_POINTS = [
  ['Daily support', 'Built for repeatable wellness routines, not one-off treats.'],
  ['Ayurvedic actives', 'Turmeric, ashwagandha, and Himalayan ingredient traditions.'],
  ['Clean checkout', 'Shopify cart, trusted payments, and customer account history.'],
];

const OUTCOMES = ['Gut comfort', 'Calmer days', 'Chew engagement', 'Better daily ritual'];

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

  const mainImage = selectedVariant?.image ?? product.featuredImage ?? product.images.nodes[0] ?? null;
  const gallery: StorefrontImage[] = product.images.nodes.length ? product.images.nodes : mainImage ? [mainImage] : [];

  return (
    <main className="bg-paper text-ink">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2a1110_0%,#351614_42%,#f7f0e1_42%,#fdfaf2_100%)] lg:min-h-[calc(100svh-76px)]">
        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(#dccfb3_1px,transparent_1px),linear-gradient(90deg,#dccfb3_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-cream p-3 shadow-[0_34px_110px_rgba(31,26,20,0.22)] sm:rounded-[2.7rem] sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-paper sm:rounded-[2.1rem]">
                {mainImage ? (
                  <Image
                    data={mainImage}
                    aspectRatio="4/5"
                    sizes="(min-width:1024px) 48vw, 92vw"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-5xl text-brand">AyurPet</div>
                )}
              </div>
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
                {gallery.slice(0, 8).map((image) => (
                  <div key={image.id} className="h-20 w-20 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-paper sm:h-24 sm:w-24">
                    <Image data={image} aspectRatio="1/1" sizes="96px" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-line bg-paper/95 p-5 shadow-[0_24px_90px_rgba(31,26,20,0.09)] backdrop-blur sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 border-b border-line pb-5 text-sm text-ink-muted">
              <span className="tracking-[0.18em] text-saffron">★★★★★</span>
              <span className="font-semibold text-ink">4.9</span>
              <span>from 9,340+ reviews</span>
            </div>

            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.34em] text-brand">{product.vendor || 'AyurPet Global'}</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.93] text-ink sm:text-6xl lg:text-[5.7rem]">
              {product.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              {product.description || 'A premium daily wellness product built for modern pet routines with Ayurvedic care principles.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {OUTCOMES.map((outcome) => (
                <span key={outcome} className="rounded-full border border-line bg-white/70 px-4 py-2 text-xs font-semibold text-brand">
                  ✓ {outcome}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-line bg-white/70 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink-muted">Selected option</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-display text-2xl text-ink">{selectedVariant.title}</p>
                  {selectedVariant.sku ? <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">SKU {selectedVariant.sku}</p> : null}
                </div>
                <div className="text-right font-display text-3xl text-brand">
                  <Money data={selectedVariant.price} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {PROOF_POINTS.map(([title, body]) => (
            <article key={title} className="rounded-[1.6rem] border border-line bg-paper/82 p-6 shadow-[0_12px_40px_rgba(31,26,20,0.04)]">
              <h2 className="font-display text-3xl text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">Why it fits</p>
            <h2 className="mt-4 font-display text-4xl leading-[1] sm:text-6xl">Care details without the crowded pet-store feel.</h2>
          </div>
          <div className="rounded-[2rem] border border-line bg-white/76 p-6 text-base leading-8 text-ink-muted shadow-[0_20px_80px_rgba(31,26,20,0.05)] sm:p-8">
            {product.descriptionHtml ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
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
