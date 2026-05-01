import type {Route} from './+types/collections.all';
import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'AyurPet Global — Shop all pet wellness'}];
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
      <section className="border-b border-line bg-[linear-gradient(135deg,#fdfaf2,#ebe0c9)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            Shop all
          </p>
          <h1
            className="mt-4 max-w-4xl font-display leading-[0.96] text-ink"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              letterSpacing: '-0.015em',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            The full AyurPet shelf.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted sm:text-base">
            Supplements, yak chews, bundles, and daily pet-wellness routines —
            connected directly to live Shopify inventory.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-8 flex items-baseline justify-between border-b border-line pb-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-muted">
            {count > 0 ? `${count} products` : 'Loading…'}
          </p>
          <p className="hidden text-[11px] uppercase tracking-[0.24em] text-ink-muted sm:block">
            Sorted by best-selling
          </p>
        </div>
        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
          resourcesClassName="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
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
