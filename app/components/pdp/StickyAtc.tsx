// Mobile-only sticky add-to-cart bar.
//
// Rebuild based on visual QA feedback:
//   - Old bar dumped the full SEO product title which truncated on
//     390px and forced the CTA text to clip to "ADD".
//   - New bar accepts a compactTitle (e.g. "GoodGut+") so the left
//     column reads `compactTitle · variantTitle` over `$36`.
//   - Right column is sized for the full "Add to cart" word, with
//     responsive shrinking only at the smallest widths.
//   - The bar appears only after the user has scrolled past the
//     in-page purchase panel (data-purchase-anchor / [data-purchase-anchor]),
//     so it never competes with the primary buy flow.
//
// Hydration is preserved: Money renders as <span> via as="span", and
// the visibility state lives in client-only useState updated from a
// scroll listener.
import {useEffect, useRef, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

type Props = {
  /** Long product title used for accessibility / aria-label. */
  productTitle: string;
  /** Compact label rendered as the left-column line ("GoodGut+", "Calming Yak Chew"). */
  compactTitle?: string;
  thumbnail: StorefrontImage | null | undefined;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
};

export function StickyAtc({
  productTitle,
  compactTitle,
  thumbnail,
  selectedVariant,
}: Props) {
  const {open} = useAside();
  const [visible, setVisible] = useState(false);
  // Track whether we've seen the in-page purchase anchor at all so we
  // don't activate on PDPs that don't expose one.
  const sawAnchorRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const anchor = document.querySelector('[data-purchase-anchor]');
      if (!anchor) {
        // Fallback: behave like the previous heuristic — show after
        // ~70% of viewport scroll if no anchor exists on this PDP.
        setVisible(window.scrollY > window.innerHeight * 0.7);
        return;
      }
      sawAnchorRef.current = true;
      const rect = anchor.getBoundingClientRect();
      // Visible when the bottom of the in-page purchase panel has
      // scrolled past the top of the viewport.
      setVisible(rect.bottom < 8);
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(compute);
        ticking = true;
      }
    };
    compute();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!selectedVariant) return null;

  // Keep the left-column title to ONE short label. Falls back to the
  // first segment of the SEO product title if no compact label is
  // provided.
  const shortLabel =
    compactTitle ??
    productTitle.split(/\s*[|—]\s*/)[0]?.trim() ??
    productTitle;
  const variantLabel =
    selectedVariant.title &&
    selectedVariant.title.toLowerCase() !== 'default title'
      ? selectedVariant.title
      : null;

  return (
    <div
      aria-hidden={!visible}
      style={{paddingBottom: 'max(env(safe-area-inset-bottom), 0.65rem)'}}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-3 pt-2.5 shadow-[0_-12px_40px_rgba(31,26,20,0.12)] backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        {thumbnail ? (
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream ring-1 ring-line/60">
            <Image
              data={thumbnail}
              aspectRatio="1/1"
              width={88}
              height={88}
              sizes="44px"
              className="block h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 leading-tight">
          <span className="block truncate font-display text-[14px] text-ink">
            {shortLabel}
            {variantLabel ? (
              <span className="text-ink-muted"> · {variantLabel}</span>
            ) : null}
          </span>
          <Money
            as="span"
            data={selectedVariant.price}
            className="mt-0.5 block text-[13px] font-bold tabular-nums text-brand"
          />
        </div>

        <AddToCartButton
          className="inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-5 text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition hover:bg-brand-deep disabled:opacity-50"
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
          {selectedVariant.availableForSale ? 'Add to cart' : 'Sold out'}
          <span aria-hidden>→</span>
        </AddToCartButton>
      </div>
    </div>
  );
}
