import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Hero} from '~/components/home/Hero';
import {StoryStrip} from '~/components/home/StoryStrip';
import {IngredientExplorer} from '~/components/home/IngredientExplorer';
import {ProductRange} from '~/components/home/ProductRange';
import {FinalCta} from '~/components/home/FinalCta';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Ayurpet — Ayurvedic supplements & yak chews for dogs'},
    {
      name: 'description',
      content:
        'Vet-approved Ayurvedic supplements and Himalayan yak cheese chews for dogs. Lab-tested, single-ingredient, and Buy-1-Help-1 every order.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferred = loadDeferredData(args);
  const critical = await loadCriticalData(args);
  return {...deferred, ...critical};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{product}] = await Promise.all([
    context.storefront.query(HERO_PRODUCT_QUERY, {
      variables: {handle: HERO_PRODUCT_HANDLE},
    }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    heroProduct: product,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const products = context.storefront
    .query(RANGE_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {rangeProducts: products};
}

const HERO_PRODUCT_HANDLE =
  'calming-ashwagandha-yak-cheese-chews-6-hour-long-lasting-dental-chew';

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const heroImage = data.heroProduct?.featuredImage ?? null;

  return (
    <main>
      {data.isShopLinked ? null : <MockShopNotice />}

      <Hero
        eyebrow="Ancient Ayurveda × Modern Vet Science"
        headline="Healthier dogs. Older traditions."
        sub="Vet-approved Ayurvedic supplements & Himalayan yak chews — lab-tested, single-ingredient, gentle as nature intended."
        ctaLabel="Shop the range"
        ctaHref="/collections/all"
        productImage={heroImage}
      />

      <StoryStrip />

      <IngredientExplorer />

      <Suspense fallback={null}>
        <Await resolve={data.rangeProducts}>
          {(response) =>
            response ? <ProductRange products={response.products.nodes} /> : null
          }
        </Await>
      </Suspense>

      <FinalCta
        ctaLabel="Shop the range"
        ctaHref="/collections/all"
        headline="A calmer dog, a kinder world. Start with one chew."
      />
    </main>
  );
}

const HERO_PRODUCT_QUERY = `#graphql
  query HeroProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;

const RANGE_PRODUCTS_QUERY = `#graphql
  fragment RangeProduct on Product {
    id
    title
    handle
    vendor
    tags
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
  }
  query RangeProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: BEST_SELLING) {
      nodes { ...RangeProduct }
    }
  }
` as const;
