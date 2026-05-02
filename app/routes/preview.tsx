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
import {Image} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/preview';

const GOODGUT_HANDLE =
  'goodgut-digestive-enzyme-drops-for-dog-natural-ayurvedic-formula';

const PREVIEW_IMAGES_QUERY = `#graphql
  query PreviewImages(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      images(first: 20) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

export const meta: Route.MetaFunction = () => [
  {title: 'Preview · AyurPet'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;
  const {product} = await storefront.query(PREVIEW_IMAGES_QUERY, {
    variables: {handle: GOODGUT_HANDLE},
  });
  return {
    productTitle: product?.title ?? null,
    images: product?.images?.nodes ?? [],
  };
}

export default function Preview() {
  const {images} = useLoaderData<typeof loader>();

  if (!images.length) {
    return (
      <main className="min-h-[60vh] bg-paper text-ink">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-[12px] uppercase tracking-[0.28em] text-ink-muted">
            No images found for the GoodGut+ product.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-paper text-ink">
      {/* Two-up on desktop, full-frame edge-to-edge on mobile. No
          gap, no container padding — images carry the page on their
          own. */}
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
    </main>
  );
}
