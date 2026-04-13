// Vite configuration for FlexForBelsimpel.
//
// Vite is our build tool — it transforms TypeScript + JSX into JavaScript
// that browsers can understand. In dev mode, it serves files individually
// (super fast hot reload). In production, it bundles everything into
// optimized chunks.
//
// The reactRouter() plugin replaces the standard React Vite plugin.
// It enables React Router v7's framework features: SSR, loaders, and actions.

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // React Router v7 framework mode — provides SSR, file-based routing, loaders
    reactRouter(),
    // Allows using "~/components/..." imports (mapped to app/ in tsconfig)
    tsconfigPaths(),
  ],
  css: {
    modules: {
      // Allows importing CSS module classes as camelCase in TypeScript.
      // .phone-card in CSS → styles.phoneCard in TS
      localsConvention: "camelCase",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    // Proxy GraphQL requests to the Laravel backend during development.
    // This avoids CORS issues — both frontend and API appear to be on the same origin.
    proxy: {
      "/graphql": "http://nginx:80",
    },
  },
});
