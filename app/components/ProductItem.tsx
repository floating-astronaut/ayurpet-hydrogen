import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import Tilt from 'react-parallax-tilt';
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
  // Hover image: prefer the second image of the product if it exists and
  // is distinct from the featured image.
  const altImageNode =
    'images' in product && Array.isArray(product.images?.nodes)
      ? product.images.nodes.find((n) => n?.id && n.id !== image?.id)
      : undefined;

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
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable
        glareMaxOpacity={0.18}
        glareColor="#fdfaf2"
        glarePosition="all"
        glareBorderRadius="1.4rem"
        scale={1.01}
        transitionSpeed={1200}
        gyroscope={false}
        tiltReverse={false}
        className="!block"
      >
        <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-cream transition duration-500 group-hover:shadow-[0_24px_60px_rgba(31,26,20,0.12)]">
          {image ? (
            <>
              <Image
                alt={image.altText || product.title}
                aspectRatio="1/1"
                data={image}
                loading={loading}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
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
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <div className="grid h-full w-full place-items-center font-display text-3xl text-ink-muted">
              AyurPet
            </div>
          )}
        </div>
      </Tilt>

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
