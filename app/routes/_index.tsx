import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductRange} from '~/components/home/ProductRange';
import {FeaturedIn} from '~/components/home/FeaturedIn';
import {HeroWordReveal} from '~/components/home/HeroWordReveal';
import {MultiRowMarquee} from '~/components/MultiRowMarquee';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';
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
    <main className="overflow-x-clip bg-paper text-ink">
      {data.isShopLinked ? null : <MockShopNotice />}

      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(135deg,#fdfaf2_0%,#f7f0e1_52%,#ebe0c9_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(74,140,94,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(217,148,65,0.18),transparent_26%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-76px)] max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:px-10 lg:py-20">
          <div className="min-w-0 max-w-5xl">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-line bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              Ayurveda × modern pet wellness
              <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              Free shipping over USD 60
            </div>
            <p className="mt-10 text-[11px] uppercase tracking-[0.36em] text-brand">AyurPet Global</p>
            <HeroWordReveal
              text="Daily rituals for calmer, healthier dogs."
              className="ayur-hero-h1 mt-5 max-w-5xl break-words font-display text-[2.5rem] leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-[7.4rem]"
            />
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-ink-muted sm:text-lg sm:leading-8 lg:text-xl">
              Premium Ayurvedic supplements and Himalayan yak chews, designed like a clean wellness routine instead of another crowded pet aisle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/collections/all" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-brand-deep sm:text-sm">
                Shop the range
              </Link>
              <Link to={`/products/${data.heroProduct?.handle ?? HERO_PRODUCT_HANDLE}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/70 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand transition hover:bg-white sm:text-sm">
                View bestseller
              </Link>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/70 p-3 shadow-[0_32px_110px_rgba(31,26,20,0.14)] backdrop-blur sm:rounded-[2.8rem] sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-cream">
                {heroImage ? (
                  <Image data={heroImage} aspectRatio="4/5" sizes="(min-width:1024px) 42vw, 92vw" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center font-display text-4xl text-brand">AyurPet</div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,17,16,0.02)_35%,rgba(42,17,16,0.46)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-paper/70">Featured ritual</p>
                  <h2 className="mt-2 max-w-[14ch] font-display text-[1.75rem] leading-[0.98] sm:text-4xl lg:text-5xl">
                    {(data.heroProduct?.title ?? 'Daily wellness').replace(/\s*\|\s*/g, ' — ')}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — eyebrow + count-up stat row, no flat cards. */}
      <section className="relative border-b border-line bg-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_15%_50%,rgba(45,90,61,0.08),transparent_42%),radial-gradient(circle_at_85%_50%,rgba(217,148,65,0.08),transparent_42%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <ScrollReveal kind="rise-soft" className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
              Made for pet parents who notice the small things
            </p>
            <p className="mt-3 font-display text-2xl leading-tight text-ink sm:text-3xl">
              Vet-informed formulas. Ayurvedic actives. Daily, repeatable
              rituals — not aisle-shelf filler.
            </p>
          </ScrollReveal>

          <ScrollReveal kind="rise-soft" stagger>
            <ul className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-x-2">
              {[
                {label: 'Average rating', value: 4.9, decimals: 1, caption: '★★★★★ verified buyers'},
                {label: 'Reviews', value: 9340, suffix: '+', caption: 'Across the AyurPet shelf'},
                {label: 'Hour chew', value: 6, suffix: '+', caption: 'Slow-aged Himalayan yak cheese'},
                {label: 'Day returns', value: 30, caption: 'No-questions, full refund'},
              ].map((s, i, arr) => (
                <li
                  key={s.label}
                  className={
                    'flex flex-col items-start' +
                    (i % 2 === 0 ? ' border-r border-line pr-4 sm:pr-6' : ' pl-4 sm:pl-6') +
                    (i < arr.length - 1 ? ' sm:border-r sm:border-line sm:pr-6' : '')
                  }
                >
                  <p className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-tight text-ink">
                    <CountUpStat
                      value={s.value}
                      decimals={s.decimals ?? 0}
                      suffix={s.suffix}
                    />
                  </p>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">
                    {s.caption}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <FeaturedIn />

      {/* Kinetic interstitial — three lanes, mixed sizes/speeds/directions. */}
      <section className="border-y border-line bg-paper py-6 sm:py-8">
        <MultiRowMarquee />
      </section>

      {/* Routines — one editorial moment: photo on left, structured copy on right. */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
          <ScrollReveal kind="rise" className="ayur-card-frame relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_90px_rgba(31,26,20,0.10)] sm:rounded-[2.25rem]">
            <div className="relative aspect-[4/5] sm:aspect-[5/6]">
              <img
                src={ROUTINE_IMAGE}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(42,17,16,0.45))]"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-paper/75">
                  Pet wellness, by routine
                </p>
                <p className="mt-2 max-w-[20ch] font-display text-3xl leading-[1.05] sm:text-4xl">
                  Calmer mornings. Better digestion. Quieter evenings.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal kind="rise-soft" className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              Choose by outcome
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              One shelf. Three clear routines.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
              Pick the daily ritual that fits your dog. Each one is built
              around a single function: digest, calm, or chew.
            </p>

            <ol className="ayur-timeline mt-9 border-t border-line">
              {ROUTINES.map((item) => (
                <li
                  key={item.title}
                  className="ayur-timeline-step grid grid-cols-[2.4rem_1fr] items-start gap-x-4 border-b border-line py-6 last:border-b-0"
                >
                  <span className="block pl-2 font-display text-2xl leading-none text-saffron-deep">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              to="/collections/all"
              prefetch="intent"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand transition hover:text-brand-deep"
            >
              Browse the full shelf
              <span aria-hidden>→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Suspense fallback={null}>
        <Await resolve={data.rangeProducts}>
          {(response) =>
            response ? <ProductRange products={response.products.nodes} title="The AyurPet range." eyebrow="Shop live products" /> : null
          }
        </Await>
      </Suspense>

      <section className="ayur-band-ink relative overflow-hidden px-4 py-20 text-paper sm:px-6 lg:px-10 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(#fdfaf2_1px,transparent_1px),linear-gradient(90deg,#fdfaf2_1px,transparent_1px)] [background-size:64px_64px]"
        />
        <ScrollReveal kind="rise" className="relative mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-saffron-soft">Start simple</p>
          <h2 className="mt-4 break-words font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.5rem]">
            A better daily ritual can start with one chew.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-paper/72 sm:text-lg">
            Pick the routine, add to cart, and keep checkout native to Shopify.
          </p>
          <div className="mt-10 inline-flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/collections/all"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-saffron px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-saffron-soft sm:text-sm"
            >
              Shop the range
            </Link>
            <Link
              to="/pages/about"
              className="inline-flex items-center gap-2 px-2 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper/80 transition hover:text-paper sm:text-sm"
            >
              Read our story
              <span aria-hidden>→</span>
            </Link>
          </div>
        </ScrollReveal>
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
