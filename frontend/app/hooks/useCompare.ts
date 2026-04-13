// useCompare hook — manages the phone comparison list.
//
// Stores selected phone IDs in React state (useState), NOT in URL params.
//
// Why not URL params? Because useSearchParams triggers a React Router
// navigation on every change. In React Router v7, a navigation re-runs
// the page's loader (which calls GraphQL/Elasticsearch). So every
// checkbox tick would cause a ~3 second server roundtrip — terrible UX.
//
// React state is instant. When the user clicks "Vergelijk nu",
// the compare page link already includes the IDs in its URL
// (/compare?compare=1,2,3), so the compare page can still load them.
//
// Trade-off: compare selections don't survive a page refresh on /phones.
// That's fine — it's a temporary selection, like items in a shopping cart
// before checkout. The compare PAGE itself reads IDs from the URL,
// so that link IS shareable.

import { useState, useCallback } from "react";

const MAX_COMPARE = 4;

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Check if a specific phone is in the comparison list
  const isComparing = useCallback(
    (phoneId: string) => compareIds.includes(phoneId),
    [compareIds]
  );

  // Add a phone to the comparison (max 4)
  const addToCompare = useCallback(
    (phoneId: string) => {
      setCompareIds((prev) => {
        if (prev.length >= MAX_COMPARE || prev.includes(phoneId)) return prev;
        return [...prev, phoneId];
      });
    },
    []
  );

  // Remove a phone from the comparison
  const removeFromCompare = useCallback(
    (phoneId: string) => {
      setCompareIds((prev) => prev.filter((id) => id !== phoneId));
    },
    []
  );

  // Toggle a phone in/out of the comparison
  const toggleCompare = useCallback(
    (phoneId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(phoneId)) {
          return prev.filter((id) => id !== phoneId);
        }
        if (prev.length >= MAX_COMPARE) return prev;
        return [...prev, phoneId];
      });
    },
    []
  );

  return {
    compareIds,
    isComparing,
    toggleCompare,
    addToCompare,
    removeFromCompare,
    canAddMore: compareIds.length < MAX_COMPARE,
  };
}
