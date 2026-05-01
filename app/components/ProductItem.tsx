// Premium retail product tile — image-dominant, conversion-focused. The
// image stage takes ~70% of the card's visual weight; text below is a tight
// title + benefit + price row. Badges sit compact over the image, hover
// reveals a subtle View-product pill on desktop.
//
// Every text signal here is derived from real Storefront data (price, tags,
// handle, title). If a signal isn't present, we render nothing — never make
// up content.
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type ProductCardData = CollectionItemFragment | ProductItemFragment;

function deriveBadge(product: ProductCardData): string | null {
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

function deriveBenefit(product: ProductCardData): string | null {
  const handle = product.handle.toLowerCase();
  const title = product.title.toLowerCase();

  if (handle.includes('ashwagandha') || title.includes('ashwagandha')) {
    return 'Calming · long-lasting chew';
  }
  if (handle.includes('turmeric') || title.includes('turmeric')) {
    return 'Joint + skin support';
  }
  if (handle.includes('himalayan') || handle.includes('original')) {
    return 'Single-ingredient yak cheese';
  }
  if (handle.includes('goodgut') || title.includes('digestive')) {
    return 'Digestive enzyme drops';
  }
  if (handle.includes('hip-o-joint') || title.includes('joint')) {
    return 'Glucosamine + super-herbs';
  }
  if (handle.includes('coolcalm') || title.includes('calming')) {
    return 'Stress + behaviour drops';
  }
  if (
    handle.includes('combo') ||
    handle.includes('trio') ||
    handle.includes('pack-of-3')
  ) {
    return 'Routine bundle';
  }
  return null;
}

function savePercent(product: ProductCardData): number | null {
  const min = Number(product.priceRange.minVariantPrice.amount);
  const compareMin =
    'compareAtPriceRange' in product && product.compareAtPriceRange
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : 0;
  if (compareMin > min && compareMin > 0) {
    return Math.round(((compareMin - min) / compareMin) * 100);
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
  const altImageNode =
    'images' in product && Array.isArray(product.images?.nodes)
      ? product.images.nodes.find((n) => n?.id && n.id !== image?.id)
      : undefined;

  const min = Number(product.priceRange.minVariantPrice.amount);
  const max = Number(product.priceRange.maxVariantPrice?.amount ?? min);
  const hasRange = max > min;
  const compareMinAmount =
    'compareAtPriceRange' in product && product.compareAtPriceRange
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : 0;
  const showCompare = compareMinAmount > min && compareMinAmount > 0;

  const badge = deriveBadge(product);
  const benefit = deriveBenefit(product);
  const savePct = savePercent(product);

  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      aria-label={product.title}
      className="ayur-product-card group relative flex h-full flex-col text-ink no-underline [text-decoration:none]"
    >
      {/* Image stage — 4:5 portrait so product art dominates the tile. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream ring-1 ring-line/70 transition-all duration-500 group-hover:ring-brand/40 group-hover:shadow-[0_24px_60px_rgba(31,26,20,0.14)]">
        {/* Subtle radial wash so flat product photos still feel staged. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.45),transparent_55%),linear-gradient(180deg,#f7f0e1_0%,#ebe0c9_100%)]"
        />

        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              aspectRatio="4/5"
              data={image}
              loading={loading}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className={`absolute inset-0 h-full w-full object-contain p-4 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] sm:p-6 ${
                altImageNode ? 'group-hover:opacity-0' : ''
              }`}
            />
            {altImageNode ? (
              <Image
                alt={altImageNode.altText || product.title}
                aspectRatio="4/5"
                data={altImageNode}
                loading="lazy"
                sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-100 sm:p-6"
              />
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center font-display text-3xl text-ink-muted">
            AyurPet
          </div>
        )}

        {/* Top-left compact badge cluster */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-paper/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink shadow-[0_4px_14px_rgba(31,26,20,0.10)] ring-1 ring-line/60 backdrop-blur">
              {badge}
            </span>
          ) : null}
          {savePct ? (
            <span className="inline-flex items-center rounded-full bg-clay px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-paper shadow-[0_4px_14px_rgba(184,94,62,0.30)]">
              −{savePct}%
            </span>
          ) : null}
        </div>

        {/* Hover CTA — desktop only. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 bottom-3 mx-auto hidden translate-y-1 rounded-full bg-ink/95 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-paper opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
        >
          View product →
        </span>
      </div>

      {/* Compact text block — 3 lines max. */}
      <div className="mt-3.5 flex flex-1 flex-col">
        <h3 className="line-clamp-2 font-display text-[14px] leading-[1.25] tracking-tight text-ink sm:text-[15px]">
          {product.title.replace(/\s*\|\s*/g, ' · ')}
        </h3>
        {benefit ? (
          <p className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-ink-muted">
            {benefit}
          </p>
        ) : null}

        {/* Price row — bigger, calmer, conversion-leading. */}
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {hasRange ? (
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              from
            </span>
          ) : null}
          <Money
            as="span"
            data={product.priceRange.minVariantPrice}
            className="font-sans text-[15.5px] font-bold leading-none text-ink sm:text-[16.5px]"
          />
          {showCompare &&
          'compareAtPriceRange' in product &&
          product.compareAtPriceRange ? (
            <Money
              as="span"
              data={product.compareAtPriceRange.minVariantPrice}
              className="font-sans text-[12px] font-medium text-ink-muted/70 line-through"
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
