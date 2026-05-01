import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

const CORE_LINKS = [
  {to: '/', label: 'Home'},
  {to: '/collections/all', label: 'Shop'},
  {to: '/collections/supplements', label: 'Supplements'},
  {to: '/collections/yak-chews', label: 'Yak chews'},
  {to: '/pages/about', label: 'About'},
];

export function Header({
  header,
  isLoggedIn,
  cart,
}: HeaderProps) {
  const {shop} = header;
  return (
    <header className="ayur-site-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Link prefetch="intent" to="/" className="flex min-w-0 items-center gap-3" aria-label={`${shop.name} home`}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-paper shadow-[0_12px_30px_rgba(45,90,61,0.18)]">AP</span>
          <span className="min-w-0">
            <span className="block truncate font-display text-2xl leading-none text-ink">AyurPet</span>
            <span className="hidden text-[10px] uppercase tracking-[0.26em] text-ink-muted min-[420px]:block">Global wellness</span>
          </span>
        </Link>
        <HeaderMenu viewport="desktop" />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  viewport,
}: {
  menu?: HeaderProps['header']['menu'];
  primaryDomainUrl?: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain?: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const className = viewport === 'desktop' ? 'hidden items-center gap-7 lg:flex' : 'grid gap-2';

  return (
    <nav className={className} role="navigation" aria-label={viewport === 'desktop' ? 'Main navigation' : 'Mobile navigation'}>
      {CORE_LINKS.map((item) => (
        <NavLink
          key={item.to}
          end={item.to === '/'}
          onClick={close}
          prefetch="intent"
          to={item.to}
          className={({isActive}) =>
            viewport === 'desktop'
              ? `text-sm transition ${isActive ? 'text-brand' : 'text-ink-muted hover:text-ink'}`
              : `rounded-2xl border border-line bg-paper px-4 py-3 text-base ${isActive ? 'text-brand' : 'text-ink'}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-2 sm:gap-3" role="navigation" aria-label="Header actions">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" className="hidden rounded-full border border-line bg-paper/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand transition hover:bg-white sm:inline-flex">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-brand lg:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
      type="button"
    >
      <span className="relative block h-4 w-5" aria-hidden>
        <span className="absolute left-0 top-0 h-px w-5 bg-current" />
        <span className="absolute left-0 top-2 h-px w-5 bg-current" />
        <span className="absolute left-0 top-4 h-px w-5 bg-current" />
      </span>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-brand transition hover:bg-white sm:inline-flex" onClick={() => open('search')} aria-label="Search" type="button">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper shadow-[0_12px_30px_rgba(45,90,61,0.2)] transition hover:bg-brand-deep"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart <span aria-label={`items: ${count}`} className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] leading-none">{count}</span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
