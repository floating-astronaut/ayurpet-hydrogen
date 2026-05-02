// Google Analytics 4 / GTM dataLayer subscriber for Hydrogen.
//
// Lifts the structural pattern from Pack Digital's open-source
// pack-hydrogen-theme-blueprint (MIT) GA4Events component, but
// rewritten as a single self-contained file that uses Hydrogen's
// native useAnalytics() hook directly and maps onto the standardised
// GA4 ecommerce schema (view_item, view_item_list, view_cart,
// add_to_cart, remove_from_cart, view_search_results).
//
// Drop in as a child of <Analytics.Provider> in app/root.tsx and
// pass `tagId={env.PUBLIC_GA4_TAG_ID}`. The gtag script auto-loads
// on first mount; subsequent navigations push events into the same
// dataLayer so any GTM-based pixel app (Klaviyo, Pinterest, Meta)
// can read from the same source.
//
// Why this beats raw <Analytics.Provider> alone: the provider only
// publishes events into Hydrogen's own analytics bus. Without a
// subscriber, nothing reaches gtag/window.dataLayer. This component
// is the bridge.
import {useEffect, useRef} from 'react';
import {AnalyticsEvent, useAnalytics} from '@shopify/hydrogen';

const SCRIPT_ID = 'ga4-script';
const CONFIG_ID = 'ga4-config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Mapping helpers — turn Hydrogen analytics payloads into the GA4 ecommerce
// schema. Written against our cart fragment shape, not Pack's, so we don't
// drag in their settings/product-page metafield assumptions.
// ---------------------------------------------------------------------------
type AnyData = Record<string, any>;

const gid = (id?: string | null) => (id?.split('/').pop() ?? '');

const mapVariant = (variant: AnyData, list = '') => ({
  id: variant?.sku || gid(variant?.id),
  name: variant?.product?.title || variant?.title || '',
  variant: variant?.title || '',
  brand: variant?.product?.vendor || '',
  product_id: gid(variant?.product?.id),
  variant_id: gid(variant?.id),
  price: variant?.price?.amount || '0.0',
  currency: variant?.price?.currencyCode || '',
  list,
  category: variant?.product?.productType || '',
});

const mapCartLine = (line: AnyData, list = '') => ({
  ...mapVariant(line?.merchandise, list),
  quantity: line?.quantity ?? 1,
  price:
    line?.cost?.amountPerQuantity?.amount ||
    line?.merchandise?.price?.amount ||
    '0.0',
});

