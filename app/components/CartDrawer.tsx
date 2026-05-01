// Premium cart drawer using vaul. Drives off the same useAside hook as the
// rest of the storefront so Header.CartIcon's open('cart') call works
// unchanged. On mobile it slides up from the bottom with snap-points + drag-
// to-dismiss; on desktop it slides in from the right.
import {Suspense, useEffect, useState} from 'react';
import {Await} from 'react-router';
import {Drawer} from 'vaul';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '~/components/CartMain';
import {useAside} from '~/components/Aside';

export function CartDrawer({
  cart,
}: {
  cart: Promise<CartApiQueryFragment | null>;
}) {
  const {type, close} = useAside();
  const isOpen = type === 'cart';

  // Vaul wants `direction='right'` on desktop and `direction='bottom'` on
  // mobile. We toggle based on a `(min-width: 768px)` media query.
  const [direction, setDirection] = useState<'right' | 'bottom'>('bottom');
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setDirection(mq.matches ? 'right' : 'bottom');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      direction={direction}
      // Snap points only on mobile (bottom drawer).
      snapPoints={direction === 'bottom' ? [0.6, 1] : undefined}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]" />
        <Drawer.Content
          className={
            direction === 'right'
              ? 'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-[-30px_0_60px_rgba(31,26,20,0.18)]'
              : 'fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[92svh] flex-col rounded-t-[1.5rem] bg-paper shadow-[0_-20px_60px_rgba(31,26,20,0.18)]'
          }
          aria-describedby={undefined}
        >
          {direction === 'bottom' ? (
            <div
              aria-hidden
              className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line"
            />
          ) : null}

          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
            <Drawer.Title className="font-display text-2xl tracking-tight text-ink">
              Your bag
            </Drawer.Title>
            <button
              type="button"
              onClick={close}
              aria-label="Close cart"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-cream hover:text-ink"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <Suspense
              fallback={
                <p className="px-5 py-6 text-sm text-ink-muted sm:px-6">
                  Loading cart…
                </p>
              }
            >
              <Await resolve={cart}>
                {(c) => <CartMain cart={c} layout="aside" />}
              </Await>
            </Suspense>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
