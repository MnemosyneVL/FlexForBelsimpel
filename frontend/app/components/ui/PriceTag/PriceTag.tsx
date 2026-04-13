// PriceTag component — displays prices with consistent formatting.
// Shows the monthly price prominently and optional upfront cost below.

import { formatPrice } from "~/lib/format";
import styles from "./PriceTag.module.css";

interface PriceTagProps {
  monthlyPrice: number;
  upfrontPrice?: number;
  period?: string;
}

export default function PriceTag({
  monthlyPrice,
  upfrontPrice,
  period = "/mnd",
}: PriceTagProps) {
  return (
    <div className={styles.priceTag}>
      <span className={styles.amount}>{formatPrice(monthlyPrice)}</span>
      <span className={styles.period}>{period}</span>
      {upfrontPrice !== undefined && upfrontPrice > 0 && (
        <div className={styles.upfront}>
          + {formatPrice(upfrontPrice)} eenmalig
        </div>
      )}
    </div>
  );
}
