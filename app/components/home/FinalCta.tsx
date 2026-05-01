// Closing editorial banner — rounded brand-deep card, photo overlay, saffron CTA.
import {motion} from 'framer-motion';
import {Link} from 'react-router';

type Props = {
  eyebrow?: string;
  headline: string;
  sub?: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
};

const DEFAULT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_21.16.24_643d4da1-27f3-4899-a525-6312fa46847e.jpg?v=1757964472';

export function FinalCta({
  eyebrow = 'Ready when you are',
  headline = 'A calmer dog, a kinder world. Start with one chew.',
  sub = 'Free shipping over USD 60. 30-day no-questions return. Email us if your dog disagrees — we’ll make it right.',
  ctaLabel = 'Shop the range',
  ctaHref = '/collections/all',
  image = DEFAULT_IMAGE,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-24 md:px-12 md:py-32">
      <motion.div
        initial={{opacity: 0, scale: 0.97}}
        whileInView={{opacity: 1, scale: 1}}
        viewport={{once: true}}
        transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-brand-deep shadow-2xl"
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{background: 'linear-gradient(135deg, rgba(45,90,61,0.4) 0%, transparent 50%, rgba(31,26,20,0.6) 100%)'}}
        />
        <div className="relative px-8 py-20 text-center text-paper md:px-20 md:py-32">
          {eyebrow && (
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-saffron-soft">
              {eyebrow}
            </p>
          )}
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.0]">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg">
              {sub}
            </p>
          )}
          <Link
            to={ctaHref}
            className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-saffron px-10 text-base font-medium text-ink transition hover:bg-saffron-deep hover:text-paper"
          >
            {ctaLabel}
            <svg className="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8h14M9 2l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p className="mt-6 text-xs uppercase tracking-wider text-paper/60">
            30-day return · Free shipping over USD 60 · Buy 1 · Help 1
          </p>
        </div>
      </motion.div>
    </section>
  );
}
