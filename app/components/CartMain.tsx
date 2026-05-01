import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartProgress} from './CartProgress';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className="flex h-full flex-col bg-paper"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {!cartHasItems ? <CartEmpty layout={layout} /> : null}

      {cartHasItems ? (
        <>
          <CartProgress cart={cart} />
          <p id="cart-lines" className="sr-only">
            Line items
          </p>
          <ul
            aria-labelledby="cart-lines"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {(cart?.lines?.nodes ?? []).map((line) => {
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
          <CartSummary cart={cart} layout={layout} />
        </>
      ) : null}
    </section>
  );
}

function CartEmpty({layout}: {layout?: CartMainProps['layout']}) {
  const {close} = useAside();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-full bg-cream text-2xl"
      >
        🛒
      </div>
      <p className="mt-5 font-display text-2xl leading-tight text-ink">
        Your bag is empty.
      </p>
      <p className="mt-2 max-w-xs text-[13px] leading-6 text-ink-muted">
        Browse the AyurPet shelf — calming chews, gut support, joint care, and
        more.
      </p>
      <Link
        to="/collections/all"
        onClick={layout === 'aside' ? close : undefined}
        prefetch="viewport"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-paper transition hover:bg-brand-deep"
      >
        Shop the range
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
