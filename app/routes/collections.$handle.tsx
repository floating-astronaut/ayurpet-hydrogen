import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {CollectionHero} from '~/components/collection/CollectionHero';
import {ShopByNeed} from '~/components/collection/ShopByNeed';
import {MerchSpotlight} from '~/components/collection/MerchSpotlight';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

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
      <CollectionHero
        eyebrow="Collection"
        title={collection.title}
        description={collection.description ?? null}
        productCount={count}
        sort="Best-selling"
        showShopAllLink
      />

      <ShopByNeed activeHandle={collection.handle} />

      <MerchSpotlight />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <ScrollReveal kind="fade">
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
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
