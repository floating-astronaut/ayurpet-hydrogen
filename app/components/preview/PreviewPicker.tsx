// Premium variant picker for the /preview canvas. Native Pet
// pattern, rebuilt from scratch with clean state-driven layout:
//
//   ┌──────────────────────────┐  ┌─────┐
//   │ 30 Days       ▼          │  │ - 1 +│
//   └──────────────────────────┘  └─────┘
//   ┌──────────────────────────────────┐
//   │ ●  Subscribe & save  [15% off]  $30.60
//   │    Cancel anytime · ships every 30 days  $36
//   │   ┌────────────────────────────┐
//   │   │ ✓ Daily support             │
//   │   │ ✓ Free shipping, always     │
//   │   │ ✓ 15% off every delivery    │
//   │   │ ✓ Cancel anytime, zero pressure │
//   │   │ Cadence: Every 30 days  ▼   │
//   │   └────────────────────────────┘
//   └──────────────────────────────────┘
//   ┌──────────────────────────────────┐
//   │ ○  One-time purchase            $36.00
//   └──────────────────────────────────┘
//   ┌──────────────────────────────────┐
//   │      ADD TO CART · $30.60   →    │
//   └──────────────────────────────────┘
//
// Uses native <select> elements for size + cadence dropdowns
// (styled to feel like custom listboxes via Tailwind). Subscribe/
// one-time choice is two large radio buttons. Quantity stepper is
// a compact - / + control. ATC label updates live with the final
// price including subscribe discount.
//
// Falls back to one-time-only when the active variant has no
// sellingPlanAllocations so the picker degrades gracefully on
// stores without subscriptions configured.
import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

type Variant = ProductFragment['selectedOrFirstAvailableVariant'];

type Props = {
  productOptions: MappedProductOptions[];
  selectedVariant: Variant;
};

export function PreviewPicker({productOptions, selectedVariant}: Props) {
  const navigate = useNavigate();
  const {open} = useAside();

  // ---------------------------------------------------------------------------
  // Size option (the only varying option on this product)
  // ---------------------------------------------------------------------------
  const sizeOption =
    productOptions.find((o) => o.name.toLowerCase() === 'size') ??
    productOptions.find((o) => o.optionValues.length > 1);

  // ---------------------------------------------------------------------------
  // Quantity stepper
  // ---------------------------------------------------------------------------
  const [qty, setQty] = useState<number>(1);
  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const incQty = () => setQty((q) => Math.min(99, q + 1));

  // ---------------------------------------------------------------------------
  // Subscription state
  // ---------------------------------------------------------------------------
  const allocations = useMemo(
    () => selectedVariant?.sellingPlanAllocations?.nodes ?? [],
    [selectedVariant],
  );
  const hasSellingPlans = allocations.length > 0;

  const [mode, setMode] = useState<'subscribe' | 'oneTime'>(
    hasSellingPlans ? 'subscribe' : 'oneTime',
  );
  const [planId, setPlanId] = useState<string | null>(
    hasSellingPlans ? (allocations[0].sellingPlan?.id ?? null) : null,
  );

  const activeAllocation = useMemo(() => {
    if (mode !== 'subscribe' || !planId) return null;
    return allocations.find((a) => a.sellingPlan?.id === planId) ?? null;
  }, [mode, planId, allocations]);

  const oneTimeAmount = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount)
    : null;
  const subscribeAmount = activeAllocation?.priceAdjustments?.[0]?.price?.amount
    ? Number(activeAllocation.priceAdjustments[0].price.amount)
    : null;
  const savingsPct =
    oneTimeAmount && subscribeAmount && subscribeAmount < oneTimeAmount
      ? Math.round((1 - subscribeAmount / oneTimeAmount) * 100)
      : null;

  const finalAmount =
    mode === 'subscribe' && subscribeAmount !== null
      ? subscribeAmount
      : oneTimeAmount;
  const finalLineTotal =
    finalAmount !== null ? (finalAmount * qty).toFixed(2) : null;

  return (
    <div className="space-y-5">
      {/* ----------------------------------------------------------------
          ROW 1 — Size dropdown + Quantity stepper
          ---------------------------------------------------------------- */}
      <div className="flex gap-3">
        {sizeOption ? (
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Size</span>
            <select
              value={
                sizeOption.optionValues.find((v) => v.selected)?.name ??
                sizeOption.optionValues[0].name
              }
              onChange={(e) => {
                const next = sizeOption.optionValues.find(
                  (v) => v.name === e.target.value,
                );
                if (next?.variantUriQuery) {
                  void navigate(`?${next.variantUriQuery}`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }
              }}
              className="block h-14 w-full appearance-none rounded-2xl border border-line bg-paper px-5 pr-12 text-left font-display text-[1.05rem] text-ink transition focus:border-brand focus:outline-none sm:text-[1.1rem]"
            >
              {sizeOption.optionValues.map((v) => {
                const variant = v.firstSelectableVariant;
                const price = variant?.price?.amount
                  ? `$${Number(variant.price.amount).toFixed(0)}`
                  : '';
                return (
                  <option key={v.name} value={v.name} disabled={!v.exists}>
                    {v.name}
                    {price ? ` · ${price}` : ''}
                  </option>
                );
              })}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </label>
        ) : null}

        <div className="flex h-14 shrink-0 items-center rounded-2xl border border-line bg-paper">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={decQty}
            disabled={qty <= 1}
            className="grid h-full w-12 place-items-center text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <span
            className="w-7 text-center font-display text-[1.05rem] tabular-nums text-ink"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={incQty}
            disabled={qty >= 99}
            className="grid h-full w-12 place-items-center text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          ROW 2 — Subscribe card (collapses cleanly when no plans)
          ---------------------------------------------------------------- */}
      {hasSellingPlans ? (
        <SubscribeCard
          allocations={allocations}
          selected={mode === 'subscribe'}
          onSelect={() => setMode('subscribe')}
          planId={planId}
          setPlanId={setPlanId}
          oneTimeAmount={oneTimeAmount}
          subscribeAmount={subscribeAmount}
          savingsPct={savingsPct}
        />
      ) : null}

      {/* ----------------------------------------------------------------
          ROW 3 — One-time
          ---------------------------------------------------------------- */}
      <button
        type="button"
        aria-pressed={mode === 'oneTime'}
        onClick={() => setMode('oneTime')}
        className={
          'flex w-full items-center gap-3.5 rounded-2xl border px-5 py-4 text-left transition ' +
          (mode === 'oneTime'
            ? 'border-brand bg-brand/[0.06] shadow-[0_14px_30px_rgba(45,90,61,0.10)]'
            : 'border-line bg-paper hover:border-brand/40')
        }
      >
        <RadioDot selected={mode === 'oneTime'} />
        <span className="min-w-0 flex-1 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.1rem]">
          One-time purchase
        </span>
        <span className="shrink-0 font-display text-[1.2rem] leading-none text-ink sm:text-[1.3rem]">
          {oneTimeAmount !== null ? `$${oneTimeAmount.toFixed(2)}` : ''}
        </span>
      </button>

      {/* ----------------------------------------------------------------
          ROW 4 — Add to cart
          ---------------------------------------------------------------- */}
      <AddToCartButton
        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-brand px-7 py-4 text-[12.5px] font-bold uppercase tracking-[0.22em] text-paper shadow-[0_18px_40px_rgba(45,90,61,0.18)] transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: qty,
                  selectedVariant,
                  ...(mode === 'subscribe' && planId
                    ? {sellingPlanId: planId}
                    : {}),
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? (
          <>
            <span>Add to cart</span>
            {finalLineTotal ? (
              <span aria-hidden className="opacity-80">
                · ${finalLineTotal}
              </span>
            ) : null}
            <span aria-hidden>→</span>
          </>
        ) : (
          'Sold out'
        )}
      </AddToCartButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SubscribeCard — large card with autoship radio at top, four-up benefits +
