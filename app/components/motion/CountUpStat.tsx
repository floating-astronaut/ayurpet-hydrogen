// SSR-safe animated count-up. The final number renders on the server so the
// HTML matches what the client mounts with. After hydration, when the
// element enters the viewport, we briefly show 0 and ease back to `value`
// over `duration` ms. Honors prefers-reduced-motion.
import {useEffect, useRef, useState} from 'react';

type Props = {
  value: number;
  /** Decimal places to keep when rendering (e.g. 4.9 → decimals=1). */
  decimals?: number;
  duration?: number;
  /** Prefix glyph (e.g. "$"). */
  prefix?: string;
  /** Suffix glyph (e.g. "+"). */
  suffix?: string;
  /** Use locale-formatted thousands separators. */
  locale?: boolean;
  className?: string;
};

function format(n: number, decimals: number, locale: boolean): string {
  if (locale) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return n.toFixed(decimals);
}

export function CountUpStat({
  value,
  decimals = 0,
  duration = 1400,
  prefix,
  suffix,
  locale = true,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      setDisplay(0);
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - k, 3);
        setDisplay(value * eased);
        if (k < 1) raf = requestAnimationFrame(tick);
        else setDisplay(value);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            io.unobserve(entry.target);
            break;
          }
        }
      },
      {threshold: 0.4},
    );
    io.observe(node);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(display, decimals, locale)}
      {suffix}
    </span>
  );
}
