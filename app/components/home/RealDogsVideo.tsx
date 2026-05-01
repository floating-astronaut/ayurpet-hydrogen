// "Real dogs" video block. One short muted autoplay clip on the right,
// editorial copy on the left. The poster JPG renders before the video
// plays so the section never reads as an empty box; loading the mp4 is
// deferred via preload="metadata" so it doesn't compete with critical
// hero assets.
//
// Source clip is a 6s 720x1280 portrait — 1MB after the ffmpeg pass —
// so this lands well under the page's image budget.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

export function RealDogsVideo() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
        <ScrollReveal kind="rise-soft" className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-clay">
            Real dogs · real chew
          </p>
          <h2 className="mt-4 break-words font-display text-3xl leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-[3rem]">
            Six hours of quiet. The kitchen finally gets the morning back.
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-7 text-ink-soft sm:text-base sm:leading-8">
            No edits. No food styling. A single AyurPet yak cheese chew, and a
            dog who&rsquo;s genuinely into it. We send these home daily — this
            is what they look like once they get there.
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-4 border-t border-line/70 pt-5 text-[12px] text-ink-soft sm:max-w-md">
            <li className="flex items-baseline gap-2">
              <span className="font-display text-[1.25rem] leading-none text-brand">6h+</span>
              <span>average chew time</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="font-display text-[1.25rem] leading-none text-brand">1</span>
              <span>ingredient · yak cheese</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="font-display text-[1.25rem] leading-none text-brand">0</span>
              <span>preservatives, fillers</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="font-display text-[1.25rem] leading-none text-brand">100%</span>
              <span>vet-approved</span>
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal
          kind="rise"
          className="relative mx-auto w-full max-w-md min-w-0 overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_30px_90px_rgba(31,26,20,0.18)] sm:rounded-[2rem]"
        >
          <div className="relative aspect-[9/16]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/brand/dog-eating-chew-poster.jpg"
              aria-label="Dog enjoying an AyurPet yak cheese chew"
            >
              <source src="/brand/dog-eating-chew.webm" type="video/webm" />
              <source src="/brand/dog-eating-chew.mp4" type="video/mp4" />
            </video>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_55%,rgba(31,26,20,0.5)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-paper sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-paper/75">
                Filmed at home · @theayurpet
              </p>
              <p className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                He loves the Himalayan yak cheese chew.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
