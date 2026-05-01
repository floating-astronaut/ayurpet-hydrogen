// Native trust marks + provenance line as a slim standalone section.
// Pulled out of the hero (audit feedback: hero was overstuffed) and
// rendered as a single quiet strip just below the purchase decision.
import {LandingSection} from './primitives';
import {GoodGutTrustChips} from './GoodGutTrustChips';

export function GoodGutTrustStrip() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <GoodGutTrustChips />
        <p className="mt-5 inline-flex items-center gap-2 text-[11.5px] leading-snug text-ink-muted">
          <span
            aria-hidden
            className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M1.5 6h9M6 1.5c1.5 1.5 1.5 7.5 0 9M6 1.5c-1.5 1.5-1.5 7.5 0 9"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
          Crafted in India · Vet-formulated · Manufactured in an FDA-registered facility
        </p>
      </div>
    </section>
  );
}

// Re-export to make import paths predictable for the orchestrator.
export {LandingSection};
