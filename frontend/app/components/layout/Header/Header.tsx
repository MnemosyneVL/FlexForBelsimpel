// Header component — the top navigation bar visible on every page.
// Contains the logo/name, main navigation links, and a link to the wishlist.

import { Link, NavLink } from "react-router";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/brand */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoFlex}>Flex</span>
          <span className={styles.logoBelsimpel}>ForBelsimpel</span>
        </Link>

        {/* Main navigation — NavLink highlights the active page */}
        <nav className={styles.nav}>
          <NavLink
            to="/phones"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Telefoons
          </NavLink>
          <NavLink
            to="/plans"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Abonnementen
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Vergelijken
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Over dit project
          </NavLink>
        </nav>

        {/* Wishlist link */}
        <Link to="/wishlist" className={styles.wishlistLink}>
          Verlanglijst
        </Link>
      </div>
    </header>
  );
}
