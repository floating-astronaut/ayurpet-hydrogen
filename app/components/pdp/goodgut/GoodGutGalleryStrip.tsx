// Compact thumb gallery — extra angles on the bottle, lifted out of
// the hero so the hero stays under 1,400px on mobile. On desktop it
// sits below the hero gallery as a 4-up row.
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {Image} from '@shopify/hydrogen';

export function GoodGutGalleryStrip({images}: {images: StorefrontImage[]}) {
  if (!images.length) return null;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-7 lg:px-10">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-ink-muted">
          More angles
        </p>
        <ul
          className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3"
          aria-label="Product views"
        >
          {images.slice(0, 4).map((img, i) => (
            <li
              key={img.id ?? i}
              className="overflow-hidden rounded-xl bg-cream ring-1 ring-line/60"
            >
              {/* Explicit width/height attributes prevent the srcset
                  from picking a 100x100 crop that the audit flagged
                  as naturalWidth=0 in some renderers. */}
              <Image
                data={img}
                aspectRatio="1/1"
                width={240}
                height={240}
                sizes="(min-width: 1024px) 18vw, 22vw"
                className="block h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
