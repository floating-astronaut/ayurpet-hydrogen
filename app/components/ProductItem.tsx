import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type ProductCardData = CollectionItemFragment | ProductItemFragment;

export function ProductItem({
  product,
  loading,
}: {
  product: ProductCardData;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  // Show a "Save" badge only when there's a real price difference.
  const min = Number(product.priceRange.minVariantPrice.amount);
  const max = Number(product.priceRange.maxVariantPrice?.amount ?? min);
  const hasRange = max > min;

  return (
    <Link
      className="group relative flex h-full flex-col"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-cream transition duration-500 group-hover:shadow-[0_24px_60px_rgba(31,26,20,0.12)]">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl text-ink-muted">
            AyurPet
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="font-display text-lg leading-[1.2] text-ink line-clamp-2 sm:text-xl">
          {product.title}
        </h3>
        <p className="shrink-0 font-display text-lg text-ink sm:text-xl">
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