// cadence dropdown revealed when selected. Mirrors Native Pet's "The Daily"
// autoship UX one-for-one.
// ---------------------------------------------------------------------------
type Allocation = NonNullable<
  NonNullable<Variant>['sellingPlanAllocations']
>['nodes'][number];

function SubscribeCard({
  allocations,
  selected,
  onSelect,
  planId,
  setPlanId,
  oneTimeAmount,
  subscribeAmount,
  savingsPct,
}: {
  allocations: Allocation[];
  selected: boolean;
  onSelect: () => void;
  planId: string | null;
  setPlanId: (id: string | null) => void;
  oneTimeAmount: number | null;
  subscribeAmount: number | null;
  savingsPct: number | null;
}) {
  return (
    <div
      className={
        'overflow-hidden rounded-2xl border transition ' +
        (selected
          ? 'border-brand bg-brand/[0.06] shadow-[0_14px_30px_rgba(45,90,61,0.10)]'
          : 'border-line bg-paper')
      }
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
      >
        <RadioDot selected={selected} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-[1.05rem] leading-tight text-ink sm:text-[1.1rem]">
              Subscribe &amp; save
            </span>
            {savingsPct ? (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-brand">
                {savingsPct}% off
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-[12.5px] leading-snug text-ink-soft">
            Cancel or skip anytime · ships automatically
          </span>
        </span>
        <span className="shrink-0 text-right">
          {subscribeAmount !== null ? (
            <span className="block font-display text-[1.2rem] leading-none text-ink sm:text-[1.3rem]">
              ${subscribeAmount.toFixed(2)}
            </span>
          ) : null}
          {oneTimeAmount !== null && subscribeAmount !== null && oneTimeAmount > subscribeAmount ? (
            <span className="mt-1 block text-[11.5px] text-ink-muted line-through">
              ${oneTimeAmount.toFixed(2)}
            </span>
          ) : null}
        </span>
      </button>

      {selected ? (
        <div className="border-t border-brand/15 bg-paper/60 px-5 py-4">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12.5px] leading-snug text-ink-soft sm:text-[13px]">
            {[
              'Daily support, made easy',
              'Free shipping, always',
              `${savingsPct ?? 15}% off every delivery`,
              'Cancel anytime, zero pressure',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-brand">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {allocations.length > 1 ? (
            <label className="relative mt-4 block">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-ink-muted">
                Cadence
              </span>
              <select
                value={planId ?? ''}
                onChange={(e) => setPlanId(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5 block h-11 w-full appearance-none rounded-xl border border-line bg-paper pl-4 pr-10 text-[13.5px] text-ink focus:border-brand focus:outline-none"
              >
                {allocations.map((a) => (
                  <option key={a.sellingPlan.id} value={a.sellingPlan.id}>
                    {a.sellingPlan.name}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 bottom-3.5 text-ink-muted"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </label>
          ) : (
            <p className="mt-3 text-[11.5px] leading-snug text-ink-muted">
              Ships {allocations[0]?.sellingPlan.name?.toLowerCase() ?? 'on a recurring schedule'} · easy to skip, pause, or cancel from your account.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function RadioDot({selected}: {selected: boolean}) {
  return (
    <span
      aria-hidden
      className={
        'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ' +
        (selected ? 'border-brand bg-brand' : 'border-line bg-paper')
      }
    >
      {selected ? <span className="h-1.5 w-1.5 rounded-full bg-paper" /> : null}
    </span>
  );
}
