// Vertical timeline replacing the static HowToUse panel.
// Each step is a row with a numbered marker, dot, and copy. As the user
// scrolls, an IntersectionObserver activates the dot for the step nearest
// the viewport center — gives the section a "progressive reveal" feel
// without scroll-jacking. Honors prefers-reduced-motion (no observer).
import {useEffect, useRef, useState} from 'react';
import {ScrollReveal} from '~/components/motion/ScrollReveal';

type Step = {n: string; title: string; body: string};

const DEFAULT_STEPS: Step[] = [
  {
    n: '01',
    title: 'Open the pouch',
    body: 'Resealable, smell-locked pouch. Single-ingredient yak chew or Ayurvedic supplement, ready to serve.',
  },
  {
    n: '02',
    title: 'Offer once a day',
    body: 'For chews, hand-feed or place on a clean mat. For drops, mix into food or water. Two to three sessions per week is a typical rhythm.',
  },
  {
    n: '03',
    title: 'Watch the routine',
    body: 'Most pet parents see calmer evenings, firmer stools, or quieter chew time within two weeks. Pause anytime; resume on the dog’s pace.',
  },
];

export function HowItWorksTimeline({steps = DEFAULT_STEPS}: {steps?: Step[]}) {
  const containerRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = containerRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-step-index]'));
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose center is closest to viewport center.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const winCenter = window.innerHeight / 2;
        let best: IntersectionObserverEntry | null = null;
        let bestDist = Infinity;
        for (const e of visible) {
          const r = e.boundingClientRect;
          const d = Math.abs(r.top + r.height / 2 - winCenter);
          if (d < bestDist) {
            bestDist = d;
            best = e;
          }
        }
        if (best) {
          const idx = Number((best.target as HTMLElement).dataset.stepIndex);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      {threshold: [0.4, 0.6, 0.8]},
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand">
            How it works
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Three steps. Two to three weeks to a real change.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-ink-muted sm:text-base sm:leading-8">
            Read down — the active step lights up as you scroll past it. No
            magic timing, no commitment to a daily reminder app.
          </p>
        </ScrollReveal>

        <ol
          ref={containerRef}
          className="ayur-timeline relative min-w-0"
          aria-label="How AyurPet fits into your dog's day"
        >
          {steps.map((s, i) => {
            const active = i === activeIndex;
            return (
              <li
                key={s.n}
                data-step-index={i}
                data-active={active ? '' : undefined}
                className="ayur-timeline-step relative grid grid-cols-[2.4rem_1fr] items-start gap-x-4 py-6 transition-opacity duration-500"
                style={{opacity: active ? 1 : 0.55}}
              >
                <span
                  className={`block pl-2 font-display text-2xl leading-none transition-colors duration-300 ${
                    active ? 'text-brand' : 'text-ink-muted'
                  }`}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm leading-7 text-ink-muted sm:text-[15px]">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
