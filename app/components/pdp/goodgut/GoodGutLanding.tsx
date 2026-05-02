// GoodGut+ custom product landing page. Composes the GoodGut-specific
// sections in conversion-led order, with magazine-style editorial
// image breaks injected at the heaviest content seams so the page
// reads visually instead of as an unbroken column of card grids.
//
//   hero (mobile-compressed; image+H1+stars+price+ATC above the fold)
//   ↓ trust strip (FDA / ISO / HACCP / Vet-formulated chips)
//   ↓ symptom checker
//   ↓ EDITORIAL BREAK · gallery[1] · "Built for the bowl, not the pill jar"
//   ↓ ingredients + liquid-format pillar
//   ↓ trial results
//   ↓ us vs the typical multi-supplement routine (compare block)
//   ↓ what's NOT in the drops (clean block)
//   ↓ EDITORIAL BREAK · gallery[2] · "30 seconds, once a day"
//   ↓ how to use + dosage table
//   ↓ made for / not for
//   ↓ digestion-specific reviews (3 visible + Read-more reveal)
//   ↓ EDITORIAL BREAK · gallery[3] · silent
//   ↓ A+ content — 3 curated panels + Full brand deck disclosure
//   ↓ ShippingReturns
//   ↓ FAQ
//   ↓ Hip-O-Joint+ cross-sell rail
//   ↓ closing CTA → bounces back to data-purchase-anchor
//   ↓ sticky mobile ATC (compact title + full Add-to-cart text)
//
// The handle branch in products.$handle.tsx renders this landing
// instead of the generic flow when product.handle === GOODGUT_HANDLE.
import type {ProductFragment} from 'storefrontapi.generated';
import type {Image as StorefrontImage} from '@shopify/hydrogen/storefront-api-types';
import {ProductForm} from '~/components/ProductForm';
import {GoodGutHero} from './GoodGutHero';
import {SymptomChecker} from './SymptomChecker';
import {GoodGutIngredients} from './GoodGutIngredients';
import {TrialResults} from './TrialResults';
import {GoodGutHowToUse} from './GoodGutHowToUse';
import {MadeForNotFor} from './MadeForNotFor';
import {GoodGutAPlus} from './GoodGutAPlus';
import {GoodGutFAQ} from './GoodGutFAQ';
import {GoodGutClosing} from './GoodGutClosing';
import {GoodGutReviews} from './GoodGutReviews';
import {GoodGutCrossSell} from './GoodGutCrossSell';
import {GoodGutCompare} from './GoodGutCompare';
import {GoodGutClean} from './GoodGutClean';
import {GoodGutTrustStrip} from './GoodGutTrustStrip';
import {EditorialImageBreak} from './EditorialImageBreak';
import {ShippingReturns} from '~/components/pdp/ShippingReturns';
import {StickyAtc} from '~/components/pdp/StickyAtc';

type Props = {
  product: ProductFragment;
  productOptions: React.ComponentProps<typeof ProductForm>['productOptions'];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
};

export function GoodGutLanding({
  product,
  productOptions,
  selectedVariant,
}: Props) {
  // Build a stable gallery: dedupe by id, prefer variant image first.
  const gallery: StorefrontImage[] = (() => {
    const acc: StorefrontImage[] = [];
    const seen = new Set<string>();
    const push = (img?: StorefrontImage | null) => {
      if (img?.id && !seen.has(img.id)) {
        seen.add(img.id);
        acc.push(img);
      }
    };
    push(selectedVariant?.image as StorefrontImage | undefined);
    push(product.featuredImage as StorefrontImage | undefined);
    product.images.nodes.forEach((n) => push(n as StorefrontImage));
    return acc;
  })();

  const variantTitle =
    selectedVariant?.title &&
    selectedVariant.title.toLowerCase() !== 'default title'
      ? selectedVariant.title
      : null;

  // Sticky ATC compact label — short brand mark, never the full SEO title.
  const compactTitle = variantTitle
    ? `GoodGut+ · ${variantTitle}`
    : 'GoodGut+ Drops';

  return (
    // pb-24 on mobile clears the ~70px sticky ATC bar + safe area inset
    // so the closing band's CTA never sits underneath it.
    <main className="overflow-x-clip bg-paper pb-24 text-ink lg:pb-0">
      <GoodGutHero
        product={product}
        productOptions={productOptions}
        selectedVariant={selectedVariant}
        galleryImages={gallery}
      />

      <GoodGutTrustStrip />

      <SymptomChecker />

      {/* Editorial break #1 — bridges symptom-checker → ingredients.
          Lets the product speak before the ingredient deep-dive. */}
      <EditorialImageBreak
        image={gallery[1] ?? gallery[0]}
        mode="wide"
        eyebrow="Built for the bowl"
        caption={<>Liquid drops &mdash; not pills, not powder.</>}
      />

      <GoodGutIngredients />

      <TrialResults />

      <GoodGutCompare />

      <GoodGutClean />

      {/* Editorial break #2 — bridges the dense compare/clean block
          rhythm into the calmer how-to-use ritual. */}
      <EditorialImageBreak
        image={gallery[2] ?? gallery[1] ?? gallery[0]}
        mode="wide"
        eyebrow="The daily ritual"
        caption={<>30 seconds. Once a day. Mixed straight into the food.</>}
      />

      <GoodGutHowToUse />

      <MadeForNotFor />

      <GoodGutReviews />

      {/* Editorial break #3 — silent break before A+ content (the
          merchant-authored brand deck). Lets the page breathe before
          a long content block. */}
      <EditorialImageBreak
        image={gallery[3] ?? gallery[2] ?? gallery[1] ?? gallery[0]}
        mode="wide"
      />

      {product.descriptionHtml ? (
        <GoodGutAPlus
          html={product.descriptionHtml}
          images={gallery}
        />
      ) : null}

      <ShippingReturns />

      <GoodGutFAQ />

      <GoodGutCrossSell />

      <GoodGutClosing selectedVariant={selectedVariant} />

      {/* Sticky mobile ATC — compact title, full Add-to-cart text,
          appears only after the in-page purchase panel scrolls out. */}
      <StickyAtc
        productTitle={product.title}
        compactTitle={compactTitle}
        thumbnail={(gallery[0] as StorefrontImage | null) ?? null}
        selectedVariant={selectedVariant}
      />
    </main>
  );
}
