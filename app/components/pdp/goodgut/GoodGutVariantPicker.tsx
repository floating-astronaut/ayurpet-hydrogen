// Bundle-aware variant picker for GoodGut+ + Seal-driven subscription
// option. Two stacked decisions inside one card:
//
//   1. Pack size — 30 / 60 / 90 Days as full-width radio cards with
//      per-day math + total-savings + best-value badge so the 90-day
//      SKU reads as a no-brainer (the original picker job).
//   2. Receipt mode — Subscribe vs one-time, mirroring the Native Pet
//      "The Daily" autoship UX. Pre-selects subscribe when the
//      Storefront API returns sellingPlanAllocations on the current
//      variant. The four-up benefit grid + cadence dropdown only
//      render when the variant actually has selling plans configured
//      via Seal — so this component degrades gracefully on stores
//      without subscriptions enabled.
//
// Falls back to the generic ProductForm shape (uses MappedProductOptions
// from Hydrogen) so it stays in sync with Storefront API data and
// preserves the URL-param variant selection contract.
import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

type Variant = ProductFragment['selectedOrFirstAvailableVariant'];

export function daysFromTitle(title: string | null | undefined): number | null {
  if (!title) return null;
  const m = title.match(/(\d+)\s*Days?/i);
  return m ? Number(m[1]) : null;
}

export function pricePerDay(amount: string, days: number) {
  return Number(amount) / days;
}

