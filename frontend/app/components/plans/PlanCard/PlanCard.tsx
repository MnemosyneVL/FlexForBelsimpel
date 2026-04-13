// PlanCard component — displays a phone plan in the listing.
// Shows the provider, plan name, data allowance, and monthly cost.

import { Link } from "react-router";
import { formatPrice, formatData, formatMinutes } from "~/lib/format";
import Badge from "~/components/ui/Badge/Badge";
import Card from "~/components/ui/Card/Card";
import styles from "./PlanCard.module.css";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    slug: string;
    monthly_cost_eur: number;
    data_gb: number | null;
    minutes: number | null;
    is_unlimited_data: boolean;
    is_unlimited_calls: boolean;
    network_type: string;
    contract_months: number;
    provider: {
      name: string;
      slug: string;
    };
  };
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card hoverable className={styles.planCard}>
      <Link to={`/plans/${plan.slug}`} className={styles.link}>
        <div className={styles.header}>
          <span className={styles.provider}>{plan.provider.name}</span>
          <h3 className={styles.name}>{plan.name}</h3>
        </div>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <span className={styles.specLabel}>Data</span>
            <span className={styles.specValue}>
              {formatData(plan.data_gb, plan.is_unlimited_data)}
            </span>
          </div>
          <div className={styles.spec}>
            <span className={styles.specLabel}>Bellen</span>
            <span className={styles.specValue}>
              {formatMinutes(plan.minutes, plan.is_unlimited_calls)}
            </span>
          </div>
          <div className={styles.spec}>
            <span className={styles.specLabel}>Contract</span>
            <span className={styles.specValue}>{plan.contract_months} mnd</span>
          </div>
        </div>

        <div className={styles.badges}>
          {plan.network_type === "5G" && <Badge variant="info">5G</Badge>}
          {plan.is_unlimited_data && <Badge variant="success">Onbeperkt data</Badge>}
        </div>

        <div className={styles.price}>
          {formatPrice(plan.monthly_cost_eur)}
          <span className={styles.period}>/mnd</span>
        </div>
      </Link>
    </Card>
  );
}
