// 4-pillar brand strip — Vet · Lab · Mountain · Paw — with hover lift.
import {motion} from 'framer-motion';

type Pillar = {icon: 'vet' | 'lab' | 'mountain' | 'paw'; title: string; body: string};
type Props = {eyebrow?: string; title: string; pillars?: Pillar[]};

const ICONS: Record<Pillar['icon'], JSX.Element> = {
  vet: (
    <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  lab: (
    <>
      <path d="M9 3v6L4 19a2 2 0 002 3h12a2 2 0 002-3l-5-10V3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  mountain: (
    <path d="M3 20l6-10 4 6 3-4 5 8H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  paw: (
    <>
      <circle cx="6" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 6-4 6-4-3.8-4-6z" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
};

const DEFAULT_PILLARS: Pillar[] = [
  {icon: 'vet', title: 'Vet-approved', body: 'Every formula reviewed by practising vets who specialise in canine wellness.'},
  {icon: 'lab', title: 'Lab-tested', body: 'Third-party labs certify potency and purity — no heavy metals, no hidden additives.'},
  {icon: 'mountain', title: 'Himalayan-sourced', body: 'Yak chews aged at 4,000m by herder co-ops who have done it for generations.'},
  {icon: 'paw', title: 'Buy 1 · Help 1', body: 'Every order feeds a parentless dog through our partner shelters across India.'},
];

export function StoryStrip({eyebrow = 'Why Ayurpet', title = 'Built on principles, not pet-store shortcuts.', pillars = DEFAULT_PILLARS}: Props) {
  return (
    <section className="relative bg-cream px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-brand">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1] text-ink">
            {title}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{opacity: 0, y: 30, rotate: -1}}
              whileInView={{opacity: 1, y: 0, rotate: 0}}
              viewport={{once: true, margin: '-80px'}}
              transition={{duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1]}}
              className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper p-8 transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform group-hover:scale-x-100"
                style={{background: 'var(--color-saffron)'}}
              />
              <div className="text-brand">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  {ICONS[p.icon]}
                </svg>
              </div>
              <h3 className="mt-6 font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
