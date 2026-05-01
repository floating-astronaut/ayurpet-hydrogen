// Reusable scroll-reveal wrapper.
// SSR strategy: children render in their FINAL state on the server. The
// "from" transform is applied with a CSS class that the IntersectionObserver
// removes once the element enters the viewport. If JS never runs (or the
// user prefers reduced motion) the content is visible by default — never
// stuck behind an animation.
import {useEffect, useRef, useState, type ReactNode} from 'react';

type Props = {
  children: ReactNode;
  /** Pixel offset before the element enters viewport. Default -10%. */
  rootMargin?: string;
  /** Animation kind. */
  kind?: 'fade' | 'rise' | 'rise-soft' | 'mask-up';
  /** Stagger children that have data-stagger="N" (0..N). */
  stagger?: boolean;
  /** Delay (ms) applied to the root before its own transition starts. */
  delay?: number;
  /** Optional className for the wrapper. */
  className?: string;
  /** Render `as` element. Defaults to div. */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'ul' | 'ol' | 'figure';
};

export function ScrollReveal({
  children,
  rootMargin = '0px 0px -10% 0px',
  kind = 'rise',
  stagger = false,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  // Default to "ready" so SSR / no-JS shows the final state.
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = ref.current;
    if (!node) return;
    // Hide it now (post-hydration) so we can animate in.
    setReady(false);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setReady(true);
            io.unobserve(entry.target);
            break;
          }
        }
      },
      {rootMargin, threshold: 0.05},
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={kind}
      data-reveal-stagger={stagger ? '' : undefined}
      data-reveal-ready={ready ? '' : undefined}
      style={delay ? ({transitionDelay: `${delay}ms`} as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
