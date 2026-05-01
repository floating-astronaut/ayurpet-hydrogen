// Shipping + Returns explainer. Three columns: dispatch time, delivery
// estimates, returns policy. Covers CRO Product Page rows 105 (length of
// shipping), 106 (cost of shipping), 107 (exchange process), 137 (returns
// policy section).
const PANELS = [
  {
    label: 'Dispatch',
    title: 'Same-day dispatch on weekday orders before 14:00 IST.',
    detail:
      'Weekend orders ship the next working day. Tracking emailed the moment your parcel leaves us.',
  },
  {
    label: 'Delivery',
    title: 'Free over USD 60 — usually 3–7 working days.',
    detail:
      'India: 2–4 working days. International: 3–7 working days. Customs handled at origin where supported.',
  },
  {
    label: 'Returns',
    title: '30-day no-questions returns on unopened items.',
    detail:
      'If your dog disagrees with a chew, email hello@theayurpet.store within 30 days. We refund the full order or send a replacement, your call.',
  },
];

export function ShippingReturns() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PANELS.map((p) => (
            <div key={p.label}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
                {p.label}
              </p>
              <h3 className="mt-3 font-display text-xl leading-[1.2] text-ink sm:text-2xl">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-muted">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
