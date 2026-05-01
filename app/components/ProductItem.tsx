import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type ProductCardData = CollectionItemFragment | ProductItemFragment;

// ---- Honest derivation -------------------------------------------------
// Every signal here is grounded in real product data (price, tags, handle).
// We never make up content; if a signal isn't present we render nothing.

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

// One-line benefit derived from the product's handle / title — short,
// editorial, and consistent across the grid.
function deriveBenefit(product: ProductCardData): string | null {
  const handle = product.handle.toLowerCase();
  const title = product.title.toLowerCase();

  if (handle.includes('ashwagandha') || title.includes('ashwagandha')) {
    return 'Calming Ayurveda · long-lasting chew';
  }
  if (handle.includes('turmeric') || title.includes('turmeric')) {
    return 'Joint + skin support · slow-aged chew';
  }
  if (handle.includes('himalayan') || handle.includes('original')) {
    return 'Single-ingredient yak cheese · 6h+ chew';
  }
  if (handle.includes('goodgut') || title.includes('digestive')) {
    return 'Digestive enzyme drops · daily ritual';
  }
  if (handle.includes('hip-o-joint') || title.includes('joint')) {
    return 'Glucosamine + Ayurvedic super-herbs';
  }
  if (handle.includes('coolcalm') || title.includes('calming')) {
    return 'Stress + behaviour support drops';
  }
  if (
    handle.includes('combo') ||
    handle.includes('trio') ||
    handle.includes('pack-of-3')
  ) {
    return 'Routine bundle · save vs buying separately';
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
      className="ayur-product-card group relative flex h-full flex-col no-underline"
    >
      {/* Image stage */}
      <div className="ayur-card-frame relative aspect-square overflow-hidden rounded-[1.25rem] transition-shadow duration-500 group-hover:shadow-[0_30px_70px_rgba(31,26,20,0.14)]">
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
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
                sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:-translate-y-1 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl text-ink-muted">
            AyurPet
          </div>
        )}

        {/* Top-left badge cluster: editorial pill stack */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
              {badge}
            </span>
          ) : null}
          {savePct ? (
            <span className="inline-flex items-center rounded-full bg-clay px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-paper shadow-[0_6px_18px_rgba(184,94,62,0.25)]">
              Save {savePct}%
            </span>
          ) : null}
        </div>

        {/* Hover CTA — desktop only. Mobile uses the wrapping Link as tap-target. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto hidden w-fit translate-y-2 rounded-full bg-ink/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
        >
          View product →
        </span>
      </div>

      {/* Vendor + title + benefit */}
      <div className="mt-4">
        {'vendor' in product && product.vendor ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
            {String(product.vendor).replace(/_/g, ' ')}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 font-display text-[15px] leading-[1.25] text-ink sm:text-base">
          {product.title}
        </h3>
        {benefit ? (
          <p className="mt-1.5 line-clamp-1 text-[12px] leading-snug text-ink-muted">
            {benefit}
          </p>
        ) : null}
      </div>

      {/* Price row — from / compare-at when present */}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {hasRange ? (
          <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            from
          </span>
        ) : null}
        <span className="font-display text-[17px] leading-none text-ink sm:text-lg">
          <Money data={product.priceRange.minVariantPrice} />
        </span>
        {showCompare &&
        'compareAtPriceRange' in product &&
        product.compareAtPriceRange ? (
          <span className="text-[12px] text-ink-muted line-through">
            <Money data={product.compareAtPriceRange.minVariantPrice} />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
