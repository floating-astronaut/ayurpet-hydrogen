// Scroll-reveal alternating ingredient cards. Each card scales + fades as it
// crosses the viewport; brand-tinted gradient overlays on each image for cohesion.
import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';

type Ingredient = {
  name: string;
  latin?: string;
  blurb: string;
  benefit: string;
  image: string;
  accent: 'brand' | 'saffron' | 'clay';
};

type Props = {
  eyebrow?: string;
  title?: string;
  ingredients?: Ingredient[];
};

const ACCENT_VAR: Record<Ingredient['accent'], string> = {
  brand: 'var(--color-brand)',
  saffron: 'var(--color-saffron-deep)',
  clay: 'var(--color-clay)',
};

const DEFAULTS: Ingredient[] = [
  {
    name: 'Ashwagandha',
    latin: 'Withania somnifera',
    blurb: "The calmer. Ayurveda's revered adaptogen helps dogs settle the nervous system through storms, separation, vet visits — without sedation.",
    benefit: 'Calm · Anxiety · Sleep',
    image: 'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_21.19.22.jpg?v=1757964471',
    accent: 'brand',
  },
  {
    name: 'Turmeric',
    latin: 'Curcuma longa',
    blurb: "The healer. Curcumin's anti-inflammatory profile is a quiet hero for senior joints and skin — paired with black pepper for absorption.",
    benefit: 'Joints · Skin · Recovery',
    image: 'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_21.52.19_017e648f-f376-46c6-93f0-a02567322835.jpg?v=1757964476',
    accent: 'saffron',
  },
  {
    name: 'Himalayan Yak',
    latin: 'Bos grunniens',
    blurb: 'The chew. Slow-aged yak cheese from 4,000m altitudes — high-protein, lactose-light, lasts hours. Sustainably sourced from Himalayan herders.',
    benefit: 'Dental · Long-lasting · Single-ingredient',
    image: 'https://cdn.shopify.com/s/files/1/0782/4657/6363/files/WhatsApp_Image_2025-04-23_at_20.53.08_3_13c8c22e-586b-4ce5-a2ce-b8e4116ca879.jpg?v=1757964478',
    accent: 'clay',
  },
];

function IngredientCard({ing, idx, total}: {ing: Ingredient; idx: number; total: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{scale, opacity}}
      className="grid items-center gap-10 md:grid-cols-12 md:gap-16"
    >
      <div className={`md:col-span-7 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] shadow-2xl"
          style={{background: ACCENT_VAR[ing.accent]}}
        >
          <img
            src={ing.image}
            alt={ing.name}
            loading="lazy"
            className="h-full w-full object-cover mix-blend-luminosity opacity-90"
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{background: `linear-gradient(180deg, transparent 50%, ${ACCENT_VAR[ing.accent]} 100%)`}}
          />
          <div className="absolute bottom-6 left-6 text-paper">
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-75">
              {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
            <div className="font-display text-4xl">{ing.name}</div>
          </div>
        </div>
      </div>
      <div className={`md:col-span-5 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
        {ing.latin && <p className="font-display italic text-ink-muted">{ing.latin}</p>}
        <h3 className="mt-2 font-display text-4xl leading-[1.05] text-ink md:text-5xl">{ing.name}</h3>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{ing.blurb}</p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{background: ACCENT_VAR[ing.accent]}}
          />
          {ing.benefit}
        </div>
      </div>
    </motion.div>
  );
}

export function IngredientExplorer({
  eyebrow = 'The roots of the formula',
  title = 'Three ingredients. Centuries of evidence.',
  ingredients = DEFAULTS,
}: Props) {
  return (
    <section className="relative bg-paper px-6 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-brand">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1] text-ink">
            {title}
          </h2>
        </div>
        <div className="mt-24 space-y-32">
          {ingredients.map((ing, i) => (
            <IngredientCard key={ing.name} ing={ing} idx={i} total={ingredients.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
