# Changelog — `ayurpet-hydrogen`

Auto-regenerated from `git log` by `/home/support/bin/changelog-regen`,
called before every push by `/home/support/bin/git-sync-all` (cron `*/15 * * * *`).

**Purpose:** traceability. If a push broke something, scan dates + short SHAs
here; then `git show <sha>` to see the diff, `git revert <sha>` to undo.

**Format:** UTC dates, newest first. Each entry: `time — subject (sha) — N files`.
Body text (if present) shown as indented sub-bullets.

---

## 2026-05-01

- **20:15 UTC** — auto-sync: 2026-05-01 20:15 UTC (`79c90b4`) — 1 file
        M	app/components/pdp/StickyAtc.tsx
- **19:30 UTC** — auto-sync: 2026-05-01 19:30 UTC (`0f01255`) — 5 files
        A	app/components/home/MissionBand.tsx
        A	app/components/home/ShopTheShelf.tsx
        M	app/routes/_index.tsx
        M	tsconfig.tsbuildinfo
- **19:23 UTC** — quality: premium collection page + full PDP landing flow (`1683443`) — 9 files
    A focused round on collection + PDP page quality. Strips away anything
    that read as "raw Shopify grid" and replaces it with composed,
    merchandised retail moments. Adds the missing PDP middle-band content
    (why-this-works, reviews, faq, closing cta) so the route reads as a
    landing page, not just a product detail.
    Collection page (/collections/all + /collections/:handle)
      app/components/collection/CollectionHero.tsx
        Premium hero on a layered cream gradient + dual radial green/saffron
        glow. Breadcrumb-style eyebrow ("AyurPet / Shop all"). Big editorial
        title (text-4xl → text-[5.25rem]) with break-words. Optional
- **19:15 UTC** — auto-sync: 2026-05-01 19:15 UTC (`c194780`) — 7 files
        M	app/components/ProductItem.tsx
        A	app/components/collection/CollectionHero.tsx
        A	app/components/collection/ShopByNeed.tsx
        M	app/routes/collections.$handle.tsx
        M	app/routes/collections.all.tsx
        ... (+1 more)
- **18:48 UTC** — polish pass: scroll-reveal + count-up + richer trust/timeline + product-card refinement (`3558dd4`) — 1 file
    A focused round on making sections feel finished, not just animated.
    Introduces two reusable motion primitives, replaces the flat trust /
    how-to blocks with richer composed modules, and tightens product card
    visuals + homepage section rhythm.
    New reusable motion primitives
      app/components/motion/ScrollReveal.tsx
        SSR-safe wrapper that renders children visible by default. After
        hydration, an IntersectionObserver toggles a [data-reveal-ready]
        attribute and CSS handles the transition. Four kinds: fade, rise,
        rise-soft, mask-up. Optional [data-reveal-stagger] flag staggers
- **18:45 UTC** — auto-sync: 2026-05-01 18:45 UTC (`d15d382`) — 9 files
        M	app/components/ProductItem.tsx
        A	app/components/motion/CountUpStat.tsx
        A	app/components/motion/ScrollReveal.tsx
        A	app/components/pdp/HowItWorksTimeline.tsx
        A	app/components/pdp/RichTrustBand.tsx
        ... (+3 more)
- **10:24 UTC** — motion: gsap + split-type word reveal, vaul cart drawer, multi-row marquee, tilt cards (`0a58fde`) — 9 files
    Adds the visual / motion layer the storefront was missing. Five OSS libs
    installed (all MIT or equivalent), four concrete moments shipped.
    Deps
      gsap                 — declarative animation engine + ScrollTrigger
                             (free as of 3.13 under Webflow, all plugins MIT-equiv)
      split-type           — letter / word / line splitting for kinetic type
      vaul                 — drawer / sheet primitive (Linear / iOS-style)
      react-parallax-tilt  — 3D hover tilt with glare
      tsparticles          — installed for future ambient hero use (not yet wired)
    1. app/components/home/HeroWordReveal.tsx
