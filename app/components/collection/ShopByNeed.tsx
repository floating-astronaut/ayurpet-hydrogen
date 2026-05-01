// "Shop by need" chip row. Sits between the collection hero and the product
// grid. Each chip is a real link to a curated collection (or to /collections/all
// with a search hint when a dedicated collection isn't set up yet). Active
// chip is highlighted via the optional activeHandle prop.
import {Link} from 'react-router';

type Need = {
  label: string;
  emoji: string;
  to: string;
  /** When this need is the active context for the page, the chip pops. */
  matchHandles?: string[];
};

const NEEDS: Need[] = [
  {label: 'Calming', emoji: '🌙', to: '/collections/calming', matchHandles: ['calming']},
  {label: 'Gut support', emoji: '🌱', to: '/collections/gut-support', matchHandles: ['gut-support', 'gut']},
  {label: 'Dental chew', emoji: '🦴', to: '/collections/yak-chews', matchHandles: ['yak-chews', 'chews']},
  {label: 'Joint care', emoji: '🐾', to: '/collections/joint-care', matchHandles: ['joint-care', 'joint']},
  {label: 'Bundles', emoji: '✨', to: '/collections/bundles', matchHandles: ['bundles']},
];

export function ShopByNeed({
  activeHandle,
  className,
}: {
  activeHandle?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Shop by need"
      className={`relative border-b border-line bg-paper ${className ?? ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 py-4 sm:-mx-6 sm:px-6 sm:py-5 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          <p className="hidden shrink-0 self-center text-[11px] font-semibold uppercase tracking-[0.32em] text-ink-muted sm:inline-flex">
            Shop by need
          </p>
          <span aria-hidden className="hidden self-center text-line sm:inline">
            ·
          </span>
          {NEEDS.map((need) => {
            const isActive = activeHandle
              ? need.matchHandles?.some((h) =>
                  activeHandle.toLowerCase().includes(h),
                )
              : false;
            return (
              <Link
                key={need.label}
                to={need.to}
                prefetch="intent"
                className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold tracking-wide transition ${
                  isActive
                    ? 'border-brand bg-brand text-paper shadow-[0_8px_24px_rgba(45,90,61,0.18)]'
                    : 'border-line bg-white text-ink hover:border-brand hover:text-brand'
                }`}
              >
                <span aria-hidden>{need.emoji}</span>
                {need.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
