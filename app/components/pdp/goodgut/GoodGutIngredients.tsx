// Ingredient pillars + liquid-format callout. Uses LandingCard +
// SectionHeader so spacing aligns with the rest of the GoodGut page.
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

type ImageCredit = {
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  source: 'unsplash';
};

type Ingredient = {
  name: string;
  latin?: string;
  role: string;
  body: string;
  source: string;
  /** Editorial photo of the herb / source. When present, replaces the
   * abstract SVG droplet icon. Drop a CDN-hosted JPG/WEBP URL here
   * (Shopify-files, Cloudinary, Bunny CDN, or Unsplash hot-link). */
  imageUrl?: string;
  imageAlt?: string;
  /** Required if imageUrl is sourced from Unsplash — renders the
   * "Photo by [name] on Unsplash" attribution line under the card. */
  imageCredit?: ImageCredit;
};

// Unsplash hot-link URLs include w=900 for responsive sizing and the
// auto=format / fit=crop / q=80 params Unsplash recommends. Each photo
// has a corresponding download-tracking ping fired when the URLs were
// added (Unsplash TOS requirement). Replace with brand-shot photography
// on Shopify CDN when available — the ingredient card layout adapts to
// either source automatically.
const INGREDIENTS: Ingredient[] = [
  {
    name: 'Milk thistle',
    latin: 'Silybum marianum',
    role: 'Liver + gut detox',
    body: 'Silymarin compounds support liver function and bile flow — the cleanup crew that keeps digestion smooth.',
    source: 'Hill-grown · cold-pressed extract',
    imageUrl:
      'https://images.unsplash.com/photo-1688845606840-cebd361a102c?w=900&auto=format&fit=crop&q=80&fm=jpg',
    imageAlt: 'Milk thistle flower with a bee on its purple bloom',
    imageCredit: {
      photographer: 'alksndra',
      photographerUrl:
        'https://unsplash.com/@alksndra?utm_source=ayurpet&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-bee-is-sitting-on-a-purple-flower-y3kevII1TT8?utm_source=ayurpet&utm_medium=referral',
      source: 'unsplash',
    },
  },
  {
    name: 'Prebiotics',
    latin: 'Inulin · sweet potato fibre',
    role: 'Feeds beneficial bacteria',
    body: 'Soluble fibre that the good gut microbes feed on — without it, probiotics have nothing to grow.',
    source: 'Plant-derived, vegetarian',
    imageUrl:
      'https://images.unsplash.com/photo-1774177953595-0460fb38287d?w=900&auto=format&fit=crop&q=80&fm=jpg',
    imageAlt: 'Various plant parts arranged on a light background',
    imageCredit: {
      photographer: 'Danielle Suijkerbuijk',
      photographerUrl:
        'https://unsplash.com/@vandaantje?utm_source=ayurpet&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/various-plant-parts-arranged-on-a-light-background-oQbno2kU4Lw?utm_source=ayurpet&utm_medium=referral',
      source: 'unsplash',
    },
  },
  {
    name: '6 Ayurvedic herbs',
    latin: 'Triphala · Fennel · Slippery elm + 3 more',
    role: 'Soothes & rebalances',
    body: 'A classical Ayurvedic blend used for centuries to calm the digestive tract and ease bloating.',
    source: 'Wild-harvested in India',
    imageUrl:
      'https://images.unsplash.com/photo-1768729340925-2749ecdc211c?w=900&auto=format&fit=crop&q=80&fm=jpg',
    imageAlt: 'Turmeric root, dried pieces, and powder on a wooden background',
    imageCredit: {
      photographer: 'iKshana Productions',
      photographerUrl:
        'https://unsplash.com/@ikshanaproductions?utm_source=ayurpet&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/turmeric-root-dried-pieces-and-powder-on-a-wooden-background-X9OFBvUxW78?utm_source=ayurpet&utm_medium=referral',
      source: 'unsplash',
    },
  },
];

