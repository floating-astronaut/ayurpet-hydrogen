// Real-brand campaign strip on the PDP. Three visuals lifted from the
// AyurPet brand library: the designed pack, a real dog enjoying the chew,
// and the benefits artboard. Sits between the trust band and the
// ingredient cards so the page reads as a campaign, not just a product
// detail page.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Frame = {
  img: string;
  alt: string;
  eyebrow: string;
  caption: string;
};

const FRAMES: Frame[] = [
  {
    img: 'original-pack',
    alt: 'Original Himalayan Yak Cheese Chews pack with FDA, ISO and HACCP certifications',
    eyebrow: 'The pack',
    caption: 'FDA · ISO · HACCP certified. Single-ingredient yak cheese.',
  },
  {
    img: 'lifestyle-kelpie-chewing-1200',
    alt: 'A brown kelpie chewing a yak cheese chew',
    eyebrow: 'In real homes',
    caption: 'Six hours of dental engagement. No greasy paws after.',
  },
  {
    img: 'original-benefits',
    alt: 'AyurPet benefits panel — happy and occupied, healthy teeth and gums, no greasy residue',
    eyebrow: 'What it does',
    caption: 'Happy & occupied. Mental enrichment. Eases separation anxiety.',
  },
];

export function BrandStrip() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <ScrollReveal kind="rise-soft" stagger>
          <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {FRAMES.map((f) => (
              <li
                key={f.img}
                className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream-deep shadow-[0_18px_50px_rgba(31,26,20,0.10)] ring-1 ring-line/40"
              >
                <picture>
                  <source srcSet={`/brand/${f.img}.webp`} type="image/webp" />
                  <img
                    src={`/brand/${f.img}.jpg`}
                    alt={f.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    width={1080}
                    height={1080}
                  />
                </picture>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_55%,rgba(31,26,20,0.65)_100%)]"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper/75">
                    {f.eyebrow}
                  </p>
                  <p className="mt-1.5 max-w-[28ch] font-display text-[15px] leading-tight sm:text-base">
                    {f.caption}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
