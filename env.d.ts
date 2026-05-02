/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /**
     * Optional Google Analytics 4 measurement ID (e.g. "G-XXXXXXXXXX").
     * When set, the GA4Events component in app/components/analytics
     * loads gtag and pushes Hydrogen analytics events into the GA4
     * dataLayer. Leave empty to disable.
     */
    PUBLIC_GA4_TAG_ID?: string;
  }
}
