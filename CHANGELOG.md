# Changelog — `ayurpet-hydrogen`

Auto-regenerated from `git log` by `/home/support/bin/changelog-regen`,
called before every push by `/home/support/bin/git-sync-all` (cron `*/15 * * * *`).

**Purpose:** traceability. If a push broke something, scan dates + short SHAs
here; then `git show <sha>` to see the diff, `git revert <sha>` to undo.

**Format:** UTC dates, newest first. Each entry: `time — subject (sha) — N files`.
Body text (if present) shown as indented sub-bullets.

---

## 2026-05-02

- **03:15 UTC** — auto-sync: 2026-05-02 03:15 UTC (`a61f014`) — 4 files
        M	app/components/pdp/goodgut/GoodGutVariantPicker.tsx
        M	app/lib/fragments.ts
        M	app/routes/products.$handle.tsx
        M	storefrontapi.generated.d.ts
- **02:51 UTC** — goodgut: real ingredient photography (Unsplash) + 'us vs them' compare + 'we refuse' clean blocks (`86f499f`) — 3 files
    Three structural moves lifted from the Native Pet "The Daily" PDP
    (nativepet.com/products/the-daily) — that page was the closest direct
    reference (herbal pet supplement, similar audience, premium DTC feel)
    and the founder confirmed it as the visual target.
    1. GoodGutCompare — "GoodGut+ vs. the typical multi-supplement
       routine". Six-row head-to-head comparison: Format, Daily ritual,
       Approach, Sourcing, Taste battle, Guarantee. Brand-green ✓ column
       on the left, clay ✗ column on the right. Mobile stacks; desktop
       is side-by-side with a vertical line divider. Pure editorial
       block — no asset dependency.
- **02:45 UTC** — auto-sync: 2026-05-02 02:45 UTC (`def12a7`) — 6 files
        A	app/components/pdp/goodgut/GoodGutClean.tsx
        A	app/components/pdp/goodgut/GoodGutCompare.tsx
        M	app/components/pdp/goodgut/GoodGutIngredients.tsx
        M	app/components/pdp/goodgut/GoodGutLanding.tsx
        M	tsconfig.tsbuildinfo
- **02:24 UTC** — goodgut: swipe gallery + click-to-zoom lightbox on the hero (`d6b08c3`) — 3 files
    Biggest single visible upgrade for the GoodGut+ PDP. Replaces the
    static HeroGalleryStage (single 4:5 packshot, no interaction) with a
    proper premium-DTC gallery — swipe carousel on mobile, click-to-zoom
    lightbox on every breakpoint. Uses Swiper + framer-motion (both
    already in the project), no new deps.
    New component
    - app/components/pdp/goodgut/GoodGutHeroGallery.tsx — three internal
      pieces:
      * MobileSwipeGallery: Swiper carousel of every gallery image,
        keyboard + a11y modules enabled, custom slim pagination strip
- **01:15 UTC** — auto-sync: 2026-05-02 01:15 UTC (`adc7a02`) — 9 files
        M	app/components/pdp/goodgut/GoodGutHero.tsx
        M	app/components/pdp/goodgut/GoodGutIngredients.tsx
        M	app/components/pdp/goodgut/GoodGutTrustChips.tsx
        M	app/components/pdp/goodgut/GoodGutVariantPicker.tsx
        M	app/components/pdp/goodgut/MadeForNotFor.tsx
        ... (+3 more)
- **01:00 UTC** — checkout: add Buy-it-now express button as Shop Pay fallback (`ba0984b`) — 5 files
    The <ShopPayButton> we wired earlier renders fine but its click flow
    silently does nothing on stores that don't have Shop Pay enabled or
    haven't authorised the headless storefront URL — that's the failure
    mode the user reported. Shop Pay-as-the-only-express-option is
    fragile.
    The headless equivalent of Liquid's `<button name="checkout">` is
    "add line to cart, then top-level redirect to cart.checkoutUrl". That
    works on every Shopify configuration, and is what the merchant theme
    falls back to when Shop Pay isn't there.
    New component
- **00:43 UTC** — checkout: plug Shop Pay accelerated checkout into PDPs (`8545aed`) — 5 files
    The Liquid main-product template renders dynamic checkout buttons via
    {{ form | payment_button }}. The Hydrogen-side equivalent is
    @shopify/hydrogen's <ShopPayButton>, which renders the wallet pill and
    routes the user straight to Shop Pay checkout without the cart drawer
    detour.
    Wiring
    - New thin wrapper at app/components/ShopPayExpress.tsx pulls the
      store domain from useRouteLoaderData('root') (already exposed via
      env.PUBLIC_STORE_DOMAIN in the root loader) and renders
      <ShopPayButton storeDomain={...} variantIds={[selectedVariant.id]}
- **00:14 UTC** — home polish: tighten mobile proof and product range titles (`efd6992`) — 2 files
- **00:00 UTC** — auto-sync: 2026-05-02 00:00 UTC (`bf3cd9a`) — 6 files
        M	app/components/home/ProductRange.tsx
        M	app/components/home/RealDogsVideo.tsx
        M	app/components/home/ShopTheShelf.tsx
        M	app/routes/_index.tsx
        M	tsconfig.tsbuildinfo

## 2026-05-01

- **23:53 UTC** — goodgut: balance chip and card vertical alignment (`bd0573d`) — 3 files
    Two adjacent fixes for the "text floats to the top of the box"
    imbalance the user flagged in mobile QA.
    1. GoodGutIngredients liquid-format callout (the dark green band):
       the 4 checkmark chips sit in a 2x2 grid on mobile, where one chip
       wraps to two lines and its row neighbour wraps to one. CSS Grid
       stretches both cells to the taller height, and `items-start` was
       pinning the shorter chip's text to the top, leaving an empty
       bottom half. Switched the chip li to `flex h-full items-center`,
       removed the `mt-0.5` nudge on the checkmark, and added `shrink-0`
       to the checkmark so it can't get squeezed when text is long.
