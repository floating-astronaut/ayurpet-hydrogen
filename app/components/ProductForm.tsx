import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {ExpressCheckoutButton} from './ExpressCheckoutButton';
import {ShopPayExpress} from './ShopPayExpress';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="space-y-3" key={option.name}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">{option.name}</h3>
              <p className="text-xs text-ink-muted">Choose what fits your routine</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;
                const itemClass = selected
                  ? 'min-h-12 min-w-[5.5rem] flex-1 basis-[7rem] rounded-2xl border-2 border-clay bg-clay/10 px-3 py-3 text-left text-brand shadow-[0_12px_30px_rgba(184,94,62,0.12)] sm:flex-initial'
                  : 'min-h-12 min-w-[5.5rem] flex-1 basis-[7rem] rounded-2xl border border-line bg-white/80 px-3 py-3 text-left text-ink transition hover:border-clay hover:bg-white sm:flex-initial';

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={itemClass}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{opacity: available ? 1 : 0.35}}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={itemClass}
                    key={option.name + name}
                    style={{opacity: available ? 1 : 0.35}}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper shadow-[0_18px_40px_rgba(45,90,61,0.18)] transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
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
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      <ExpressCheckoutButton
        selectedVariant={selectedVariant}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-paper transition hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buy it now <span aria-hidden>→</span>
      </ExpressCheckoutButton>

      <ShopPayExpress selectedVariant={selectedVariant} />
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span className="text-sm font-semibold leading-tight">{name}</span>;

  return (
    <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
      <span
        aria-label={name}
        className="inline-flex h-5 w-5 overflow-hidden rounded-full border border-line"
        style={{backgroundColor: color || 'transparent'}}
      >
        {!!image && <img src={image} alt="" className="h-full w-full object-cover" />}
      </span>
      {name}
    </span>
  );
}