const mapProductItem = (product: AnyData, list = '') => {
  const variant = product?.variants?.nodes?.[0] ?? product?.firstVariant ?? {};
  return mapVariant(
    {...variant, product: {...variant.product, ...product}},
    list,
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function GA4Events({
  tagId,
  debug = false,
}: {
  tagId?: string | null | undefined;
  debug?: boolean;
}) {
  const {register, subscribe} = useAnalytics();
  const ready = useRef<(() => void) | null>(null);

  // Register with Hydrogen so it knows we're listening.
  if (!ready.current && register) {
    ready.current = register('GA4Events').ready;
  }

  // Inject gtag script + base config (only once per page lifecycle).
  useEffect(() => {
    if (!tagId || typeof window === 'undefined') return;
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
      document.head.appendChild(s);
    }
    if (!document.getElementById(CONFIG_ID)) {
      const c = document.createElement('script');
      c.id = CONFIG_ID;
      c.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${tagId}');
      `;
      document.head.appendChild(c);
    }
  }, [tagId]);

  // Subscribe to Hydrogen analytics events and map them onto GA4 ecommerce.
  useEffect(() => {
    if (!tagId || !subscribe) return;

    const emit = (event: string, payload: AnyData) => {
      try {
        const enriched = {
          event,
          ...payload,
          event_time: new Date().toISOString(),
        };
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', event, enriched);
        }
      } catch (err) {
        if (debug) console.error('[GA4] emit failed', err);
      }
    };

    const previousPath = () =>
      typeof window !== 'undefined'
        ? sessionStorage.getItem('PREVIOUS_PATH') ?? ''
        : '';

    const collectionList = () => {
      const here = typeof window !== 'undefined' ? window.location.pathname : '';
      if (here.startsWith('/collections')) return here;
      const prev = previousPath();
      return prev.startsWith('/collections') ? prev : '';
    };

    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: AnyData) => {
      try {
        const url = data?.url ?? '';
        const u = url ? new URL(url) : null;
        emit('page_view', {
          page_path: u?.pathname ?? '',
          page_search: u?.search ?? '',
          page_title:
            typeof document !== 'undefined' ? document.title : '',
        });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('PREVIOUS_PATH', u?.pathname ?? '');
        }
      } catch (err) {
        if (debug) console.error('[GA4] page_viewed', err);
      }
    });

    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: AnyData) => {
      const products = data?.products ?? [];
      const first = products[0];
      if (!first) return;
      emit('view_item', {
        ecommerce: {
          currency:
            first.price?.currencyCode || data?.shop?.currency || 'USD',
          value: Number(first.price?.amount ?? first.price ?? 0),
          items: products.map((p: AnyData) =>
            mapVariant(
              {
                id: p.variantId ?? p.id,
                title: p.variantTitle ?? p.title,
                price: {amount: p.price, currencyCode: p.currency},
                product: {
                  id: p.productGid ?? p.id,
                  title: p.name ?? p.title,
                  vendor: p.brand,
                  productType: p.category,
                },
                sku: p.sku,
              },
              previousPath().startsWith('/collections') ? previousPath() : '',
            ),
          ),
        },
      });
    });

    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data: AnyData) => {
      const collection = data?.collection;
      if (!collection) return;
      const products = collection?.products?.nodes ?? [];
      const list = collectionList();
      emit('view_item_list', {
        ecommerce: {
          item_list_name: collection.title,
          item_list_id: gid(collection.id),
          items: products.slice(0, 12).map((p: AnyData) =>
            mapProductItem(p, list),
          ),
        },
      });
    });

    subscribe(AnalyticsEvent.SEARCH_VIEWED, (data: AnyData) => {
      const term = data?.searchTerm ?? '';
      const results = data?.searchResults ?? data?.searchResults?.results ?? [];
      const items: AnyData[] = Array.isArray(results)
        ? (results as AnyData[])
        : [];
      emit('view_search_results', {
        search_term: term,
        ecommerce: {
          items: items.slice(0, 12).map((p) => mapProductItem(p)),
        },
      });
    });

    subscribe(AnalyticsEvent.CART_VIEWED, (data: AnyData) => {
      const cart = data?.cart;
      if (!cart) return;
      const list = collectionList();
      emit('view_cart', {
        ecommerce: {
          currency: cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(cart?.cost?.totalAmount?.amount ?? 0),
          items:
            (cart?.lines?.nodes ?? cart?.lines ?? [])
              .slice(0, 12)
              .map((l: AnyData) => mapCartLine(l, list)),
        },
        cart_id: gid(cart?.id),
        cart_total: cart?.cost?.totalAmount?.amount ?? '0.0',
        cart_count: cart?.totalQuantity ?? 0,
      });
    });

    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: AnyData) => {
      const cart = data?.cart;
      const line = data?.currentLine;
      if (!cart || !line) return;
      const list = collectionList();
      const added = {
        ...line,
        quantity: (line.quantity ?? 1) - (data?.prevLine?.quantity ?? 0),
      };
      emit('add_to_cart', {
        ecommerce: {
          currency: cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(line?.cost?.totalAmount?.amount ?? 0),
          items: [mapCartLine(added, list)],
        },
        cart_id: gid(cart?.id),
        cart_total: cart?.cost?.totalAmount?.amount ?? '0.0',
        cart_count: cart?.totalQuantity ?? 0,
      });
    });

    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, (data: AnyData) => {
      const cart = data?.cart;
      const prev = data?.prevLine;
      if (!cart || !prev) return;
      const list = collectionList();
      const removed = {
        ...prev,
        quantity: (prev.quantity ?? 1) - (data?.currentLine?.quantity ?? 0),
      };
      emit('remove_from_cart', {
        ecommerce: {
          currency: cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(prev?.cost?.totalAmount?.amount ?? 0),
          items: [mapCartLine(removed, list)],
        },
        cart_id: gid(cart?.id),
        cart_total: cart?.cost?.totalAmount?.amount ?? '0.0',
        cart_count: cart?.totalQuantity ?? 0,
      });
    });

    if (ready.current) ready.current();
  }, [tagId, subscribe, debug]);

  return null;
}
