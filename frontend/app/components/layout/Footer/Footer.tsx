// Footer component — shown at the bottom of every page.
// Contains links to the source code, CV, and a note for Belsimpel.

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.title}>FlexForBelsimpel</span>
          <p className={styles.subtitle}>
            Een showcase project gebouwd door Chiril Ojoga
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Project</h4>
            <a href="https://github.com/chirilojoga" className={styles.link}>
              Broncode
            </a>
            <a href="https://chirilojoga.com" className={styles.link}>
              Portfolio
            </a>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>Tech Stack</h4>
            <span className={styles.techItem}>Laravel + GraphQL</span>
            <span className={styles.techItem}>React + TypeScript</span>
            <span className={styles.techItem}>Elasticsearch + Redis</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            Met zorg gebouwd voor{" "}
            <span className={styles.highlight}>Belsimpel</span>
            {" "}— 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
