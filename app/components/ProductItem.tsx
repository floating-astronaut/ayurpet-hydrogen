import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type ProductCardData = CollectionItemFragment | ProductItemFragment;

// Derive a small editorial badge from the product's own tags / handle / price
// without making one up. Falls back to nothing when there's no honest signal
// to surface — quieter card.
function deriveBadge(product: ProductCardData): string | null {
  const min = Number(product.priceRange.minVariantPrice.amount);
  const max = Number(product.priceRange.maxVariantPrice?.amount ?? min);
  if (max > min) return 'Save';

  const tags = (
    'tags' in product ? (product.tags as string[] | undefined) : undefined
  );
  if (tags?.length) {
    const lower = tags.map((t) => t.toLowerCase());
    if (lower.includes('bestseller')) return 'Bestseller';
    if (lower.includes('new')) return 'New';
    if (lower.includes('limited')) return 'Limited';
  }

  const handle = product.handle.toLowerCase();
  if (handle.includes('6-hour')) return '6-hour chew';
  if (
    handle.includes('combo') ||
    handle.includes('pack-of-3') ||
    handle.includes('trio')
  ) {
    return 'Bundle';
  }

  return null;
}

export function ProductItem({
  product,
  loading,
}: {
  product: ProductCardData;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  // Hover image: prefer the second image of the product if it exists and
  // is distinct from the featured image.
  const altImageNode =
    'images' in product && Array.isArray(product.images?.nodes)
      ? product.images.nodes.find((n) => n?.id && n.id !== image?.id)
      : undefined;

  const min = Number(product.priceRange.minVariantPrice.amount);
  const max = Number(product.priceRange.maxVariantPrice?.amount ?? min);
  const hasRange = max > min;
  const badge = deriveBadge(product);

  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      className="group relative flex h-full flex-col no-underline"
    >
      {/* Image stage with subtle paper-texture frame + inset light well */}
      <div className="ayur-card-frame relative aspect-square overflow-hidden rounded-[1.4rem] transition-shadow duration-500 group-hover:shadow-[0_30px_70px_rgba(31,26,20,0.14)]">
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:-translate-y-1 ${
                altImageNode ? 'group-hover:opacity-0' : ''
              }`}
            />
            {altImageNode ? (
              <Image
                alt={altImageNode.altText || product.title}
                aspectRatio="1/1"
                data={altImageNode}
                loading="lazy"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:-translate-y-1 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl text-ink-muted">
            AyurPet
          </div>
        )}

        {/* Editorial badge — only renders when there's a real signal */}
        {badge ? (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
            {badge}
          </span>
        ) : null}

        {/* "View product" pill that fades up on hover (desktop only — touch
            already gets a clear tap-target via the wrapping Link). */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto hidden w-fit translate-y-2 rounded-full bg-ink/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
        >
          View product →
        </span>
      </div>

      {/* Title + price block — quieter typography, more retail-grid feel */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="line-clamp-2 font-display text-base leading-[1.25] text-ink sm:text-lg">
          {product.title}
        </h3>
        <p className="shrink-0 font-display text-base text-ink sm:text-lg">
          {hasRange ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                from{' '}
              </span>
              <Money data={product.priceRange.minVariantPrice} />
            </>
          ) : (
            <Money data={product.priceRange.minVariantPrice} />
          )}
        </p>
      </div>
    </Link>
  );
}