- **10:10 UTC** — mobile pdp: stop content overflowing the viewport on narrow widths (`f6e17bc`) — 5 files
    The PDP detail panel and homepage hero were rendering wider than the
    viewport on mobile / narrow desktop windows — title, description,
    purchase-panel labels, and trust micro-copy all clipped on the right
    edge. Two things were causing it:
      1. CSS Grid auto track sizing. By default a grid track grows to its
         min-content. The h1 title (with text-wrap: balance + clamp font
         size) and the variant-pill row both have large min-content, so
         the grid track expanded past the container width whenever the
         parent didn't constrain it. We were not constraining it.
      2. textWrap: balance set inline on every section heading. In some
- **09:58 UTC** — mobile: storefront-wide responsive hardening pass (`ce3d532`) — 10 files
    Concrete mobile breakage that needed fixing:
      Hero headline (_index.tsx) was hardcoded text-[3.35rem] (53px). On
      iPhone SE / 320px viewports that's roughly 80% of the screen width
      for the first word, with no breakpoint floor. Replaced with inline
      clamp(2.5rem, 9vw, 7.4rem) + textWrap: balance so it fits 320px and
      still scales up to 7.4rem on lg. Featured-card subtitle also clamp-
      scaled (2.6rem mobile -> 4rem lg) and the awkward `|` separator
      replaced with em-dash, mirroring the PDP cleanTitle treatment.
      Header touch targets (Header.tsx) were h-10 w-10 (40px). iOS HIG and
      WCAG 2.5.5 both call for 44px minimum on tap targets. Bumped Search,
- **09:48 UTC** — cro: PDP info blocks + cart progress bar + collection hover-swap + press strip (`2e45477`) — 1 file
    Ships nine CRO checklist items across PDP, Cart, Collection, and Home —
    all from the AyurPet checklist sheet, all marked Done in docs/CRO_AUDIT.md
    and synced into the live sheet.
    PDP (app/routes/products.$handle.tsx — six new sections wired in)
      app/components/pdp/HowToUse.tsx
        Three-step explainer (Open the pouch → Offer once a day → Watch the
        routine). Editorial split: brand eyebrow + serif title on left, a
        structured numbered ordered list on right with brand-deep saffron
        counters. No decorative cards.
        → CRO Product Page row 102
- **09:45 UTC** — auto-sync: 2026-05-01 09:45 UTC (`c12deac`) — 16 files
        M	app/components/CartMain.tsx
        A	app/components/CartProgress.tsx
        M	app/components/ProductItem.tsx
        A	app/components/home/FeaturedIn.tsx
        A	app/components/pdp/HowToUse.tsx
        ... (+10 more)
- **09:37 UTC** — docs: CRO checklist scaffold + sheet sync (`6fbe060`) — 3 files
    Wire the AyurPet CRO checklist (Google Sheet) into the repo so progress
    tracking lives in code and stays in sync with the sheet automatically.
      docs/CRO_CHECKLIST.md
        Snapshot of all 9 tabs (~330 items) extracted from
        https://docs.google.com/spreadsheets/d/1nH4Y2EUXDKcnlgFTHWE5Dpe2k7wxEz44sWxh_8fpGt0
        Read with the existing Google service account
        glitch-vertex-ai@capable-boulder-487806-j0.iam.gserviceaccount.com.
      docs/CRO_AUDIT.md
        Living mapping of every actionable checklist row to its current
        state in the Hydrogen storefront, with a one-line code-proof per
- **09:21 UTC** — visual polish pass — header, footer, PDP, collections, homepage rhythm (`2639178`) — 7 files
    A storefront-wide pass focused on restraint and confidence over decoration.
    Lessons from the Codex homepage applied across the rest of the surfaces:
    big confident type, strip out repeated decorative cards, drop generic
    badges/copy that appear on every product, and let images carry sections.
    Header (app/components/Header.tsx)
    - Drop the green "AP" circle. Replace with a clean serif AyurPet wordmark
      + small uppercase "Global" subtitle.
    - Sticky on scroll, paper background with 70% backdrop-blur.
    - Active link gets an underline tab below the header rather than a color
      swap; clearer current-page state, more editorial.
