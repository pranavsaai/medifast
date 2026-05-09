'use client';
// components/ui/Navbar.tsx

import { useApp } from '@/lib/store';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { screen, resetAll, setScreen } = useApp();

  const callEmergency = () => {
    window.open('tel:112');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Medi<span>Assist</span>
      </div>

      <div className={styles.links}>
        {screen !== 'home' && (
          <button className={styles.ghostBtn} onClick={resetAll}>
            ← Home
          </button>
        )}
        {(screen === 'guidance' || screen === 'report') && (
          <button className={styles.ghostBtn} onClick={() => setScreen('report')}>
            📄 View Report
          </button>
        )}
        <button className={styles.solidBtn} onClick={callEmergency}>
          🚑 Call 112
        </button>
      </div>
    </nav>
  );
}