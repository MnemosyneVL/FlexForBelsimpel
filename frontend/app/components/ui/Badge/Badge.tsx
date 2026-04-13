// Badge component — small labels for tags like "5G", "Unlimited", etc.

import styles from "./Badge.module.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "info" | "warning";
}

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
