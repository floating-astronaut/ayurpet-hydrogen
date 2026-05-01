// Authentic-feel proof rail — four cropped Instagram story creatives lined
// up like a "press wall" for the brand. Real customer / launch posts
// pulled from @ayurpetofficial and re-shared with handles. Sits late in
// the homepage flow as social proof before the closing CTA.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

const POSTS: Array<{
  src: string;
  alt: string;
  handle: string;
  caption: string;
}> = [
  {
    src: 'proof-1',
    alt: 'AyurPet Buy 1 Help 1 mission story',
    handle: '@ayurpetofficial',
    caption: '"Because your pet deserves the best."',
  },
  {
    src: 'proof-2',
    alt: 'Hazel the shih tzu enjoying the chew',
    handle: '@hazel_thecutiepatootie',
    caption: 'Happy pup, happy us.',
  },
  {
    src: 'proof-3',
    alt: 'Ellie shih tzu launch share',
    handle: '@ellie_shihtzu_baby',
    caption: '"It’s chew o’clock people!"',
  },
  {
    src: 'proof-4',
    alt: 'Customer story with the chew',
    handle: '@theayurpet',
    caption: 'Tagged on launch day across India.',
  },
];

export function ProofStrip() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <ScrollReveal
          kind="rise-soft"
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
              On the &lsquo;gram
            </p>
            <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Tagged at homes across India.
            </h2>
          </div>
          <a
            href="https://www.instagram.com/theayurpet/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand transition hover:text-brand-deep"
          >
            Follow @theayurpet
            <span aria-hidden>↗</span>
          </a>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="mt-10">
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {POSTS.map((p) => (
              <li
                key={p.src}
                className="group relative aspect-[3/5] overflow-hidden rounded-[1.25rem] bg-ink shadow-[0_18px_50px_rgba(31,26,20,0.10)] ring-1 ring-line/40"
              >
                <picture>
                  <source srcSet={`/brand/${p.src}.webp`} type="image/webp" />
                  <img
                    src={`/brand/${p.src}.jpg`}
                    alt={p.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    width={720}
                    height={1200}
                  />
                </picture>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_55%,rgba(31,26,20,0.7)_100%)]"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 text-paper sm:p-4">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/75">
                    {p.handle}
                  </p>
                  <p className="mt-1 line-clamp-2 font-display text-[13px] leading-tight sm:text-sm">
                    {p.caption}
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
