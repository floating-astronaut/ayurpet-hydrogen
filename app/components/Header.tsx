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
  {to: '/collections/all', label: 'Shop all'},
  {to: '/collections/supplements', label: 'Supplements'},
  {to: '/collections/yak-chews', label: 'Yak chews'},
  {to: '/pages/about', label: 'About'},
];

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop} = header;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          prefetch="intent"
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${shop.name} home`}
        >
          <img
            src="/brand/logo-color.svg"
            alt="AyurPet"
            width={140}
            height={32}
            className="h-7 w-auto sm:h-8"
          />
          <span className="hidden text-[10px] uppercase tracking-[0.32em] text-ink-muted sm:inline">
            Global
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
  const className =
    viewport === 'desktop'
      ? 'hidden items-center gap-8 lg:flex'
      : 'grid gap-2';

  return (
    <nav
      className={className}
      role="navigation"
      aria-label={viewport === 'desktop' ? 'Main navigation' : 'Mobile navigation'}
    >
      {CORE_LINKS.map((item) => (
        <NavLink
          key={item.to}
          end={item.to === '/'}
          onClick={close}
          prefetch="intent"
          to={item.to}
          className={({isActive}) =>
            viewport === 'desktop'
              ? `relative text-[13px] tracking-wide transition ${
                  isActive
                    ? 'text-ink after:absolute after:-bottom-[22px] after:left-0 after:right-0 after:h-px after:bg-brand'
                    : 'text-ink-muted hover:text-ink'
                }`
              : `rounded-2xl border border-line bg-white/70 px-4 py-3 text-base ${
                  isActive ? 'text-brand' : 'text-ink'
                }`
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
    <nav
      className="flex items-center gap-1.5 sm:gap-2"
      role="navigation"
      aria-label="Header actions"
    >
      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden h-10 items-center rounded-full border border-line/0 px-3 text-[12px] tracking-wide text-ink-muted transition hover:text-ink sm:inline-flex"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream lg:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
      type="button"
    >
      <span className="relative block h-3 w-5" aria-hidden>
        <span className="absolute inset-x-0 top-0 h-px bg-current" />
        <span className="absolute inset-x-0 top-1.5 h-px bg-current" />
        <span className="absolute inset-x-0 top-3 h-px bg-current" />
      </span>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream"
      onClick={() => open('search')}
      aria-label="Search"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M16.5 16.5L21 21"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function CartIcon({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      aria-label={`Cart, ${count} items`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream"
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
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
        <path
          d="M5 7h14l-1.4 11.2A2 2 0 0 1 15.6 20H8.4a2 2 0 0 1-2-1.8L5 7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 7V5a3 3 0 1 1 6 0v2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-paper">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartIcon count={0} />}>
      <Await resolve={cart}>
        <CartFromAsync />
      </Await>
    </Suspense>
  );
}

function CartFromAsync() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartIcon count={cart?.totalQuantity ?? 0} />;
}
