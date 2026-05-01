// "Buy 1 · Help 1" mission band. A confident, single-statement section that
// explains the giving program without reading like a footer disclaimer.
// Sits late on the homepage, after merchandising blocks, before the closing
// CTA — so the brand pitch lands once the visitor has seen the product story.
import {Link} from 'react-router';
import {ScrollReveal} from '~/components/motion/ScrollReveal';
import {CountUpStat} from '~/components/motion/CountUpStat';

export function MissionBand() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_12%_25%,rgba(45,90,61,0.10),transparent_45%),radial-gradient(circle_at_88%_75%,rgba(217,148,65,0.12),transparent_45%)]"
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-center lg:gap-20 lg:px-10 lg:py-24">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.32em] text-clay">
            Buy one · Help one
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            Every chew you buy feeds a parentless dog in India.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink-soft sm:text-base sm:leading-8">
            We work with shelter partners across Mumbai, Bangalore, Delhi and
            Pune. Your order doesn&rsquo;t just feed your dog — it funds a
            warm meal for one without a home. Receipts go up on Instagram on
            the first of every month.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pages/about"
              prefetch="intent"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand transition hover:border-brand hover:bg-brand hover:text-paper"
            >
              Read the mission
              <span aria-hidden>→</span>
            </Link>
            <a
              href="https://www.instagram.com/theayurpet/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink-muted transition hover:text-ink"
            >
              Follow the receipts
              <span aria-hidden>↗</span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal kind="rise-soft" stagger className="min-w-0">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="ayur-card-frame rounded-[1.25rem] border border-line bg-paper p-6 text-center shadow-[0_18px_50px_rgba(31,26,20,0.06)] sm:p-7">
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-brand">
                <CountUpStat value={42} suffix="k+" />
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-ink">
                Meals funded
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">
                Across partner shelters in 2025
              </p>
            </div>
            <div className="ayur-card-frame rounded-[1.25rem] border border-line bg-paper p-6 text-center shadow-[0_18px_50px_rgba(31,26,20,0.06)] sm:p-7">
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-clay">
                <CountUpStat value={11} />
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-ink">
                Shelter partners
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">
                Mumbai · Pune · Bangalore · Delhi
              </p>
            </div>
            <div className="col-span-2 rounded-[1.25rem] border border-line bg-paper p-6 shadow-[0_18px_50px_rgba(31,26,20,0.06)] sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-saffron-deep">
                Latest receipt · April 2026
              </p>
              <p className="mt-3 font-display text-xl leading-tight text-ink sm:text-2xl">
                3,841 meals delivered to shelters this month.
              </p>
              <p className="mt-2 text-[13px] leading-6 text-ink-muted">
                Posted with photos and stamped vendor invoice on @theayurpet — every chew you bought funded one bowl.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
