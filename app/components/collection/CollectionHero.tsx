// Premium collection hero. Sets the merchandising frame for the grid below:
// breadcrumb-style eyebrow, big editorial title, optional description,
// product count + sort indicator, and a subtle gradient backdrop.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  productCount?: number;
  /** Pretty label for the current sort. */
  sort?: string;
  /** Show a "Shop all" link for non-root collections. */
  showShopAllLink?: boolean;
};

export function CollectionHero({
  eyebrow = 'Collection',
  title,
  description,
  productCount,
  sort = 'Best-selling',
  showShopAllLink,
}: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#fdfaf2_0%,#f7f0e1_45%,#ebe0c9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_18%_28%,rgba(74,140,94,0.14),transparent_38%),radial-gradient(circle_at_82%_22%,rgba(217,148,65,0.14),transparent_32%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 lg:pt-20">
        <ScrollReveal kind="rise-soft" className="max-w-4xl">
          {/* Breadcrumb-style eyebrow */}
          <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
            <Link to="/" className="text-ink-muted transition hover:text-ink">
              AyurPet
            </Link>
            <span aria-hidden className="text-ink-muted">
              /
            </span>
            <span>{eyebrow}</span>
          </p>

          <h1 className="mt-5 break-words font-display text-4xl leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-[5.25rem]">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
              {description}
            </p>
          ) : null}
        </ScrollReveal>
      </div>

      {/* Merchandising sub-bar: live product count + current sort */}
      <div className="relative mx-auto mt-12 max-w-7xl border-t border-line/70 px-4 sm:px-6 lg:px-10">
        <div className="flex items-baseline justify-between gap-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
            {typeof productCount === 'number' && productCount > 0
              ? `${productCount} products`
              : 'Loading…'}
          </p>
          <div className="flex items-center gap-4">
            {showShopAllLink ? (
              <Link
                to="/collections/all"
                className="hidden text-[11px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-brand sm:inline-flex"
              >
                Shop all
              </Link>
            ) : null}
            <p className="hidden text-[11px] uppercase tracking-[0.24em] text-ink-muted sm:block">
              Sorted by {sort.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
