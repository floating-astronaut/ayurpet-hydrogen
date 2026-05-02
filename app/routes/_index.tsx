import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductRange} from '~/components/home/ProductRange';
import {FeaturedIn} from '~/components/home/FeaturedIn';
import {HeroWordReveal} from '~/components/home/HeroWordReveal';
import {ShopTheShelf} from '~/components/home/ShopTheShelf';
import {MissionBand} from '~/components/home/MissionBand';
import {RealDogsVideo} from '~/components/home/RealDogsVideo';
import {ProofStrip} from '~/components/home/ProofStrip';
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_22%,rgba(74,140,94,0.22),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(217,148,65,0.20),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(184,94,62,0.10),transparent_42%)]"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-20 lg:pt-20">
          <div className="min-w-0">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-line/80 bg-white/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-muted backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              Ayurveda × modern pet wellness
              <span aria-hidden className="h-3 w-px bg-line" />
              <span className="text-clay">Free shipping over USD 60</span>
            </div>

            <HeroWordReveal
              text="A calmer dog. A cleaner shelf."
              className="ayur-hero-h1 mt-7 break-words font-display text-[3.1rem] font-medium leading-[0.9] tracking-[-0.018em] text-ink sm:text-[5.4rem] lg:text-[7.2rem] xl:text-[8.2rem]"
            />

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink-soft sm:text-[17px] sm:leading-8">
              Vet-informed Ayurvedic supplements and slow-aged Himalayan yak chews — built for daily wellness rituals, not the average pet aisle.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/collections/all"
                prefetch="intent"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-paper shadow-[0_14px_30px_rgba(45,90,61,0.28)] transition hover:bg-brand-deep sm:text-[13px]"
              >
                Shop the range
                <span aria-hidden>→</span>
              </Link>
              <Link
                to={`/products/${data.heroProduct?.handle ?? HERO_PRODUCT_HANDLE}`}
                prefetch="intent"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/80 px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-ink transition hover:border-brand hover:text-brand sm:text-[13px]"
              >
                View bestseller
              </Link>
            </div>

            {/* Proof cues — surfaced inline near the CTA, not buried later. */}
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-2 border-t border-line/70 pt-5 sm:mt-8 sm:gap-3 sm:pt-6">
              <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_10px_24px_rgba(31,26,20,0.04)] backdrop-blur sm:p-4">
                <p className="whitespace-nowrap font-display text-[1.35rem] leading-none text-brand sm:text-[1.75rem]">
                  4.9
                  <span className="ml-1 text-[12px] font-medium text-saffron-deep">★</span>
                </p>
                <p className="mt-2 text-[9px] font-bold uppercase leading-[1.35] tracking-[0.16em] text-ink-muted sm:text-[10px]">
                  9,340+<br className="sm:hidden" /> reviews
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_10px_24px_rgba(31,26,20,0.04)] backdrop-blur sm:p-4">
                <p className="whitespace-nowrap font-display text-[1.35rem] leading-none text-brand sm:text-[1.75rem]">
                  6h+
                </p>
                <p className="mt-2 text-[9px] font-bold uppercase leading-[1.35] tracking-[0.16em] text-ink-muted sm:text-[10px]">
                  Slow chew
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_10px_24px_rgba(31,26,20,0.04)] backdrop-blur sm:p-4">
                <p className="whitespace-nowrap font-display text-[1.35rem] leading-none text-brand sm:text-[1.75rem]">
                  100%
                </p>
                <p className="mt-2 text-[9px] font-bold uppercase leading-[1.35] tracking-[0.16em] text-ink-muted sm:text-[10px]">
                  Vet-led
                </p>
              </div>
            </div>
          </div>

          {/* Hero campaign visual — real lifestyle photo of a dog with the
              chew, with the actual designed packshot floating as an inset.
              Drives the campaign feeling away from one isolated packshot. */}
          <div className="relative min-w-0">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/40 p-2 shadow-[0_32px_110px_rgba(31,26,20,0.14)] backdrop-blur sm:rounded-[2rem] sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-cream-deep sm:aspect-[4/5] sm:rounded-[1.85rem]">
                <picture>
                  <source
                    srcSet="/brand/lifestyle-kelpie-chewing-1200.webp"
                    type="image/webp"
                  />
                  <img
                    src="/brand/lifestyle-kelpie-chewing-1200.jpg"
                    alt="A brown kelpie lying down chewing a Himalayan yak cheese chew"
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1200}
                    height={800}
                    loading="eager"
                  />
                </picture>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,17,16,0.0)_55%,rgba(42,17,16,0.45)_100%)]"
                />

                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-clay shadow-[0_6px_18px_rgba(31,26,20,0.10)] backdrop-blur">
                  Bestseller
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/75">
                    Featured ritual
                  </p>
                  <h2 className="mt-2 max-w-[16ch] font-display text-[1.6rem] leading-[0.98] sm:text-[2rem] lg:text-[2.3rem]">
                    {(data.heroProduct?.title ?? 'Daily wellness').replace(/\s*\|\s*/g, ' — ')}
                  </h2>
                  <Link
                    to={`/products/${data.heroProduct?.handle ?? HERO_PRODUCT_HANDLE}`}
                    prefetch="intent"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ink transition hover:bg-paper"
                  >
                    Shop the chew
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating packshot inset — the real designed pack art so the
                hero shows both lifestyle AND product without repeating one
                packshot across the whole page. */}
            <div className="absolute -left-2 top-6 hidden w-[42%] max-w-[200px] overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_rgba(31,26,20,0.18)] ring-1 ring-line/60 lg:block">
              <picture>
                <source srcSet="/brand/original-pack.webp" type="image/webp" />
                <img
                  src="/brand/original-pack.jpg"
                  alt="Original Himalayan Yak Cheese Chews pack"
                  className="block h-auto w-full"
                  width={400}
                  height={400}
                  loading="lazy"
                />
              </picture>
            </div>

            {/* Floating spec chip — small premium signal */}
            <div
              aria-hidden
              className="absolute -right-2 bottom-8 hidden rounded-2xl border border-line/70 bg-paper/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink shadow-[0_18px_40px_rgba(31,26,20,0.14)] backdrop-blur lg:block"
            >
              <span className="block text-[9px] tracking-[0.32em] text-ink-muted">
                Lasts
              </span>
              <span className="mt-1 block font-display text-[15px] tracking-tight normal-case text-saffron-deep">
                6+ hours
              </span>
            </div>
          </div>
        </div>
      </section>

      <FeaturedIn />

      {/* Brand promise — short editorial dark band, alternating rhythm. */}
      <section className="ayur-band-ink relative overflow-hidden border-t border-line/40 px-5 py-14 text-paper sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_18%_30%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_82%_70%,#d99441_0%,transparent_50%)]"
        />
        <ScrollReveal
          kind="rise-soft"
          className="relative mx-auto flex max-w-7xl flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-saffron-soft">
              Why pet parents stay
            </p>
            <h2 className="mt-4 font-display text-[1.85rem] leading-[1.08] tracking-tight sm:text-[2.5rem] sm:leading-[1.05] lg:text-[3.1rem]">
              Vet-informed formulas. Ayurvedic actives. Daily, repeatable rituals — not aisle-shelf filler.
            </h2>
          </div>
          <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-6 sm:max-w-md sm:grid-cols-2">
            {[
              {label: 'Avg rating', value: 4.9, decimals: 1, caption: '★★★★★ verified'},
              {label: 'Reviews', value: 9340, suffix: '+', caption: 'across the shelf'},
              {label: 'Hour chew', value: 6, suffix: '+', caption: 'slow-aged'},
              {label: 'Day returns', value: 30, caption: 'no questions'},
            ].map((s) => (
              <li key={s.label} className="border-l border-paper/15 pl-4">
                <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none tracking-tight text-paper">
                  <CountUpStat
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-saffron-soft">
                  {s.label}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-paper/65">
                  {s.caption}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      {/* Premium merchandising — five image-led routine tiles. */}
      <ShopTheShelf />

      {/* Quiet kinetic interstitial — slim, restrained, just bridges the
          dark trust band into the routine grid below. */}
      <section className="border-b border-line bg-cream py-3.5 sm:py-5">
        <MultiRowMarquee />
      </section>

      <RealDogsVideo />

      {/* Routines — one editorial moment: photo on left, structured copy on right. */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
          <ScrollReveal kind="rise" className="relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_90px_rgba(31,26,20,0.10)] sm:rounded-[2.25rem]">
            <div className="relative aspect-[4/5] sm:aspect-[5/6]">
              <picture>
                <source
                  srcSet="/brand/lifestyle-two-dogs-1200.webp"
                  type="image/webp"
                />
                <img
                  src="/brand/lifestyle-two-dogs-1200.jpg"
                  alt="Two dogs being offered a yak cheese chew"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={1200}
                  height={1500}
                />
              </picture>
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(42,17,16,0.55))]"
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

      <ProofStrip />

      <MissionBand />

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
