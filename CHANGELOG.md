# Changelog — `ayurpet-hydrogen`

Auto-regenerated from `git log` by `/home/support/bin/changelog-regen`,
called before every push by `/home/support/bin/git-sync-all` (cron `*/15 * * * *`).

**Purpose:** traceability. If a push broke something, scan dates + short SHAs
here; then `git show <sha>` to see the diff, `git revert <sha>` to undo.

**Format:** UTC dates, newest first. Each entry: `time — subject (sha) — N files`.
Body text (if present) shown as indented sub-bullets.

---

## 2026-05-01

- **09:45 UTC** — auto-sync: 2026-05-01 09:45 UTC (`fc9bc54`) — 15 files
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