export function GoodGutIngredients() {
  return (
    <LandingSection tone="paper">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="What’s actually inside"
          title={<>Three pillars. One liquid drop.</>}
          body="Vet-formulated and Ayurvedic-led. Every ingredient earns its place; nothing is in the bottle to look impressive on a label."
        />
      </ScrollReveal>

      <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
        <ul className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {INGREDIENTS.map((it) => (
            <LandingCard
              as="li"
              key={it.name}
              bleed={!!it.imageUrl}
              className="flex h-full flex-col"
            >
              {it.imageUrl ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                  <img
                    src={it.imageUrl}
                    alt={it.imageAlt ?? `${it.name} — ${it.role}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className={it.imageUrl ? 'flex flex-1 flex-col p-6 sm:p-7 lg:p-8' : 'flex flex-1 flex-col'}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.35rem] leading-tight text-ink sm:text-[1.5rem]">
                      {it.name}
                    </h3>
                    {it.latin ? (
                      <p className="mt-1 text-[12px] italic leading-snug text-ink-muted">
                        {it.latin}
                      </p>
                    ) : null}
                  </div>
                  {it.imageUrl ? null : (
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 1c1.7 1.8 3 3.6 3 5.5a3 3 0 0 1-6 0C4 4.6 5.3 2.8 7 1z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 8v5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.22em] text-brand">
                  {it.role}
                </p>
                <p className="mt-2 flex-1 text-[14px] leading-[1.65] text-ink-soft">
                  {it.body}
                </p>

                <p className="mt-5 border-t border-line/70 pt-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  Source ·{' '}
                  <span className="normal-case tracking-normal text-ink-soft">
                    {it.source}
                  </span>
                </p>
                {it.imageCredit ? (
                  <p className="mt-2 text-[10px] leading-snug text-ink-muted/70">
                    Photo:{' '}
                    <a
                      href={it.imageCredit.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline decoration-line/60 underline-offset-2 transition hover:text-ink-soft hover:decoration-brand"
                    >
                      {it.imageCredit.photographer}
                    </a>{' '}
                    on{' '}
                    <a
                      href={it.imageCredit.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline decoration-line/60 underline-offset-2 transition hover:text-ink-soft hover:decoration-brand"
                    >
                      Unsplash
                    </a>
                  </p>
                ) : null}
              </div>
            </LandingCard>
          ))}
        </ul>
      </ScrollReveal>

      {/* Liquid-format dark callout */}
      <ScrollReveal
        kind="rise-soft"
        className="ayur-band-ink relative mt-10 overflow-hidden rounded-[1.5rem] px-6 py-9 text-paper sm:mt-12 sm:px-9 sm:py-11 lg:flex lg:items-center lg:gap-12 lg:px-12 lg:py-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_18%_30%,#fdfaf2_0%,transparent_45%),radial-gradient(circle_at_82%_70%,#d99441_0%,transparent_50%)]"
        />
        <div className="relative max-w-xl">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-saffron-soft">
            Liquid · not powder
          </p>
          <h3 className="mt-3 font-display text-[1.65rem] leading-[1.08] tracking-tight sm:text-[2rem]">
            2× faster relief. 3× easier than powders.
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] text-paper/80 sm:text-[15px]">
            Powdered supplements clump, get refused, and only release after
            digestion starts. A liquid extract absorbs from the moment your
            dog licks the bowl &mdash; and takes seconds to add to food or water.
          </p>
        </div>
        <ul className="relative mt-7 grid grid-cols-2 gap-2.5 lg:mt-0 lg:grid-cols-1 lg:gap-2.5">
          {[
            'Mixes easily with food or water',
            'Zero taste battles · even for picky eaters',
            'No clumps · no choking',
            'Perfect for long-term daily use',
          ].map((line) => (
            <li
              key={line}
              className="flex h-full items-center gap-3 rounded-2xl border border-paper/15 bg-paper/5 px-4 py-3 text-[12.5px] leading-[1.5] text-paper/90 sm:text-[13px]"
            >
              <span aria-hidden className="shrink-0 text-saffron-soft">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </LandingSection>
  );
}
