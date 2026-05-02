// Design lab — blank canvas page for iterative design exploration.
// Content is intentionally empty; sections are added one step at a
// time under direction. Inherits the standard PageLayout (header,
// footer, cart drawer, sticky helpers) so it renders inside the
// real storefront chrome instead of as a stripped iframe.
//
// Reach it at /preview while developing. Not linked from any
// navigation — discoverable only by direct URL.
import type {Route} from './+types/preview';

export const meta: Route.MetaFunction = () => [
  {title: 'Preview · AyurPet'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export default function Preview() {
  return (
    <main className="min-h-[60vh] bg-paper text-ink">
      {/* Blank canvas. Sections will be added per instructions. */}
    </main>
  );
}
