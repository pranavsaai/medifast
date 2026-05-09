'use client';
import { useState } from 'react';
import { useApp, EmergencyType } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import styles from './HomeScreen.module.css';

const CARDS = Object.values(emergencyData);

// Map severity label to card bg tint
const SEV_BG: Record<string, string> = {
  critical: '#FFF5F5',
  high:     '#FFFBF0',
  moderate: '#F0FBF8',
};

export default function HomeScreen() {
  const { setSelected, setScreen } = useApp();
  const [pressed, setPressed] = useState<EmergencyType | null>(null);

  const handleTap = (key: EmergencyType) => {
    setPressed(key);
    setTimeout(() => {
      setSelected(key);
      setScreen('describe');
    }, 160);
  };

  return (
    <main className={styles.home}>
      {/* Hero */}
      <div className={`${styles.hero} animate-up`}>
        <div className={styles.heroPattern} />
        <div className={styles.heroGrid} />

        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          AI-Powered · Always Ready
        </div>

        <h1 className={styles.heroTitle}>
          What's the<br />
          <span className={styles.heroAccent}>emergency?</span>
        </h1>
        <p className={styles.heroSub}>
          Get step-by-step first aid guidance instantly. No experience needed.
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>8</span>
            <span className={styles.heroStatLabel}>Emergencies</span>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>AI</span>
            <span className={styles.heroStatLabel}>Guided Steps</span>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>112</span>
            <span className={styles.heroStatLabel}>Quick Dial</span>
          </div>
        </div>
      </div>

      {/* Quick emergency call strip */}
      <div className={`${styles.quickStrip} animate-up d2`}>
        <div className={styles.quickIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#E53E3E">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div className={styles.quickText}>
          <div className={styles.quickTitle}>Life-threatening situation?</div>
          <div className={styles.quickSub}>Call emergency services immediately</div>
        </div>
        <button className={styles.quickBtn} onClick={() => window.open('tel:112')}>
          Call 112
        </button>
      </div>

      {/* Grid */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Select Emergency Type</span>
        <span className={styles.sectionCount}>{CARDS.length} types</span>
      </div>

      <div className={styles.grid}>
        {CARDS.map((item, i) => (
          <button
            key={item.key}
            className={`${styles.card} ${pressed === item.key ? styles.cardPressed : ''}`}
            style={{
              '--card-color': item.color,
              '--card-glow':  item.glow,
              '--card-bg':    SEV_BG[item.severity] ?? '#F0F4F8',
              animationDelay: `${0.04 + i * 0.06}s`,
            } as React.CSSProperties}
            onClick={() => handleTap(item.key as EmergencyType)}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardTop}>
              <div className={styles.iconWrap}>
                <span>{item.emoji}</span>
              </div>
              <span className={`${styles.sevPill} ${styles[item.severity as 'critical' | 'high' | 'moderate']}`}>
                {item.severity}
              </span>
            </div>

            <div className={styles.cardLabel}>{item.label}</div>
            <div className={styles.cardSub}>{item.tagline}</div>

            <div className={styles.cardFooter}>
              <span style={{ fontSize: '0.68rem', color: 'var(--t4)', fontWeight: 600 }}>
                {item.steps.length} steps
              </span>
              <div className={styles.cardArrow}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={`${styles.bottomNote} animate-up d6`}>
        <span>For educational purposes only</span>
        <span className={styles.bottomNoteDot} />
        <span>Always seek professional help</span>
      </div>
    </main>
  );
}