- **23:44 UTC** — goodgut: drop cat-formula tease, reinforce per-day in closing CTA (`93eed9b`) — 4 files
    Two small tightening passes on the GoodGut+ landing page based on a
    fresh audit (no other gaps surfaced — typecheck + lint stayed green
    throughout).
    1. MadeForNotFor — the "Not a substitute for" column listed
       "Cats (we have a separate formula coming soon)". That line is the
       only reference to a future product on the entire conversion page,
       and it diverts cat-and-dog households into a wait posture instead
       of booking the dog purchase. Reframed to a clean exclusion:
       "Cats — formulated for canine digestion only".
    2. GoodGutClosing — the bottom-of-page CTA already showed the
- **23:30 UTC** — auto-sync: 2026-05-01 23:30 UTC (`b06faff`) — 18 files
        M	app/components/pdp/StickyAtc.tsx
        M	app/components/pdp/goodgut/GoodGutAPlus.tsx
        M	app/components/pdp/goodgut/GoodGutClosing.tsx
        M	app/components/pdp/goodgut/GoodGutCrossSell.tsx
        M	app/components/pdp/goodgut/GoodGutFAQ.tsx
        ... (+12 more)
- **22:27 UTC** — goodgut polish: native trust chips, bundle picker, real reviews, cross-sell (`44618f5`) — 8 files
    Closing the conversion-leak gaps from the audit. Five upgrades that
    move the GoodGut+ landing from "decent custom PDP" toward "premium
    storefront":
    1. Native trust chips above the fold (GoodGutTrustChips)
       FDA-registered facility · ISO 22000 · HACCP · Vet-formulated.
       Previously the same marks lived only inside the merchant A+
       artboards 70% down the page — invisible to crawlers and to scan-
       readers. Now they sit as a 4-up native chip rail next to the
       benefit chips, with inline SVG icons.
    2. Bundle-aware variant picker (GoodGutVariantPicker)
- **21:54 UTC** — goodgut: custom symptom-led product landing page (`31f1016`) — 13 files
    Built a dedicated landing for the GoodGut+ digestive drops product so
    the page sells the gut problem instead of reading like a generic PDP.
    The yak-chew flow and every other product still get the existing
    generic PDP unchanged.
    Routing
    - products.$handle.tsx now branches on product.handle. When the
      handle matches GOODGUT_HANDLE
      (goodgut-digestive-enzyme-drops-for-dog-natural-ayurvedic-formula)
      it renders <GoodGutLanding> with the full Storefront product +
      selected variant + product options. Hooks moved above the branch so
- **21:32 UTC** — home polish: fix 404s, hero scale, transitions, video, marquee tone (`3e8297b`) — 2 files
    Bugs
    - ShopTheShelf, MerchSpotlight and PDP BrandStrip referenced
      /brand/lifestyle-kelpie-resting, /lifestyle-corgi-chew and
      /lifestyle-kelpie-chewing without the -1200 size suffix that the
      optimization pipeline actually produced. Two routine tiles and the
      PDP campaign frame were rendering with naturalWidth=0 / 404. All
      three components now use the -1200 paths and resolve at runtime.
    - The hero <img> used React's camelCase fetchPriority prop, which
      triggers a "unknown DOM attribute" warning on this React version.
      Removed; the <img> still inherits eager loading.
- **21:30 UTC** — auto-sync: 2026-05-01 21:30 UTC (`bbfe308`) — 7 files
        M	app/components/MultiRowMarquee.tsx
        M	app/components/collection/MerchSpotlight.tsx
        M	app/components/home/FeaturedIn.tsx
        M	app/components/home/ShopTheShelf.tsx
        M	app/components/pdp/BrandStrip.tsx
        ... (+1 more)
- **21:12 UTC** — brand: wire real AyurPet media throughout the storefront (`4f87678`) — 65 files
    Pulled curated assets from the AyurPet Drive (folder
    11DGtEO7cyhU9_ZKphdK8Nb97sT9F7_oy) via the social-media-agent service
    account, optimized them, and replaced generic visuals across the
    storefront so the site reads as a real brand.
    Asset pipeline
    - 22 curated files inventoried and downloaded from Drive (logos,
      finished web banners, designed product carousels, AI-art lifestyle
      shots, IG-story proof creatives, one short product clip).
    - Pillow pass produced WebP + JPG fallbacks at responsive sizes.
    - IG-story screenshots cropped to remove phone chrome (status bar +
- **21:00 UTC** — auto-sync: 2026-05-01 21:00 UTC (`5c3e923`) — 2 files
        A	.drive-staging/folder-listing.json
- **20:27 UTC** — quality: hydration fix, CSP for fonts, retail tile redesign, premium cart (`807a584`) — 14 files
    Technical
    - StickyAtc no longer renders Money's <div> inside a <p>; both labels are
      spans, with Money as="span" so SSR HTML matches the React tree.
    - entry.server.tsx extends CSP styleSrc/fontSrc/imgSrc so Google Fonts
      (Fraunces + Inter) load reliably and the inline data:image SVG card
      texture renders without being blocked.
    Collection
    - ProductItem rebuilt as image-dominant retail tile: 4:5 stage, compact
      badges top-left, hover "View product" pill (desktop), 2-line title,
      smaller benefit, conversion-leading price row, sans-bold pricing.
- **20:15 UTC** — auto-sync: 2026-05-01 20:15 UTC (`6f9fa4e`) — 2 files
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
