// useCompare hook — manages the phone comparison list.
//
// The comparison list is stored in URL search params (?compare=1,2,3).
// This makes it:
//   1. Shareable — copy the URL and send it to someone
//   2. Bookmarkable — save the comparison for later
//   3. Persistent — survives page refreshes
//
// We limit to 4 phones because comparing more gets unreadable.

import { useSearchParams } from "react-router";
import { useCallback } from "react";

export function useCompare() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the current compare IDs from the URL
  const compareIds: string[] = searchParams.get("compare")
    ? searchParams.get("compare")!.split(",")
    : [];

  // Check if a specific phone is in the comparison list
  const isComparing = useCallback(
    (phoneId: string) => compareIds.includes(phoneId),
    [compareIds]
  );

  // Add a phone to the comparison (max 4)
  const addToCompare = useCallback(
    (phoneId: string) => {
      if (compareIds.length >= 4 || compareIds.includes(phoneId)) return;

      const newIds = [...compareIds, phoneId];
      setSearchParams((prev) => {
        prev.set("compare", newIds.join(","));
        return prev;
      });
    },
    [compareIds, setSearchParams]
  );

  // Remove a phone from the comparison
  const removeFromCompare = useCallback(
    (phoneId: string) => {
      const newIds = compareIds.filter((id) => id !== phoneId);
      setSearchParams((prev) => {
        if (newIds.length === 0) {
          prev.delete("compare");
        } else {
          prev.set("compare", newIds.join(","));
        }
        return prev;
      });
    },
    [compareIds, setSearchParams]
  );

  // Toggle a phone in/out of the comparison
  const toggleCompare = useCallback(
    (phoneId: string) => {
      if (isComparing(phoneId)) {
        removeFromCompare(phoneId);
      } else {
        addToCompare(phoneId);
      }
    },
    [isComparing, addToCompare, removeFromCompare]
  );

  return {
    compareIds,
    isComparing,
    toggleCompare,
    addToCompare,
    removeFromCompare,
    canAddMore: compareIds.length < 4,
  };
}