export function GoodGutVariantPicker({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: Variant;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  // Pick the Size option (the only varying option on this product).
  const sizeOption =
    productOptions.find((o) => o.name.toLowerCase() === 'size') ??
    productOptions.find((o) => o.optionValues.length > 1);

  // Anchor for "save vs monthly" math: the 30-day option's per-day price.
  const monthlyAnchor = (() => {
    if (!sizeOption) return null;
    const monthly = sizeOption.optionValues.find(
      (v) => daysFromTitle(v.name) === 30,
    );
    if (!monthly?.firstSelectableVariant?.price) return null;
    return Number(monthly.firstSelectableVariant.price.amount) / 30;
  })();

  // Most days = best value.
  const bestValueName = sizeOption
    ? sizeOption.optionValues
        .map((v) => ({name: v.name, days: daysFromTitle(v.name) ?? 0}))
        .reduce<{name: string; days: number}>(
          (acc, v) => (v.days > acc.days ? v : acc),
          {name: '', days: 0},
        ).name
    : '';

  // ---------------------------------------------------------------------------
  // Subscription state
  // ---------------------------------------------------------------------------
  const allocations = useMemo(
    () => selectedVariant?.sellingPlanAllocations?.nodes ?? [],
    [selectedVariant],
  );
  const hasSellingPlans = allocations.length > 0;

  const [purchaseMode, setPurchaseMode] = useState<'subscribe' | 'oneTime'>(
    hasSellingPlans ? 'subscribe' : 'oneTime',
  );
  const [planId, setPlanId] = useState<string | null>(
    hasSellingPlans
      ? (allocations[0].sellingPlan?.id ?? null)
      : null,
  );

  // The Storefront API gives us each plan's adjusted price per
  // allocation. We use the first priceAdjustments entry — for typical
  // Seal configs (single recurring delivery price) that's the
  // subscription price the customer pays each cycle.
  const activeAllocation = useMemo(() => {
    if (purchaseMode !== 'subscribe' || !planId) return null;
    return allocations.find((a) => a.sellingPlan?.id === planId) ?? null;
  }, [purchaseMode, planId, allocations]);

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
    purchaseMode === 'subscribe' && subscribeAmount !== null
      ? subscribeAmount
      : oneTimeAmount;

  return (
    <div className="space-y-5">
      {sizeOption ? (
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
              Choose your supply
            </h3>
            <p className="text-[11px] text-ink-muted">
              {monthlyAnchor
                ? `Anchor · $${monthlyAnchor.toFixed(2)}/day on monthly`
                : ''}
            </p>
          </div>

          <ul className="mt-3 space-y-2.5">
            {sizeOption.optionValues.map((v) => {
              const days = daysFromTitle(v.name) ?? 0;
              const variant = v.firstSelectableVariant;
              const price = variant?.price?.amount
                ? Number(variant.price.amount)
                : null;
              const compareAt = variant?.compareAtPrice?.amount
                ? Number(variant.compareAtPrice.amount)
                : null;
              const perDay = price && days ? pricePerDay(String(price), days) : null;
              const savesVsMonthly =
                price && days && monthlyAnchor
                  ? Math.max(0, monthlyAnchor * days - price)
                  : 0;
              const isBestValue =
                v.name === bestValueName && (sizeOption.optionValues.length ?? 0) > 1;
              const selected = !!v.selected;

              const wrapClass =
                'group relative flex w-full items-center gap-3.5 rounded-2xl border px-5 py-4 text-left transition ' +
                (selected
                  ? 'border-brand bg-brand/[0.06] shadow-[0_14px_30px_rgba(45,90,61,0.10)]'
                  : 'border-line bg-paper/80 hover:border-brand/40 hover:bg-paper');

              const inner = (
                <>
                  {/* Radio dot */}
                  <span
                    aria-hidden
                    className={
                      'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ' +
                      (selected
                        ? 'border-brand bg-brand'
                        : 'border-line bg-paper group-hover:border-brand/50')
                    }
                  >
                    {selected ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                    ) : null}
                  </span>

                  {/* Title + per-day */}
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-display text-[1.05rem] leading-tight text-ink sm:text-[1.15rem]">
                        {v.name} supply
                      </span>
                      {isBestValue ? (
                        <span className="rounded-full bg-clay px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-paper">
                          Best value
                        </span>
                      ) : null}
                      {savesVsMonthly > 0 ? (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-brand">
                          Save ${Math.round(savesVsMonthly)}
                        </span>
                      ) : null}
                    </span>
                    {perDay ? (
                      <span className="mt-1 block text-[12.5px] leading-snug text-ink-soft">
                        ${perDay.toFixed(2)} / day
                        {days ? <> · {days} drops {days >= 30 ? 'rituals' : ''}</> : null}
                      </span>
                    ) : null}
                  </span>

                  {/* Price column */}
                  <span className="shrink-0 text-right">
                    {price !== null ? (
                      <span className="block font-display text-[1.25rem] leading-none text-ink sm:text-[1.35rem]">
                        ${price.toFixed(0)}
                      </span>
                    ) : null}
                    {compareAt && compareAt > (price ?? 0) ? (
                      <span className="mt-1 block text-[11.5px] text-ink-muted line-through">
                        ${compareAt.toFixed(0)}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              if (!v.exists) {
                return (
                  <li key={v.name}>
                    <button
                      type="button"
                      disabled
                      className={wrapClass}
                      style={{opacity: 0.45}}
                      aria-disabled
                    >
                      {inner}
                    </button>
                  </li>
                );
              }

              return (
                <li key={v.name}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    className={wrapClass}
                    onClick={() => {
                      if (!selected && v.variantUriQuery) {
                        void navigate(`?${v.variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {inner}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* SUBSCRIBE vs ONE-TIME — only renders when Seal has selling
          plans configured for this variant. Pre-selects subscribe.
          Matches the Native Pet "The Daily" autoship pattern. */}
      {hasSellingPlans ? (
        <SubscribeBlock
          allocations={allocations}
          purchaseMode={purchaseMode}
          setPurchaseMode={setPurchaseMode}
          planId={planId}
          setPlanId={setPlanId}
          oneTimeAmount={oneTimeAmount}
          subscribeAmount={subscribeAmount}
          savingsPct={savingsPct}
        />
      ) : null}

      <AddToCartButton
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper shadow-[0_18px_40px_rgba(45,90,61,0.18)] transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                  ...(purchaseMode === 'subscribe' && planId
                    ? {sellingPlanId: planId}
                    : {}),
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale
          ? purchaseMode === 'subscribe'
            ? `Subscribe · $${(finalAmount ?? 0).toFixed(2)}`
            : 'Add GoodGut+ to cart'
          : 'Sold out'}
        <span aria-hidden>→</span>
      </AddToCartButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SubscribeBlock — light-cream card with the autoship radio at the top,
// 4-up benefits inside, an inline cadence picker, and a one-time radio
// at the bottom. Only renders when the active variant has selling
// plans (selectedVariant.sellingPlanAllocations).
// ---------------------------------------------------------------------------
type Allocation = NonNullable<
  NonNullable<Variant>['sellingPlanAllocations']
>['nodes'][number];

function SubscribeBlock({
  allocations,
  purchaseMode,
  setPurchaseMode,
  planId,
  setPlanId,
  oneTimeAmount,
  subscribeAmount,
  savingsPct,
}: {
  allocations: Allocation[];
  purchaseMode: 'subscribe' | 'oneTime';
  setPurchaseMode: (m: 'subscribe' | 'oneTime') => void;
  planId: string | null;
  setPlanId: (id: string | null) => void;
  oneTimeAmount: number | null;
  subscribeAmount: number | null;
  savingsPct: number | null;
}) {
  const subscribeSelected = purchaseMode === 'subscribe';

  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
        How would you like to receive it?
      </h3>

      {/* AUTOSHIP card */}
      <button
        type="button"
        aria-pressed={subscribeSelected}
        onClick={() => setPurchaseMode('subscribe')}
        className={
          'mt-3 block w-full overflow-hidden rounded-2xl border text-left transition ' +
          (subscribeSelected
            ? 'border-brand bg-brand/[0.06] shadow-[0_14px_30px_rgba(45,90,61,0.10)]'
            : 'border-line bg-paper/80 hover:border-brand/40')
        }
      >
        <div className="flex items-center gap-3.5 px-5 py-4">
          <span
            aria-hidden
            className={
              'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ' +
              (subscribeSelected
                ? 'border-brand bg-brand'
                : 'border-line bg-paper')
            }
          >
            {subscribeSelected ? (
              <span className="h-1.5 w-1.5 rounded-full bg-paper" />
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-display text-[1.05rem] leading-tight text-ink sm:text-[1.15rem]">
                Subscribe &amp; save
                {savingsPct ? (
                  <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.22em] text-brand">
                    {savingsPct}% off
                  </span>
                ) : null}
              </span>
            </span>
            <span className="mt-1 block text-[12.5px] leading-snug text-ink-soft">
              Cancel or skip anytime · ships automatically
            </span>
          </span>
          <span className="shrink-0 text-right">
            {subscribeAmount !== null ? (
              <span className="block font-display text-[1.25rem] leading-none text-ink sm:text-[1.35rem]">
                ${subscribeAmount.toFixed(2)}
              </span>
            ) : null}
            {oneTimeAmount !== null && subscribeAmount !== null && oneTimeAmount > subscribeAmount ? (
              <span className="mt-1 block text-[11.5px] text-ink-muted line-through">
                ${oneTimeAmount.toFixed(2)}
              </span>
            ) : null}
          </span>
        </div>

        {/* Reveal-on-select benefits + cadence row */}
        {subscribeSelected ? (
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

            {/* Cadence picker — only shown when more than one selling
                plan exists (e.g., monthly / bi-monthly). For a single
                cadence the row hides. */}
            {allocations.length > 1 ? (
              <label className="mt-4 block">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-ink-muted">
                  Cadence
                </span>
                <select
                  value={planId ?? ''}
                  onChange={(e) => setPlanId(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1.5 block w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-[13.5px] text-ink focus:border-brand focus:outline-none"
                >
                  {allocations.map((a) => (
                    <option key={a.sellingPlan.id} value={a.sellingPlan.id}>
                      {a.sellingPlan.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="mt-3 text-[11.5px] leading-snug text-ink-muted">
                Ships {allocations[0]?.sellingPlan.name?.toLowerCase() ?? 'on a recurring schedule'} · easy to skip, pause, or cancel from your account.
              </p>
            )}
          </div>
        ) : null}
      </button>

      {/* ONE-TIME card */}
      <button
        type="button"
        aria-pressed={!subscribeSelected}
        onClick={() => setPurchaseMode('oneTime')}
        className={
          'mt-2.5 flex w-full items-center gap-3.5 rounded-2xl border px-5 py-4 text-left transition ' +
          (!subscribeSelected
            ? 'border-brand bg-brand/[0.06] shadow-[0_14px_30px_rgba(45,90,61,0.10)]'
            : 'border-line bg-paper/80 hover:border-brand/40')
        }
      >
        <span
          aria-hidden
          className={
            'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ' +
            (!subscribeSelected
              ? 'border-brand bg-brand'
              : 'border-line bg-paper')
          }
        >
          {!subscribeSelected ? (
            <span className="h-1.5 w-1.5 rounded-full bg-paper" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.15rem]">
          One-time purchase
        </span>
        <span className="shrink-0 font-display text-[1.25rem] leading-none text-ink sm:text-[1.35rem]">
          {oneTimeAmount !== null ? `$${oneTimeAmount.toFixed(2)}` : ''}
        </span>
      </button>
    </div>
  );
}
