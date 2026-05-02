// Headless equivalent of Liquid's `<button name="checkout">` express
// checkout. Adds the selected variant to the cart and immediately
// redirects to the resulting cart's checkoutUrl, so the user goes
// straight to Shopify checkout (skipping the cart drawer).
//
// This intentionally does NOT depend on Shop Pay being enabled or the
// storefront being approved for headless Shop Pay, so it works on
// every merchant configuration. Pair with <ShopPayExpress> below it
// for the wallet-pill experience when available.
import {useEffect} from 'react';
import {useNavigation, type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

type FetcherShape = {
  data?: {cart?: {checkoutUrl?: string | null} | null} | null;
};

export function ExpressCheckoutButton({
  selectedVariant,
  className,
  children,
}: {
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className?: string;
  children: React.ReactNode;
}) {
  const lines: Array<OptimisticCartLineInput> =
    selectedVariant?.id
      ? [
          {
            merchandiseId: selectedVariant.id,
            quantity: 1,
            selectedVariant,
          },
        ]
      : [];

  const disabled = !selectedVariant || !selectedVariant.availableForSale;

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<unknown>) => (
        <ExpressInner
          fetcher={fetcher as FetcherWithComponents<unknown> & FetcherShape}
          disabled={disabled}
          className={className}
        >
          {children}
        </ExpressInner>
      )}
    </CartForm>
  );
}

function ExpressInner({
  fetcher,
  disabled,
  className,
  children,
}: {
  fetcher: FetcherWithComponents<unknown> & FetcherShape;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const navigation = useNavigation();

  useEffect(() => {
    const url = fetcher.data?.cart?.checkoutUrl;
    if (fetcher.state === 'idle' && url && typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, [fetcher.state, fetcher.data]);

  const submitting = fetcher.state !== 'idle';
  const redirecting =
    fetcher.state === 'idle' &&
    !!fetcher.data?.cart?.checkoutUrl &&
    navigation.state === 'idle';

  const label = redirecting
    ? 'Redirecting…'
    : submitting
      ? 'Adding to cart…'
      : children;

  return (
    <button
      type="submit"
      disabled={disabled || submitting || redirecting}
      className={className}
    >
      {label}
    </button>
  );
}
