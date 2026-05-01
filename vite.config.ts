import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

console.log('[ayurpet-vite] config loading; allowedHosts will be set explicitly');

export default defineConfig({
  plugins: [tailwindcss(), hydrogen(), oxygen(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  // (Note: server.allowedHosts is defined once below at the bottom of the
  // config — JS object spread semantics meant a duplicate "server" key here
  // was silently overwritten by Hydrogen's scaffolded block.)
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'react-router > set-cookie-parser',
        'react-router > cookie',
        'react-router',
      ],
    },
  },
  server: {
    // MiniOxygen dev is fronted by nginx on hydrogen-ayurpet.glitchexecutor.com
    // for team preview. Vite blocks unknown Host headers by default;
    // allowlist all glitchexecutor.com subdomains plus Shopify's tryhydrogen.dev.
    allowedHosts: [
      '.glitchexecutor.com',
      '.tryhydrogen.dev',
    ],
  },
});
