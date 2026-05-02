// "Real dogs" video block. One short muted autoplay clip on the right,
// editorial copy + 4 spec stats on the left. The poster JPG renders
// before the video plays so the section never reads as an empty box;
// the mp4 is preload="metadata" so it doesn't compete with the hero.
//
// Source clip is a 6s 720x1280 portrait — ~1MB after the ffmpeg pass —
// so this lands well under the page's image budget.
import {ScrollReveal} from '~/components/motion/ScrollReveal';

export function RealDogsVideo() {
  return (
    <section className="border-y border-line bg-[linear-gradient(135deg,#f7f0e1_0%,#efe3cc_100%)]">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.55fr)] lg:items-center lg:gap-14 lg:px-10 lg:py-16">
        <ScrollReveal kind="rise-soft" className="min-w-0 rounded-[1.5rem] border border-line/70 bg-paper/72 p-5 shadow-[0_18px_55px_rgba(31,26,20,0.06)] backdrop-blur sm:rounded-[2rem] sm:p-7">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-clay">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            Real customer clip
          </p>
          <h2 className="mt-4 break-words font-display text-[2rem] leading-[1.05] tracking-tight text-ink sm:text-[2.5rem] lg:text-[3.1rem]">
            Six hours of quiet. The kitchen finally gets the morning back.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-7 text-ink-soft sm:mt-5 sm:text-[15.5px] sm:leading-8">
            One AyurPet yak cheese chew, no edits, no food styling. This is
            what the chew looks like once it&rsquo;s home.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 border-t border-line/70 pt-5 sm:max-w-xl sm:grid-cols-4">
            {[
              ['6h+', 'average chew time'],
              ['1', 'ingredient · yak cheese'],
              ['0', 'preservatives · fillers'],
              ['100%', 'vet-approved'],
            ].map(([n, label]) => (
              <li key={String(label)} className="rounded-2xl border border-line/60 bg-cream/70 p-3">
                <span className="block font-display text-[1.45rem] leading-none text-brand">
                  {n}
                </span>
                <span className="mt-1.5 block text-[11px] leading-snug text-ink-soft">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal
          kind="rise"
          className="relative mx-auto w-full max-w-[310px] min-w-0 overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_26px_70px_rgba(31,26,20,0.18)] sm:max-w-[340px] sm:rounded-[2rem] lg:max-w-[360px]"
        >
          <div className="relative aspect-[9/16]">
            {/* Poster image renders immediately so the section never reads
                as an empty card while the video loads. */}
            <img
              src="/brand/dog-eating-chew-poster.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              width={720}
              height={1280}
            />
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/brand/dog-eating-chew-poster.jpg"
              aria-label="A dog enjoying an AyurPet yak cheese chew"
            >
              <source src="/brand/dog-eating-chew.webm" type="video/webm" />
              <source src="/brand/dog-eating-chew.mp4" type="video/mp4" />
            </video>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_55%,rgba(31,26,20,0.55)_100%)]"
            />

            {/* Loop indicator — small UI tag so the muted autoplay is legible */}
            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-paper backdrop-blur">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M3 3h4l-1.2-1.2M9 9H5l1.2 1.2M9 5V3a1 1 0 0 0-1-1H5M3 7v2a1 1 0 0 0 1 1h3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Looped · muted
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 text-paper sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper/80">
                Filmed at home · @theayurpet
              </p>
              <p className="mt-1.5 font-display text-lg leading-tight sm:text-xl">
                He loves the Himalayan yak cheese chew.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
