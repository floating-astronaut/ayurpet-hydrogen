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
  {to: '/pages/about', label: 'About Ayurpet'},
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
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] lg:px-10 lg:py-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-paper">AP</span>
            <span>
              <span className="block font-display text-3xl leading-none text-ink">AyurPet</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-ink-muted">Ayurveda for modern pets</span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-ink-muted">
            Functional pet wellness built around Ayurvedic actives, clean routines, and Shopify-native checkout.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-brand">
            <span className="rounded-full border border-line bg-white/70 px-3 py-1.5">Vet-informed</span>
            <span className="rounded-full border border-line bg-white/70 px-3 py-1.5">No filler-led routine</span>
            <span className="rounded-full border border-line bg-white/70 px-3 py-1.5">30-day returns</span>
          </div>
        </div>
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Help" links={HELP_LINKS} />
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">Stay close</p>
          <p className="mt-4 text-sm leading-7 text-ink-muted">Product drops, ingredient notes, and pet-parent guides. No spam.</p>
          <form className="mt-5 flex rounded-full border border-line bg-white/70 p-1">
            <input className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="Email address" type="email" />
            <button className="rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-paper" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-line px-4 py-5 text-center text-xs leading-6 text-ink-muted sm:px-6 lg:px-10">
        © {new Date().getFullYear()} AyurPet Global. Supplements are not a substitute for veterinary care.
        {extraLinks?.length ? <span className="sr-only"> Footer menu loaded.</span> : null}
      </div>
    </footer>
  );
}

function FooterColumn({title, links}: {title: string; links: Array<{to: string; label: string}>}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">{title}</p>
      <ul className="mt-4 grid gap-3 text-sm text-brand">
        {links.map((link) => (
          <li key={link.to}><Link to={link.to} prefetch="intent">{link.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
