// GoodGut+ custom product landing page. Composes the GoodGut-specific
// sections in conversion-led order:
//
//   hero (purchase + symptom-led copy)
//   ↓ symptom checker
//   ↓ ingredients + liquid-format pillar
//   ↓ trial results (81% / 76% / 74% / 92%)
//   ↓ how to use + dosage table
//   ↓ made for / not for
//   ↓ Reviews (reused from generic PDP — universally relevant)
//   ↓ A+ content from descriptionHtml (branded wrapper)
//   ↓ FAQ (digestive-specific)
//   ↓ closing CTA → bounces back to purchase panel
//   ↓ sticky mobile ATC (reused)
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

  // Display title without the noisy `|` separators Shopify carries.
  const displayTitle = product.title.replace(/\s*\|\s*/g, ' — ');

  return (
    <main className="overflow-x-clip bg-paper pb-24 text-ink lg:pb-0">
      <GoodGutHero
        product={product}
        productOptions={productOptions}
        selectedVariant={selectedVariant}
        galleryImages={gallery}
      />

      <SymptomChecker />

      <GoodGutIngredients />

      <TrialResults />

      <GoodGutHowToUse />

      <MadeForNotFor />

      {/* GoodGut-specific reviews — five testimonials each tied to a
          digestive symptom (gas, picky eating, paw-licking, stool, senior
          digestion). Replaces the inherited yak-chew testimonials. */}
      <GoodGutReviews />

      {/* The merchant's authored A+ content, wrapped in a branded
          container so it reads as part of the page instead of pasted
          Shopify HTML. */}
      {product.descriptionHtml ? (
        <GoodGutAPlus html={product.descriptionHtml} />
      ) : null}

      <ShippingReturns />

      <GoodGutFAQ />

      {/* Cross-sell — Hip-O-Joint+ companion formula. Lifts the
          merchant's "Two Targeted Formulas, One Complete System" pitch
          out of the static A+ artboard and into a real shoppable rail. */}
      <GoodGutCrossSell />

      <GoodGutClosing selectedVariant={selectedVariant} />

      {/* Sticky mobile ATC — reused, wired to the same selected variant. */}
      <StickyAtc
        productTitle={displayTitle}
        thumbnail={(gallery[0] as StorefrontImage | null) ?? null}
        selectedVariant={selectedVariant}
      />
    </main>
  );
}
