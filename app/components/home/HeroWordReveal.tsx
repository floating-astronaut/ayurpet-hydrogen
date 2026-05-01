// Editorial word-by-word reveal for the homepage hero h1.
// Uses split-type to break the heading into per-word spans and GSAP to
// stagger them in. ScrollTrigger replays the reveal whenever the heading
// re-enters the viewport.
//
// SSR-safe: the heading renders with the *final* CSS state on the server
// (visible, untransformed). The split + animate pass runs only after
// hydration in a useEffect, so React 18 sees identical server/client HTML
// and never throws a hydration mismatch.
import {useEffect, useRef} from 'react';

type Props = {
  text: string;
  className?: string;
};

export function HeroWordReveal({text, className}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{default: SplitType}, {default: gsap}, {ScrollTrigger}] =
        await Promise.all([
          import('split-type'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
      if (cancelled || !ref.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const split = new SplitType(ref.current, {
        types: 'words',
        wordClass: 'ayur-word',
      });

      const words = (split.words ?? []) as HTMLElement[];
      // Mask each word so it slides in from beneath its own line clipping.
      words.forEach((w) => {
        w.style.display = 'inline-block';
        w.style.willChange = 'transform, opacity';
      });

      const tween = gsap.fromTo(
        words,
        {yPercent: 110, opacity: 0},
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.85,
          stagger: 0.05,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [text]);

  return (
    <h1 ref={ref} className={className}>
      {text}
    </h1>
  );
}
