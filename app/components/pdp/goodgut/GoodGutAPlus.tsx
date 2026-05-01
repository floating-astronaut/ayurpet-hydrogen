// Curated A+ content. The merchant's authored descriptionHtml is a
// dump of bullets + 4 large artboards. Audit said the section ran
// 3,622px on desktop / 2,295px on mobile when rendered as one block.
//
// Strategy:
//   1. Render THREE strongest artboards as designed sections, each
//      with an editorial headline and caption. These are sourced from
//      the live Storefront images list (so the merchant can swap any
//      artboard without touching code).
//   2. Push everything else (the merchant blockquote + bullets +
//      whatever else the description contains) behind a "Full brand
//      deck" <details> disclosure so it's still available to readers
//      who want it, but doesn't bury the rest of the page.
//
// LandingCard provides the chrome; .ayur-aplus styles the embedded
// merchant images that live inside the disclosure.
import {useState} from 'react';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {Image} from '@shopify/hydrogen';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {LandingCard, LandingSection, SectionHeader} from './primitives';

type Frame = {
  /** Substring to match against image URLs to find the right artboard. */
  match: string[];
  eyebrow: string;
  caption: string;
  /** Tall image (4:5) or wide image (16:9-ish). */
  ratio: 'square' | 'wide';
};

// Order matters — we render the first 3 frames that have a matching
// merchant image. Curated to the strongest, most distinct artboards.
const CURATED: Frame[] = [
  {
    match: ['Artboard_2_3', 'symptoms', 'probiotic'],
    eyebrow: 'Why dogs need it',
    caption:
      'Indigestion, constipation, paw licking, scratching, bad breath — the symptoms gut imbalance hides behind.',
    ratio: 'square',
  },
  {
    match: ['Artboard_4'],
    eyebrow: 'Six potent herbs',
    caption:
      'Triphala · Bhumi Amla · Slippery Elm · Fennel · Ginger · Cumin · Black Pepper · Sweet Potato. No fillers, no synthetics.',
    ratio: 'square',
  },
  {
    match: ['Artboard_3', 'goodguts-brandstory'],
    eyebrow: 'Liquid · not powder',
    caption:
      '2× faster relief. 3× easier than powders. Mixes with food or water — no clumps, no taste battles.',
    ratio: 'wide',
  },
];

function pickImage(
  frame: Frame,
  pool: StorefrontImage[],
): StorefrontImage | null {
  for (const m of frame.match) {
    const hit = pool.find((img) =>
      (img.url ?? '').toLowerCase().includes(m.toLowerCase()),
    );
    if (hit) return hit;
  }
  return null;
}

export function GoodGutAPlus({
  html,
  images,
}: {
  /** Raw merchant descriptionHtml (preserved inside the disclosure). */
  html: string;
  /** Live Storefront product.images.nodes — used to source artboards. */
  images: StorefrontImage[];
}) {
  const [open, setOpen] = useState(false);
  if (!html && !images.length) return null;

  const usedIds = new Set<string>();
  const frames: Array<{frame: Frame; image: StorefrontImage}> = [];
  for (const f of CURATED) {
    const candidates = images.filter((i) => i.id && !usedIds.has(i.id));
    const img = pickImage(f, candidates);
    if (img && img.id) {
      usedIds.add(img.id);
      frames.push({frame: f, image: img});
    }
    if (frames.length === 3) break;
  }

  return (
    <LandingSection tone="paper">
      <ScrollReveal kind="rise-soft">
        <SectionHeader
          eyebrow="The brand deck"
          title={<>Why GoodGut+ is built differently.</>}
          body="Three curated panels from the AyurPet team — the symptom map, the herb blend, and the liquid-format pitch."
        />
      </ScrollReveal>

      {frames.length > 0 ? (
        <ScrollReveal kind="rise-soft" stagger className="mt-9 sm:mt-10">
          <ul className="grid gap-5 sm:gap-6 lg:grid-cols-2">
            {frames.map(({frame, image}, idx) => {
              const isWide = frame.ratio === 'wide';
              return (
                <li
                  key={image.id ?? idx}
                  className={isWide ? 'lg:col-span-2' : ''}
                >
                  <LandingCard bleed className="h-full">
                    <div
                      className={
                        'relative overflow-hidden bg-cream ' +
                        (isWide
                          ? 'aspect-[16/9]'
                          : 'aspect-square')
                      }
                    >
                      <Image
                        data={image}
                        sizes={isWide ? '(min-width:1024px) 70vw, 92vw' : '(min-width:1024px) 35vw, 92vw'}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="px-5 py-5 sm:px-6 sm:py-6">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-brand">
                        {frame.eyebrow}
                      </p>
                      <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-soft sm:text-[14.5px]">
                        {frame.caption}
                      </p>
                    </div>
                  </LandingCard>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      ) : null}

      {/* Full brand deck — preserved Shopify A+ HTML behind a disclosure */}
      {html ? (
        <div className="mt-10 sm:mt-12">
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="goodgut-aplus-full"
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-4 rounded-full border border-line bg-paper px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.22em] text-ink transition hover:border-brand hover:text-brand sm:px-6 sm:py-3.5 sm:text-[12px]"
            >
              <span>Full brand deck · everything else from AyurPet</span>
              <span
                aria-hidden
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              >
                ↓
              </span>
            </button>

            {open ? (
              <ScrollReveal
                kind="rise-soft"
                className="ayur-aplus mt-5 rounded-[1.5rem] border border-line/70 bg-paper p-5 shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-8 lg:p-10"
              >
                <div
                  id="goodgut-aplus-full"
                  dangerouslySetInnerHTML={{__html: html}}
                />
              </ScrollReveal>
            ) : null}
          </div>
        </div>
      ) : null}
    </LandingSection>
  );
}
