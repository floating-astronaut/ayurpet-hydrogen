import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Allow Google Fonts stylesheet + woff2 host so the premium Fraunces +
    // Inter typography renders reliably in production. Without these,
    // browsers block the @import in tailwind.css and fall back to system
    // fonts — which is what made the storefront read as "plain" earlier.
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
      'http://localhost:*',
    ],
    fontSrc: [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://cdn.shopify.com',
    ],
    // Inline data: SVG is used for the subtle paper-grain texture under
    // the .ayur-card-frame component. Allowing data: URIs alongside the
    // existing img sources keeps that texture visible.
    // images.unsplash.com is hot-linked for the GoodGut+ ingredient
    // cards; the editorial photography is sourced from Unsplash with
    // photographer attribution rendered next to each photo. Swap to
    // brand-owned photography on the Shopify CDN when available.
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://images.unsplash.com',
    ],
    // Shop Pay accelerated checkout — the <ShopPayButton> web component
    // loads its <shop-pay-button> script from cdn.shopify.com and renders
    // an iframe served by shop.app. Without these directives the browser
    // blocks the wallet button on the PDPs.
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shop.app',
    ],
    frameSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shop.app',
      `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}`,
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shop.app',
      'https://monorail-edge.shopifysvc.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
