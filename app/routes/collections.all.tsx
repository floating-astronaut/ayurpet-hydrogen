import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {CollectionHero} from '~/components/collection/CollectionHero';
import {ShopByNeed} from '~/components/collection/ShopByNeed';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'AyurPet Global — The full shelf'},
    {
      name: 'description',
      content:
        'Vet-informed Ayurvedic supplements, Himalayan yak chews and daily pet-wellness bundles. Connected directly to live Shopify inventory.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const count = products?.nodes?.length ?? 0;

  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <CollectionHero
        eyebrow="Shop all"
        title="The full AyurPet shelf."
        description="Supplements, yak chews, bundles, and daily pet-wellness routines — connected directly to live Shopify inventory. Made for the dog you've got, not the average dog."
        productCount={count}
        sort="Best-selling"
      />

      <ShopByNeed />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <ScrollReveal kind="fade">
          <PaginatedResourceSection<CollectionItemFragment>
            connection={products}
            resourcesClassName="grid gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14 xl:grid-cols-4"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </ScrollReveal>
      </section>
    </main>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    vendor
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