- **09:15 UTC** — auto-sync: 2026-05-01 09:15 UTC (`be60c44`) — 7 files
        M	app/components/Footer.tsx
        M	app/components/Header.tsx
        M	app/components/ProductItem.tsx
        M	app/routes/_index.tsx
        M	app/routes/products.$handle.tsx
        ... (+1 more)
- **09:08 UTC** — chore: drop unused homepage components (`71b6310`) — 4 files
    After Codex rebuilt the homepage in 062ab2a around an inline editorial
    layout (gradient hero card + trust strip + 3 routines + ProductRange +
    brand-deep CTA), the earlier Hero / StoryStrip / IngredientExplorer /
    FinalCta components in app/components/home/ are no longer imported by
    any route. Removing them so the tree reflects what's actually shipped.
    Kept: app/components/home/ProductRange.tsx (still imported by _index.tsx).
    If we want any of these patterns back later, they're recoverable from
    the commit history (7296d74 added them; 154cc77 fixed the Hero
    hydration mismatch).
- **08:54 UTC** — hydrogen: sync storefront generated types (`e3e6a37`) — 2 files
- **08:45 UTC** — auto-sync: 2026-05-01 08:45 UTC (`062ab2a`) — 11 files
        M	app/components/AddToCartButton.tsx
        M	app/components/Footer.tsx
        M	app/components/Header.tsx
        M	app/components/ProductForm.tsx
        M	app/components/ProductItem.tsx
        ... (+5 more)
- **08:22 UTC** — hydrogen: fix storefront type baseline (`b1a0846`) — 4 files
- **08:16 UTC** — fix: hydration mismatch on homepage hero (`154cc77`) — 2 files
    Framer Motion's initial/animate pair on the Hero rendered the "before"
    state into server HTML and immediately animated on client mount, making
    React 18 throw "Hydration failed because the initial UI does not match"
    and falling back to a full client re-render (the visual stutter you'd
    have seen).
    Switch the entry animations to a CSS-only pattern: server HTML carries
    the final state inline with opacity/transform reset via [data-stagger]
    selectors, then we set data-loaded="" on the section in a useEffect to
    trigger the staggered transitions. SSR markup matches client markup
    exactly. Also moved the marquee strip from motion.div to a CSS keyframe
- **08:13 UTC** — homepage: real Ayurpet brand on Hydrogen (`7296d74`) — 8 files
    Rebuild the homepage with five editorial sections, all pure React +
    Tailwind v4 + Framer Motion + Swiper, reading live data from the
    Storefront API:
    - Hero: full-bleed scroll-driven layout, 7-vw clamp serif headline,
      parallax product image (uses the anchor product's featuredImage from
      Storefront API), animated callout chips ("Ashwagandha", "Himalayan"),
      brand marquee strip running across the bottom.
    - StoryStrip: 4 brand pillars (Vet-approved · Lab-tested ·
      Himalayan-sourced · Buy 1 · Help 1) with custom inline-SVG icons,
      hover lift, saffron underline animation on the top edge.
- **08:04 UTC** — ayurpet hydrogen dev: brand tokens + cart fix + public preview (`acb3169`) — 3 files
    - Port Ayurpet brand tokens from the Liquid theme's tokens.json into the
      Tailwind v4 CSS-first config (app/styles/tailwind.css). Colors, fonts,
      radii now available as Tailwind utilities (bg-cream, text-ink-soft,
      font-display, etc.). Includes the wine/ink direction from Codex's PDP
      refactor for darker editorial sections.
    - Fix cart 400/500: vite.config.ts had a duplicate server block (Hydrogen
      scaffolded one at the bottom of the file that silently overwrote ours).
      Merged into one server block with allowedHosts covering both
      .glitchexecutor.com and .tryhydrogen.dev. Reverted the nginx Host
      rewrite that was a workaround — cart cookies now use the correct domain.
- **06:42 UTC** — Lockfile (`9126b49`) — 1 file
- **06:41 UTC** — Generate routes for core functionality (`290f420`) — 44 files
- **06:41 UTC** — Setup Tailwind v4 (`a8dc1dc`) — 4 files
- **06:41 UTC** — Scaffold Storefront (`9301204`) — 41 files
