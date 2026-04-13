// PhoneCard component — displays a phone in the listing grid.
//
// Shows the phone image, name, brand, key specs, and price.
// Clicking the card navigates to the phone detail page.
// The "Compare" checkbox adds/removes the phone from the comparison list.

import { Link } from "react-router";
import { formatPrice, formatStorage } from "~/lib/format";
import Badge from "~/components/ui/Badge/Badge";
import Card from "~/components/ui/Card/Card";
import styles from "./PhoneCard.module.css";

interface PhoneCardProps {
  phone: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    price_eur: number;
    storage_gb: number;
    is_5g: boolean;
    phoneBrand: {
      name: string;
    };
  };
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

export default function PhoneCard({
  phone,
  isComparing = false,
  onToggleCompare,
}: PhoneCardProps) {
  return (
    <Card hoverable className={styles.phoneCard}>
      <Link to={`/phones/${phone.slug}`} className={styles.link}>
        {/* Phone image placeholder — in production you'd use real images */}
        <div className={styles.imageWrapper}>
          {phone.image_url ? (
            <img src={phone.image_url} alt={phone.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>
              {phone.phoneBrand.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Phone info */}
        <div className={styles.info}>
          <span className={styles.brand}>{phone.phoneBrand.name}</span>
          <h3 className={styles.name}>{phone.name}</h3>

          <div className={styles.badges}>
            <Badge>{formatStorage(phone.storage_gb)}</Badge>
            {phone.is_5g && <Badge variant="info">5G</Badge>}
          </div>

          <div className={styles.price}>
            {formatPrice(phone.price_eur)}
          </div>
        </div>
      </Link>

      {/* Compare checkbox — separate from the link so clicking it
          doesn't navigate to the detail page */}
      {onToggleCompare && (
        <label className={styles.compareLabel}>
          <input
            type="checkbox"
            checked={isComparing}
            onChange={() => onToggleCompare(phone.id)}
          />
          Vergelijk
        </label>
      )}
    </Card>
  );
}
