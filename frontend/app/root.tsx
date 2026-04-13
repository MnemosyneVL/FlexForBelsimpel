// Root layout — wraps every page in the application.
//
// This is the outermost component that provides:
//   - HTML document structure (<html>, <head>, <body>)
//   - Global CSS imports
//   - The Header and Footer that appear on every page
//   - The <Outlet /> where child routes render
//
// In React Router v7, the root module is special — it's always rendered,
// and all other routes are nested inside it.

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import Header from "~/components/layout/Header/Header";
import Footer from "~/components/layout/Footer/Footer";

// Import global styles — these apply to the entire application.
// In React Router v7 with Vite, plain CSS imports are automatically
// collected and injected into the page (both SSR and client-side).
// No need for a links() function — Vite handles it.
import "~/styles/reset.css";
import "~/styles/variables.css";
import "~/styles/global.css";

export default function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {/* Header stays visible on every page */}
        <Header />

        {/* Main content — child routes render here */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* Footer stays visible on every page */}
        <Footer />

        {/* Restores scroll position when navigating back */}
        <ScrollRestoration />
        {/* Injects the JavaScript bundles */}
        <Scripts />
      </body>
    </html>
  );
}
