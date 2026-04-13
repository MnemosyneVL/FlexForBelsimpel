// Formatting utilities for displaying prices, data amounts, etc.
//
// Centralizing formatting logic ensures consistency across the app.
// "€12.50" should look the same everywhere, not "12.5€" in one place
// and "EUR 12.50" in another.

/**
 * Format a number as a Euro price: 499.9 → "€499,90"
 * Uses Dutch locale (comma as decimal separator).
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Format data amount: 5 → "5 GB", null → "Onbeperkt" (Unlimited in Dutch)
 */
export function formatData(gb: number | null, isUnlimited: boolean): string {
  if (isUnlimited || gb === null) return "Onbeperkt";
  return `${gb} GB`;
}

/**
 * Format minutes: null → "Onbeperkt", 200 → "200 min"
 */
export function formatMinutes(
  minutes: number | null,
  isUnlimited: boolean
): string {
  if (isUnlimited || minutes === null) return "Onbeperkt";
  return `${minutes} min`;
}

/**
 * Format storage: 128 → "128 GB"
 */
export function formatStorage(gb: number): string {
  return `${gb} GB`;
}

/**
 * Format battery: 5000 → "5.000 mAh"
 */
export function formatBattery(mah: number | null): string {
  if (!mah) return "-";
  return `${mah.toLocaleString("nl-NL")} mAh`;
}
