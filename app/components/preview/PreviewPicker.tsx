// Premium variant picker for the /preview canvas. Native Pet "The
// Daily" anatomy, transposed onto AyurPet brand tokens. Component
// structure deliberately mirrors the reference one-for-one — the
// only translation is brand colour (green/cream instead of blue).
//
// Anatomy:
//   ┌─────────────────────────────┐ ┌───────┐
//   │ 30 Days · $36          ▼    │ │ - 1 + │
//   └─────────────────────────────┘ └───────┘
//
//   ┌────────────────────────────────────────┐ ← unified purchase card
//   │ TINTED green/cream area (subscribe):   │   single border, overflow-
//   │  ●  15% off with autoship   $36 $30.60 │   hidden, both rows feel
//   │                                        │   connected.
//   │  ┌──────┐ ┌──────┐                     │
//   │  │ icon │ │ icon │  daily / free       │
//   │  └──────┘ └──────┘  ship / 15% off     │
//   │  ┌──────┐ ┌──────┐  cancel anytime     │
//   │  │ icon │ │ icon │                     │
//   │  └──────┘ └──────┘                     │
//   │                                        │
//   │  ┌────────────────────────────────┐    │  ← cadence dropdown
//   │  │ Every 30 days              ▼   │    │     full-width white
//   │  └────────────────────────────────┘    │
//   │                                        │
//   │  Easily skip, pause, or cancel from    │  ← centered helper text
//   │  your account.                         │
//   ├────────────────────────────────────────┤  ← horizontal border
//   │ WHITE area (one-time):                 │
//   │  ○  One-time purchase           $36.00 │
//   └────────────────────────────────────────┘
//
//   ┌────────────────────────────────────────┐
//   │       ADD TO CART · $30.60   →         │  ← full-width pill
//   └────────────────────────────────────────┘
//
// Falls back to one-time-only if sellingPlanAllocations is empty
// (Seal not configured for the variant).
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

  // Size option (the only varying option on this product)
  const sizeOption =
    productOptions.find((o) => o.name.toLowerCase() === 'size') ??
    productOptions.find((o) => o.optionValues.length > 1);

  // Quantity stepper
  const [qty, setQty] = useState<number>(1);
  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const incQty = () => setQty((q) => Math.min(99, q + 1));

  // Subscription state
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
    if (!planId) return null;
    return allocations.find((a) => a.sellingPlan?.id === planId) ?? null;
  }, [planId, allocations]);

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

  const subscribeSelected = mode === 'subscribe';

  return (
    <div className="space-y-5">
      {/* ----------------------------------------------------------------
          ROW 1 — Size dropdown + Quantity stepper, ~56px tall, 14px gap
          ---------------------------------------------------------------- */}
      <div className="flex gap-3.5">
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
            <Chevron className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-muted" />
          </label>
        ) : null}

        <div className="flex h-14 w-[7.25rem] shrink-0 items-center rounded-2xl border border-line bg-paper">
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
          ROW 2 — Unified purchase choice card. Subscribe section on
          top with tinted brand-green background, attached one-time row
          below separated by a horizontal border. Single rounded outer
          container with overflow-hidden so the two rows feel connected.
          ---------------------------------------------------------------- */}
      <div className="overflow-hidden rounded-[20px] border border-brand/25 shadow-[0_18px_44px_rgba(31,26,20,0.06)]">
        {/* SUBSCRIBE area */}
        <div
          className={
            'transition-colors ' +
            (subscribeSelected
              ? 'bg-brand/[0.07]'
              : 'bg-paper')
          }
        >
          <button
            type="button"
            aria-pressed={subscribeSelected}
            onClick={() => hasSellingPlans && setMode('subscribe')}
            disabled={!hasSellingPlans}
            className="flex w-full items-center gap-3.5 p-5 text-left sm:p-6 disabled:cursor-not-allowed"
          >
            <RadioDot selected={subscribeSelected} />
            <span className="min-w-0 flex-1 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">
              {savingsPct ? `${savingsPct}% off with autoship` : 'Subscribe & save'}
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              {oneTimeAmount !== null && subscribeAmount !== null && oneTimeAmount > subscribeAmount ? (
                <span className="text-[13px] text-ink-muted line-through sm:text-[14px]">
                  ${oneTimeAmount.toFixed(2)}
                </span>
              ) : null}
              <span className="font-display text-[1.2rem] leading-none text-ink sm:text-[1.35rem]">
                ${(subscribeAmount ?? oneTimeAmount ?? 0).toFixed(2)}
              </span>
            </span>
          </button>

          {subscribeSelected && hasSellingPlans ? (
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              {/* 2x2 benefit grid — centered icons above labels */}
              <ul className="mx-auto grid max-w-md grid-cols-2 gap-x-6 gap-y-5">
                {[
                  {Icon: ShieldIcon, label: 'Daily support, made easy'},
                  {Icon: TruckIcon, label: 'Free shipping, always'},
                  {
                    Icon: PercentIcon,
                    label: `${savingsPct ?? 15}% off every delivery`,
                  },
                  {Icon: CycleIcon, label: 'Cancel anytime, zero pressure'},
                ].map(({Icon, label}) => (
                  <li
                    key={label}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      aria-hidden
                      className="grid h-11 w-11 place-items-center rounded-full bg-brand/15 text-brand"
                    >
                      <Icon />
                    </span>
                    <span className="text-[12px] font-semibold leading-tight text-ink sm:text-[12.5px]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Cadence dropdown — full-width, white, inside tinted area */}
              <label className="relative mt-5 block">
                <span className="sr-only">Delivery frequency</span>
                <select
                  value={planId ?? ''}
                  onChange={(e) => setPlanId(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="block h-12 w-full appearance-none rounded-xl border border-line/70 bg-paper px-4 pr-10 text-left text-[14px] text-ink focus:border-brand focus:outline-none"
                >
                  {allocations.map((a) => (
                    <option key={a.sellingPlan.id} value={a.sellingPlan.id}>
                      {a.sellingPlan.name}
                    </option>
                  ))}
                </select>
                <Chevron className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              </label>

              {/* Helper text — centered, muted */}
              <p className="mx-auto mt-3 max-w-sm text-center text-[12px] leading-snug text-ink-muted sm:text-[12.5px]">
                Easily skip, pause, or cancel anytime in your account.
              </p>
            </div>
          ) : null}
        </div>

        {/* ONE-TIME row — attached to same card via border-top, white bg */}
        <button
          type="button"
          aria-pressed={!subscribeSelected}
          onClick={() => setMode('oneTime')}
          className="flex min-h-[78px] w-full items-center gap-3.5 border-t border-brand/15 bg-paper px-5 py-5 text-left transition hover:bg-paper/80 sm:px-6 sm:min-h-[84px]"
        >
          <RadioDot selected={!subscribeSelected} />
          <span className="min-w-0 flex-1 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.15rem]">
            One-time purchase
          </span>
          <span className="shrink-0 font-display text-[1.2rem] leading-none text-ink sm:text-[1.3rem]">
            {oneTimeAmount !== null ? `$${oneTimeAmount.toFixed(2)}` : ''}
          </span>
        </button>
      </div>

      {/* ----------------------------------------------------------------
          ROW 3 — Add to cart pill, full-width, soft underlay shadow
          ---------------------------------------------------------------- */}
      <AddToCartButton
        className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full bg-brand px-7 text-[13px] font-bold uppercase tracking-[0.24em] text-paper shadow-[0_22px_50px_rgba(45,90,61,0.22)] transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13.5px]"
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
// Bits
// ---------------------------------------------------------------------------
function RadioDot({selected}: {selected: boolean}) {
  return (
    <span
      aria-hidden
      className={
        'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ' +
        (selected ? 'border-brand bg-brand' : 'border-line bg-paper')
      }
    >
      {selected ? <span className="h-2 w-2 rounded-full bg-paper" /> : null}
    </span>
  );
}

function Chevron({className = ''}: {className?: string}) {
  return (
    <span aria-hidden className={`pointer-events-none ${className}`}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// 4 benefit icons. Centered above their labels in the 2x2 grid.
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l8 2.4v6.4c0 5-3.5 8.8-8 10.2-4.5-1.4-8-5.2-8-10.2V4.9l8-2.4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 12.3L11 14.8l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 7h12v9H2zM14 10h5l3 3v3h-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="6.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function PercentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 19L19 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="16.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function CycleIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 0114-7.5L21 7M21 12a9 9 0 01-14 7.5L3 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v4h-4M3 21v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
