// Shop Pay accelerated-checkout button. Wraps Hydrogen's <ShopPayButton>
// so each PDP just passes the selected variant — the storefront domain is
// pulled from the root loader, and the button quietly hides itself if the
// variant is sold out, missing, or no domain is configured (e.g. mock-shop
// in early local dev).
//
// Visual placement: rendered directly under the primary "Add to cart"
// button. Renders as a separator + small caption + the wallet pill so it
// reads as an alternate, not a duplicate of the primary CTA.
import {ShopPayButton} from '@shopify/hydrogen';
import {useRouteLoaderData} from 'react-router';
import type {ProductFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

export function ShopPayExpress({
  selectedVariant,
  className = '',
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className?: string;
}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const storeDomain = data?.publicStoreDomain;

  if (!storeDomain || !selectedVariant?.id || !selectedVariant.availableForSale) {
    return null;
  }

  return (
    <div className={`mt-4 ${className}`}>
      <div className="mb-2 flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span>or check out faster with</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <ShopPayButton
        storeDomain={storeDomain}
        variantIds={[selectedVariant.id]}
        width="100%"
      />
    </div>
  );
}
