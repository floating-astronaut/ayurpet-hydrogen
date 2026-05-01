// Premium cart summary — totals + collapsed discount/gift inputs +
// full-width brand checkout button + secure-checkout reassurance row.
// Designed to feel pinned at the bottom of the drawer / page.
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <div
      aria-labelledby={summaryId}
      className={
        'border-t border-line bg-paper px-4 py-5 sm:px-5 ' +
        (layout === 'aside'
          ? 'sticky bottom-0 shadow-[0_-12px_30px_rgba(31,26,20,0.08)]'
          : '')
      }
    >
      <h4 id={summaryId} className="sr-only">
        Cart totals
      </h4>

      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />

      <dl className="mt-3 flex items-baseline justify-between border-t border-line/70 pt-3">
        <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-muted">
          Subtotal
        </dt>
        <dd className="font-display text-[1.5rem] leading-none tracking-tight text-ink">
          {subtotal?.amount ? (
            <Money as="span" data={subtotal} />
          ) : (
            <span>—</span>
          )}
        </dd>
      </dl>
      <p className="mt-1.5 text-[11px] text-ink-muted">
        Tax included · Shipping calculated at checkout
      </p>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      <ul className="mt-4 grid grid-cols-3 gap-3 border-t border-line/60 pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        <li className="inline-flex items-center justify-center gap-1.5">
          <span aria-hidden>🔒</span> Secure checkout
        </li>
        <li className="inline-flex items-center justify-center gap-1.5">
          <span aria-hidden>↩</span> 30-day returns
        </li>
        <li className="inline-flex items-center justify-center gap-1.5">
          <span aria-hidden>⏱</span> Same-day dispatch
        </li>
      </ul>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-paper shadow-[0_14px_30px_rgba(45,90,61,0.28)] transition hover:bg-brand-deep"
    >
      Continue to checkout
      <span aria-hidden>→</span>
    </a>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];
  const [open, setOpen] = useState(codes.length > 0);

  return (
    <section aria-label="Discounts" className="border-b border-line/60 pb-3">
      {codes.length ? (
        <UpdateDiscountForm>
          <div
            className="flex items-center justify-between gap-3 rounded-xl bg-cream/70 px-3 py-2"
            role="group"
            aria-labelledby={discountsHeadingId}
          >
            <div className="min-w-0">
              <p id={discountsHeadingId} className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                Discount applied
              </p>
              <code className="block truncate font-sans text-[12px] text-ink">
                {codes.join(', ')}
              </code>
            </div>
            <button
              type="submit"
              aria-label="Remove discount"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted transition hover:text-clay"
            >
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      ) : (
        <details
          open={open}
          onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
          className="group"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-ink-muted [&::-webkit-details-marker]:hidden">
            <span>Have a discount code?</span>
            <span aria-hidden className="text-[14px] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <UpdateDiscountForm discountCodes={codes}>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor={discountCodeInputId} className="sr-only">
                Discount code
              </label>
              <input
                id={discountCodeInputId}
                type="text"
                name="discountCode"
                placeholder="Enter code"
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2 text-[13px] text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Apply discount code"
                className="rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition hover:bg-brand"
              >
                Apply
              </button>
            </div>
          </UpdateDiscountForm>
        </details>
      )}
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);
  const hasGifts = !!giftCardCodes && giftCardCodes.length > 0;
  const [open, setOpen] = useState(hasGifts);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Gift cards" className="border-b border-line/60 py-3">
      {hasGifts ? (
        <dl className="space-y-2">
          <dt
            id={giftCardHeadingId}
            className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand"
          >
            Applied gift cards
          </dt>
          {giftCardCodes!.map((giftCard) => (
            <dd
              key={giftCard.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-cream/70 px-3 py-2"
            >
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code className="block font-sans text-[12px] text-ink">
                  ***{giftCard.lastCharacters}
                </code>
                <Money
                  as="span"
                  data={giftCard.amountUsed}
                  className="block text-[11px] text-ink-muted"
                />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      ) : (
        <details
          open={open}
          onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
          className="group"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-ink-muted [&::-webkit-details-marker]:hidden">
            <span>Apply a gift card</span>
            <span aria-hidden className="text-[14px] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <AddGiftCardForm fetcherKey="gift-card-add">
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor={giftCardInputId} className="sr-only">
                Gift card code
              </label>
              <input
                id={giftCardInputId}
                type="text"
                name="giftCardCode"
                placeholder="Gift card code"
                ref={giftCardCodeInput}
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2 text-[13px] text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={giftCardAddFetcher.state !== 'idle'}
                aria-label="Apply gift card code"
                className="rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition hover:bg-brand disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </AddGiftCardForm>
        </details>
      )}
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      <div className="flex flex-1 items-center justify-between gap-3">
        <div className="min-w-0">{children}</div>
        <button
          type="submit"
          aria-label={`Remove gift card ending in ${lastCharacters}`}
          onClick={onRemoveClick}
          ref={buttonRef}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted transition hover:text-clay"
        >
          Remove
        </button>
      </div>
    </CartForm>
  );
}
