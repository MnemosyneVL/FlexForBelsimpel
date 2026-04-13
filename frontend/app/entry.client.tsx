// Custom client entry point — controls how React "hydrates" the page.
//
// Why do we need this? By default, React Router v7 hydrates automatically.
// But browser extensions like Grammarly inject extra DOM elements
// (e.g., <grammarly-desktop-integration>) into <html> BEFORE React hydrates.
//
// React compares the server-rendered HTML with the live DOM. If they don't
// match — even because of an extension's injected element — React throws
// away ALL the server HTML and re-renders from scratch. This wipes out
// the CSS that was already loaded, causing a flash of unstyled content.
//
// The fix: before React hydrates, we remove any elements that extensions
// injected. This way the DOM matches the server HTML, hydration succeeds,
// and CSS stays intact.

import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// Clean up DOM elements injected by browser extensions before hydration.
// These elements cause hydration mismatches because React doesn't expect them.
function cleanupExtensionElements() {
  // Grammarly Desktop injects <grammarly-desktop-integration> into <html>
  document
    .querySelectorAll("grammarly-desktop-integration")
    .forEach((el) => el.remove());

  // Grammarly also injects attributes on <body> and <html>
  const attributesToRemove = [
    "data-new-gr-c-s-check-loaded",
    "data-gr-ext-installed",
    "data-new-gr-c-s-loaded",
  ];

  for (const attr of attributesToRemove) {
    document.documentElement.removeAttribute(attr);
    document.body.removeAttribute(attr);
  }
}

cleanupExtensionElements();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
