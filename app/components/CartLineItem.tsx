// Premium cart line — image left, title + variant + quantity in the middle,
// line price + remove on the right. Designed to read as a curated bag, not
// a default Shopify list. Quantity controls are pill-style stepper buttons;
// remove is a clean text affordance.
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  // Filter out "Default Title" / "Title" noise from variant options
  const meaningfulOptions = selectedOptions.filter(
    (o) => o.value && o.value.toLowerCase() !== 'default title',
  );

  return (
    <li
      key={id}
      className="border-b border-line/60 px-4 py-4 last:border-b-0 sm:px-5"
    >
      <div className="flex items-start gap-4">
        {image ? (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream ring-1 ring-line/60 sm:h-[88px] sm:w-[88px]"
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              sizes="100px"
              className="h-full w-full object-cover"
            />
          </Link>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="min-w-0 flex-1"
            >
              <p className="line-clamp-2 font-display text-[14px] leading-tight text-ink hover:text-brand">
                {product.title}
              </p>
            </Link>
            <Money
              as="span"
              data={line.cost.totalAmount}
              className="shrink-0 font-sans text-[14px] font-bold tracking-tight text-ink"
            />
          </div>

          {meaningfulOptions.length > 0 ? (
            <p className="mt-1 line-clamp-1 text-[11px] text-ink-muted">
              {meaningfulOptions
                .map((o) => `${o.name}: ${o.value}`)
                .join(' · ')}
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton
              lineIds={[id]}
              disabled={!!line.isOptimistic}
            />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="mt-3 ml-24">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="border-l border-line/60 pl-3">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="grid h-8 w-8 place-items-center rounded-l-full text-ink-soft transition hover:text-brand disabled:cursor-not-allowed disabled:text-ink-muted/50"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </CartLineUpdateButton>
      <span
        aria-label={`Quantity ${quantity}`}
        className="min-w-[1.5rem] px-1 text-center text-[12px] font-bold tabular-nums text-ink"
      >
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="grid h-8 w-8 place-items-center rounded-r-full text-ink-soft transition hover:text-brand disabled:cursor-not-allowed disabled:text-ink-muted/50"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted transition hover:text-clay disabled:opacity-50"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
