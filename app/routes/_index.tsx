import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductRange} from '~/components/home/ProductRange';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'AyurPet Global — Ayurvedic wellness for modern pets'},
    {
      name: 'description',
      content:
        'Ayurvedic pet supplements, Himalayan yak chews, and daily wellness routines for dogs. Shopify-powered checkout, clean formulas, premium pet care.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferred = loadDeferredData(args);
  const critical = await loadCriticalData(args);
  return {...deferred, ...critical};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{product}] = await Promise.all([
    context.storefront.query(HERO_PRODUCT_QUERY, {
      variables: {handle: HERO_PRODUCT_HANDLE},
    }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    heroProduct: product,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const products = context.storefront
    .query(RANGE_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {rangeProducts: products};
}

const HERO_PRODUCT_HANDLE =
  'calming-ashwagandha-yak-cheese-chews-6-hour-long-lasting-dental-chew';

const TRUST_POINTS: Array<[string, string]> = [
  ['Vet-informed', 'Daily-support formulas, not trend-led filler.'],
  ['Ayurvedic actives', 'Ashwagandha, turmeric, Himalayan yak.'],
  ['Native checkout', 'Fast Shopify cart and trusted payments.'],
  ['30-day returns', 'Send it back if the routine isn’t a fit.'],
];

const ROUTINES: Array<{n: string; title: string; body: string}> = [
  {
    n: '01',
    title: 'Gut comfort',
    body: 'Daily digestive support for itching, licking, tear stains, and sensitive stomach routines.',
  },
  {
    n: '02',
    title: 'Calm behaviour',
    body: 'Ashwagandha-led support for stress, travel, grooming, separation, and noisy days.',
  },
  {
    n: '03',
    title: 'Long chew ritual',
    body: 'Himalayan yak chews for dental engagement and slow, satisfying enrichment.',
  },
];

const ROUTINE_IMAGE =
  'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_21.19.22.jpg?v=1757964471';

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const heroImage = data.heroProduct?.featuredImage ?? null;

  return (
    <main className="bg-paper text-ink">
      {data.isShopLinked ? null : <MockShopNotice />}

      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(135deg,#fdfaf2_0%,#f7f0e1_52%,#ebe0c9_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(74,140,94,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(217,148,65,0.18),transparent_26%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-76px)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-10 lg:py-20">
          <div className="max-w-5xl">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-line bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              Ayurveda × modern pet wellness
              <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              Free shipping over USD 60
            </div>
            <p className="mt-10 text-[11px] uppercase tracking-[0.36em] text-brand">AyurPet Global</p>
            <h1 className="mt-5 max-w-5xl font-display text-[3.35rem] leading-[0.92] text-ink sm:text-6xl lg:text-[7.4rem]">
              Daily rituals for calmer, healthier dogs.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg lg:text-xl">
              Premium Ayurvedic supplements and Himalayan yak chews, designed like a clean wellness routine instead of another crowded pet aisle.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/collections/all" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-brand-deep">
                Shop the range
              </Link>
              <Link to={`/products/${data.heroProduct?.handle ?? HERO_PRODUCT_HANDLE}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/70 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand transition hover:bg-white">
                View bestseller
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/70 p-3 shadow-[0_32px_110px_rgba(31,26,20,0.14)] backdrop-blur sm:rounded-[2.8rem] sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-cream">
                {heroImage ? (
                  <Image data={heroImage} aspectRatio="4/5" sizes="(min-width:1024px) 42vw, 92vw" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center font-display text-4xl text-brand">AyurPet</div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,17,16,0.02)_35%,rgba(42,17,16,0.46)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-paper/70">Featured ritual</p>
                  <h2 className="mt-2 max-w-[12ch] font-display text-4xl leading-[0.95] sm:text-5xl">{data.heroProduct?.title ?? 'Daily wellness'}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10 lg:py-14">
          {TRUST_POINTS.map(([title, body]) => (
            <div key={title} className="rounded-[1.4rem] border border-line bg-paper/80 p-6 shadow-[0_10px_30px_rgba(31,26,20,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">{title}</p>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">Choose by outcome</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-ink sm:text-6xl">One shelf. Three clear routines.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ROUTINES.map((item, index) => (
              <div key={item.title} className="rounded-[2rem] border border-line bg-white/78 p-7 shadow-[0_20px_70px_rgba(31,26,20,0.05)]">
                <p className="font-display text-5xl text-saffron-soft">0{index + 1}</p>
                <h3 className="mt-6 font-display text-3xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Await resolve={data.rangeProducts}>
          {(response) =>
            response ? <ProductRange products={response.products.nodes} title="The AyurPet range." eyebrow="Shop live products" /> : null
          }
        </Await>
      </Suspense>

      <section className="bg-brand-deep px-4 py-16 text-paper sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-saffron-soft">Start simple</p>
          <h2 className="mt-4 font-display text-4xl leading-[1] sm:text-6xl">A better daily ritual can start with one chew.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-paper/72">Pick the routine, add to cart, and keep checkout native to Shopify.</p>
          <Link to="/collections/all" className="mt-9 inline-flex rounded-full bg-saffron px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink">Shop now</Link>
        </div>
      </section>
    </main>
  );
}

const HERO_PRODUCT_QUERY = `#graphql
  query HeroProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;

const RANGE_PRODUCTS_QUERY = `#graphql
  fragment RangeProduct on Product {
    id
    title
    handle
    vendor
    tags
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
  }
  query RangeProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: BEST_SELLING) {
      nodes { ...RangeProduct }
    }
  }
` as const;
