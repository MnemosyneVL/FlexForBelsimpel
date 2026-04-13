// Route configuration for FlexForBelsimpel.
//
// This file defines the URL structure of the entire application.
// React Router v7 uses this config to:
//   1. Match URLs to route modules (e.g., /phones/samsung-galaxy-s24 → phones.$phoneId.tsx)
//   2. Create nested layouts (phones.tsx wraps all phone pages)
//   3. Generate type-safe route helpers
//
// The "layout" function creates a wrapper that stays on screen while child routes change.
// For example, the phones layout has the filter sidebar that persists across phone pages.

import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  // Landing page — "Hello Belsimpel"
  index("routes/_index.tsx"),

  // About page — architecture explanation
  route("about", "routes/about.tsx"),

  // Phone section — route("phones", ...) creates the /phones URL prefix.
  // The layout file (phones.tsx) renders an <Outlet /> that child routes fill in.
  route("phones", "routes/phones.tsx", [
    // /phones — phone listing with search and filters
    index("routes/phones._index.tsx"),
    // /phones/:phoneId — single phone detail page (e.g., /phones/samsung-galaxy-s24-ultra)
    route(":phoneId", "routes/phones.$phoneId.tsx"),
  ]),

  // Plan section — same pattern as phones
  route("plans", "routes/plans.tsx", [
    index("routes/plans._index.tsx"),
    route(":planId", "routes/plans.$planId.tsx"),
  ]),

  // Compare page — side-by-side phone comparison
  route("compare", "routes/compare.tsx"),

  // Wishlist — requires authentication
  route("wishlist", "routes/wishlist.tsx"),
] satisfies RouteConfig;
