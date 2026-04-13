// React Router v7 configuration.
//
// This tells React Router to run in "framework mode" — the successor to Remix v2.
// Framework mode gives us:
//   - SSR (server-side rendering): pages are rendered on the server first
//   - Loaders: data is fetched before the page component renders
//   - Actions: form submissions are handled server-side
//
// Without framework mode, React Router is just a client-side router.
// With it, it becomes a full-stack framework.

import type { Config } from "@react-router/dev/config";

export default {
  // Enable SSR — pages render on the server before being sent to the browser.
  // This is important for SEO (Google can read the page) and fast first paint.
  ssr: true,
  // Where our app code lives
  appDirectory: "app",
} satisfies Config;
