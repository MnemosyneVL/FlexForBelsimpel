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
    // HMR (Hot Module Replacement) config for Docker.
    // When accessing the app through Nginx (port 8080), Vite's client-side
    // code needs to know where to connect for live updates and CSS injection.
    // We tell it to connect to port 3000 (Node) directly, since Nginx's
    // WebSocket proxying can interfere with Vite's HMR protocol.
    hmr: {
      port: 3000,
    },
    // Allow requests from Nginx (which forwards with different Host header)
    allowedHosts: ["localhost", "nginx", "forbelsimpel.chirilojoga.com"],
    // Proxy GraphQL requests to the Laravel backend during development.
    // This avoids CORS issues — both frontend and API appear to be on the same origin.
    proxy: {
      "/graphql": "http://nginx:80",
    },
  },
});
