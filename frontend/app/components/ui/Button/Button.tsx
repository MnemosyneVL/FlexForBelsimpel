// Button component — the most basic building block of our UI.
//
// Supports two variants:
//   - "primary": orange background (Belsimpel brand color) — for main actions
//   - "secondary": outlined style — for secondary actions
//
// And two sizes: "md" (default) and "sm" (compact).
// We keep it simple — no over-engineering for a showcase project.

import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  // Combine CSS Module classes based on props.
  // This pattern is common in React — conditionally applying classes.
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
