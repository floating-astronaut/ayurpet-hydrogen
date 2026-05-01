// Bundle-aware variant picker for GoodGut+. The merchant SKUs are
// 30/60/90 Days at $36/$52/$70, which means the 60- and 90-day SKUs
// are real bundle savings ($0.87/day and $0.78/day vs $1.20/day on
// 30-day) but the generic ProductForm displays them as neutral
// option pills. This picker re-frames each option as a full-width
// card with per-day math + total savings + best-value badge so the
// 90-day SKU reads like a no-brainer.
//
// Falls back to the generic ProductForm shape (uses MappedProductOptions
// from Hydrogen) so it stays in sync with Storefront API data and
// preserves the URL-param variant selection contract.
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
                'group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition sm:px-5 sm:py-4 ' +
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
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add GoodGut+ to cart' : 'Sold out'}
        <span aria-hidden>→</span>
      </AddToCartButton>
    </div>
  );
}
