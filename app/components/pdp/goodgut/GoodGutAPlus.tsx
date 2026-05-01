// Wraps the existing Shopify descriptionHtml in a branded "A+ content"
// container. We intentionally don't surface this near the top — it sits
// late on the page as supporting proof for visitors who want the full
// brand-built deck.
//
// The wrapper does three things:
// 1. Provides editorial chrome (eyebrow + headline) so the section reads
//    as part of the design, not pasted Shopify default HTML.
// 2. Constrains image radius + drop shadow + max-width via the
//    .ayur-aplus class in app.css.
// 3. Renders the descriptionHtml via dangerouslySetInnerHTML inside that
//    container — preserving the merchant's authored content + images.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

export function GoodGutAPlus({html}: {html: string}) {
  if (!html) return null;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">
            The full brand deck
          </p>
          <h2 className="mt-4 break-words font-display text-[1.85rem] leading-[1.05] tracking-tight text-ink sm:text-[2.4rem] lg:text-[3rem]">
            Why GoodGut+ is built differently.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-7 text-ink-soft sm:text-[15.5px] sm:leading-8">
            Pulled from the brand source-of-truth in Shopify — these are the
            same A+ visuals merchandising authored, framed in the storefront
            design system.
          </p>
        </ScrollReveal>

        <ScrollReveal
          kind="rise-soft"
          className="ayur-aplus mt-10 rounded-[1.5rem] border border-line/70 bg-paper p-6 shadow-[0_18px_60px_rgba(31,26,20,0.06)] sm:p-10 lg:p-12"
        >
          <div dangerouslySetInnerHTML={{__html: html}} />
        </ScrollReveal>
      </div>
    </section>
  );
}
