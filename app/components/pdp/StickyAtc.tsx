// Mobile-only sticky add-to-cart bar.
// Hidden until the user scrolls past ~80vh (past the hero), then slides up
// with the product thumbnail, price, and a primary ATC button that opens
// the cart aside on success. Hidden again on lg screens — desktop has the
// inline ProductForm always visible.
import {useEffect, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

export function StickyAtc({
  productTitle,
  thumbnail,
  selectedVariant,
}: {
  productTitle: string;
  thumbnail: StorefrontImage | null | undefined;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const {open} = useAside();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!selectedVariant) return null;

  return (
    <div
      aria-hidden={!visible}
      style={{paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)'}}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-3 pt-3 shadow-[0_-12px_40px_rgba(31,26,20,0.12)] backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        {thumbnail ? (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
            <Image
              data={thumbnail}
              aspectRatio="1/1"
              sizes="48px"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm leading-tight text-ink">
            {productTitle}
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            <Money data={selectedVariant.price} />
          </p>
        </div>

        <AddToCartButton
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-brand px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-brand-deep disabled:opacity-50"
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}
