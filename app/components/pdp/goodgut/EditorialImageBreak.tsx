// Full-bleed editorial image break. Drops one of the product's own
// gallery photos between content sections so the page reads as a
// magazine spread instead of an unbroken column of card grids.
//
// Two visual modes:
//   - "wide"   — 16:9 on mobile, 16:6 on desktop. Cinematic break
//                between heavy content blocks.
//   - "tall"   — 4:5 on mobile, 21:9 on desktop. Used for portrait-
//                shaped product photos so we don't crop the bottle off.
//
// Optional eyebrow / caption overlay sits bottom-left with a soft
// gradient backdrop. Pass `caption` for editorial copy, omit it for
// silent imagery (recommended when the product photo speaks for
// itself).
//
// Reuses Hydrogen's <Image> so srcset / sizes / lazy loading all
// behave correctly. Designed to be dropped directly into
// GoodGutLanding between sections — the surrounding LandingSection
// padding gives it natural rhythm without needing wrapper styles.
import {Image} from '@shopify/hydrogen';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Props = {
  image: StorefrontImage | null | undefined;
  /** Aspect ratio family. Wide reads as a horizontal break,
   * tall preserves portrait-oriented bottle shots. */
  mode?: 'wide' | 'tall';
  /** Optional small uppercase line above the caption headline. */
  eyebrow?: string;
  /** Optional caption headline. Renders bottom-left over a soft
   * dark-to-transparent gradient. Omit for silent imagery. */
  caption?: React.ReactNode;
  /** When true, the image bleeds edge-to-edge on every breakpoint.
   * When false (default), it sits inside the standard 7xl container
   * with rounded corners. */
  bleed?: boolean;
};

export function EditorialImageBreak({
  image,
  mode = 'wide',
  eyebrow,
  caption,
  bleed = false,
}: Props) {
  if (!image) return null;

  const aspect =
    mode === 'tall'
      ? 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]'
      : 'aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/6]';

  const containerClass = bleed
    ? 'relative w-full overflow-hidden'
    : 'mx-auto max-w-7xl px-5 sm:px-6 lg:px-10';

  const frameClass = bleed
    ? `relative ${aspect} w-full overflow-hidden`
    : `relative ${aspect} w-full overflow-hidden rounded-3xl`;

  return (
    <section className="bg-paper">
      <ScrollReveal kind="rise-soft">
        <div className={containerClass}>
          <div className={frameClass}>
            <Image
              data={image}
              sizes={bleed ? '100vw' : '(min-width: 1280px) 1280px, 96vw'}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {caption || eyebrow ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent">
                <div className="px-6 pb-7 pt-12 text-paper sm:px-9 sm:pb-9 sm:pt-16 lg:px-12 lg:pb-12">
                  {eyebrow ? (
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.32em] text-saffron-soft">
                      {eyebrow}
                    </p>
                  ) : null}
                  {caption ? (
                    <p className="mt-2 max-w-xl break-words font-display text-[1.4rem] leading-[1.1] tracking-tight sm:text-[1.85rem] lg:text-[2.1rem]">
                      {caption}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
