import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

type FooterMenuItem = {id: string; title: string; url?: string | null};

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

const SHOP_LINKS = [
  {to: '/collections/all', label: 'All products'},
  {to: '/collections/supplements', label: 'Supplements'},
  {to: '/collections/yak-chews', label: 'Yak chews'},
  {to: '/collections/bundles', label: 'Bundles'},
];

const HELP_LINKS = [
  {to: '/pages/about', label: 'About AyurPet'},
  {to: '/policies/shipping-policy', label: 'Shipping'},
  {to: '/policies/refund-policy', label: 'Returns'},
  {to: '/policies/privacy-policy', label: 'Privacy'},
];

export function Footer({footer: footerPromise}: FooterProps) {
  return (
    <Suspense fallback={<FooterFrame extraLinks={null} />}>
      <Await resolve={footerPromise}>
        {(footer) => <FooterFrame extraLinks={footer?.menu?.items ?? null} />}
      </Await>
    </Suspense>
  );
}

function FooterFrame({extraLinks}: {extraLinks?: FooterMenuItem[] | null}) {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-[1.5fr_0.7fr_0.7fr_1fr] lg:px-10 lg:py-20">
        <div>
          <Link to="/" className="block">
            <span
              className="block font-display leading-none tracking-[-0.015em] text-ink"
              style={{fontSize: 'clamp(2rem, 6vw, 2.5rem)'}}
            >
              AyurPet
            </span>
            <span className="mt-3 block text-[10px] uppercase tracking-[0.32em] text-ink-muted">
              Ayurveda for modern pets
            </span>
          </Link>
          <p className="mt-5 max-w-md text-[14px] leading-6 text-ink-muted sm:text-[15px] sm:leading-7">
            Functional pet wellness built around Ayurvedic actives, clean
            routines, and Shopify-native checkout.
          </p>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Help" links={HELP_LINKS} />

        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-muted">
            Stay close
          </p>
          <p className="mt-4 text-[15px] leading-7 text-ink-muted">
            Product drops, ingredient notes, and pet-parent guides. No spam.
          </p>
          <form
            className="mt-5 flex rounded-full border border-line bg-white/80 p-1 transition focus-within:border-brand"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-muted"
              placeholder="you@email.com"
              type="email"
              aria-label="Email address"
            />
            <button
              className="rounded-full bg-brand px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-brand-deep"
              type="submit"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-10">
          <p>
            © {new Date().getFullYear()} AyurPet Global. Supplements are not a
            substitute for veterinary care.
          </p>
          <p className="flex items-center gap-3">
            <span>Vet-informed</span>
            <span aria-hidden>·</span>
            <span>Lab-tested</span>
            <span aria-hidden>·</span>
            <span>30-day returns</span>
          </p>
        </div>
        {extraLinks?.length ? (
          <span className="sr-only">Footer menu loaded.</span>
        ) : null}
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{to: string; label: string}>;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.32em] text-ink-muted">
        {title}
      </p>
      <ul className="mt-4 grid gap-3 text-sm text-ink">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              prefetch="intent"
              className="transition hover:text-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
