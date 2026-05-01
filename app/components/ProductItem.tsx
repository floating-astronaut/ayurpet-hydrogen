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
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white/80 shadow-[0_20px_70px_rgba(31,26,20,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(31,26,20,0.12)]"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-[1.08/1] overflow-hidden bg-cream">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-muted">AyurPet</div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,17,16,0.02),rgba(42,17,16,0.28))]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/86 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur">
          Daily wellness
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="font-display text-2xl leading-[1.05] text-ink sm:text-3xl">{product.title}</h3>
          <p className="mt-3 text-sm leading-6 text-ink-muted">Ayurvedic actives, clean routine, Shopify checkout.</p>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">From</p>
            <p className="mt-1 text-xl font-semibold text-clay"><Money data={product.priceRange.minVariantPrice} /></p>
          </div>
          <span className="rounded-full bg-brand px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">View</span>
        </div>
      </div>
    </Link>
  );
}
