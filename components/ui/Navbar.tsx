'use client';
import { useApp } from '@/lib/store';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { screen, resetAll } = useApp();
  const showBack = screen !== 'home';

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        {showBack ? (
          <button className={styles.backBtn} onClick={resetAll} aria-label="Go home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        ) : (
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✚</span>
            <span className={styles.logoText}>MediAssist</span>
          </div>
        )}
      </div>

      <div className={styles.center}>
        {showBack && <span className={styles.screenLabel}>Emergency Guide</span>}
      </div>

      <div className={styles.right}>
        <button className={styles.callBtn} onClick={() => window.open('tel:112')} aria-label="Call 112">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          <span>112</span>
        </button>
      </div>
    </nav>
  );
}