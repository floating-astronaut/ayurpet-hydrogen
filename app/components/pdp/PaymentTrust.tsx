// Payment-method strip + secure-checkout micro-copy. Covers CRO Product
// Page rows 80 (payment logos visible) + 81 (security text under the
// logos). Pure inline SVG — no third-party badge images to maintain.
type Brand = {label: string; svg: JSX.Element};

const BRANDS: Brand[] = [
  {
    label: 'Visa',
    svg: (
      <svg viewBox="0 0 60 24" aria-hidden role="img" className="h-6 w-auto">
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="18"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    label: 'Mastercard',
    svg: (
      <svg viewBox="0 0 44 28" aria-hidden role="img" className="h-6 w-auto">
        <circle cx="16" cy="14" r="9" fill="currentColor" opacity="0.85" />
        <circle cx="28" cy="14" r="9" fill="currentColor" opacity="0.55" />
      </svg>
    ),
  },
  {
    label: 'American Express',
    svg: (
      <svg viewBox="0 0 50 24" aria-hidden role="img" className="h-6 w-auto">
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="14"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.5"
        >
          AMEX
        </text>
      </svg>
    ),
  },
  {
    label: 'PayPal',
    svg: (
      <svg viewBox="0 0 70 24" aria-hidden role="img" className="h-6 w-auto">
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0"
        >
          PayPal
        </text>
      </svg>
    ),
  },
  {
    label: 'Shop Pay',
    svg: (
      <svg viewBox="0 0 80 24" aria-hidden role="img" className="h-6 w-auto">
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0"
        >
          Shop Pay
        </text>
      </svg>
    ),
  },
  {
    label: 'Apple Pay',
    svg: (
      <svg viewBox="0 0 80 24" aria-hidden role="img" className="h-6 w-auto">
        <text
          x="0"
          y="18"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0"
        >
           Pay
        </text>
      </svg>
    ),
  },
];

export function PaymentTrust() {
  return (
    <div className="rounded-[1.25rem] border border-line bg-cream/60 p-5 sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink-muted">
        Secure checkout
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-ink/80">
        {BRANDS.map((b) => (
          <span
            key={b.label}
            aria-label={b.label}
            className="inline-flex items-center"
          >
            {b.svg}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs leading-6 text-ink-muted">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-brand" aria-hidden>
          <path
            d="M5 9V6a5 5 0 0 1 10 0v3M4 9h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        Your transaction is secure. We respect your privacy and never store
        card details on our servers — checkout runs through Shopify’s
        PCI-compliant payment infrastructure.
      </p>
    </div>
  );
}
