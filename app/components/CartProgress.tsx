// Free-shipping progress bar + trust strip for the cart aside.
// Covers CRO Cart Page rows on threshold-progress (row 3) and trust seals (row 11).

const FREE_SHIPPING_THRESHOLD_USD = 60;

const TRUST_BADGES = [
  '🔒 Secure checkout',
  '↩ 30-day returns',
  '⏱ Same-day dispatch',
];

// Minimal structural interface — accepts both raw Storefront cart fragments
// and the optimistic cart returned by useOptimisticCart, which has slightly
// different optional fields.
type CartLike = {
  cost?: {
    subtotalAmount?: {
      amount?: string | null;
      currencyCode?: string | null;
    } | null;
  } | null;
} | null;

export function CartProgress({cart}: {cart: CartLike}) {
  if (!cart || !cart.cost?.subtotalAmount?.amount) return null;
  const amount = Number(cart.cost.subtotalAmount.amount);
  const currency = cart.cost.subtotalAmount.currencyCode ?? '';

  // Threshold logic only kicks in for USD carts; for INR/AED we show a
  // generic shipping note instead of a noisy bar with a wrong number.
  if (currency !== 'USD') {
    return (
      <div className="border-b border-line bg-cream/70 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        Free shipping on qualifying international orders.
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - amount);
  const pct = Math.min(100, (amount / FREE_SHIPPING_THRESHOLD_USD) * 100);

  return (
    <div className="border-b border-line bg-cream/70 px-4 py-4">
      {remaining > 0 ? (
        <p className="text-xs leading-5 text-ink">
          Add{' '}
          <span className="font-display text-base text-brand">
            ${remaining.toFixed(2)}
          </span>{' '}
          more for{' '}
          <span className="font-semibold text-brand">free shipping</span>.
        </p>
      ) : (
        <p className="text-xs leading-5 text-ink">
          ✓ <span className="font-semibold text-brand">Free shipping</span>{' '}
          unlocked. Same-day dispatch on weekday orders before 14:00 IST.
        </p>
      )}
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free shipping progress"
      >
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{width: `${pct}%`}}
        />
      </div>
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        {TRUST_BADGES.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
