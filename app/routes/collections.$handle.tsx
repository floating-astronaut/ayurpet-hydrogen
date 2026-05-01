import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `AyurPet Global — ${data?.collection.title ?? 'Collection'}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!handle) throw redirect('/collections/all');

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});
  return {collection};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  const count = collection.products?.nodes?.length ?? 0;

  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <section className="border-b border-line bg-[linear-gradient(135deg,#fdfaf2,#ebe0c9)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            Collection
          </p>
          <h1
            className="mt-4 max-w-4xl font-display leading-[0.96] text-ink"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              letterSpacing: '-0.015em',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            {collection.title}
          </h1>
          {collection.description ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted sm:text-base">
              {collection.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-8 flex items-baseline justify-between border-b border-line pb-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink-muted">
            {count > 0 ? `${count} products` : 'Loading…'}
          </p>
        </div>
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
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
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </main>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes { ...ProductItem }
        pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
      }
    }
  }
` as const;
