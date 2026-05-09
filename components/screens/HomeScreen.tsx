'use client';
import { useState } from 'react';
import { useApp, EmergencyType } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import styles from './HomeScreen.module.css';

const CARDS = Object.values(emergencyData);

export default function HomeScreen() {
  const { setSelected, setScreen } = useApp();
  const [pressed, setPressed] = useState<EmergencyType | null>(null);

  const handleTap = (key: EmergencyType) => {
    setPressed(key);
    setTimeout(() => {
      setSelected(key);
      setScreen('describe');
    }, 180);
  };

  return (
    <main className={styles.home}>
      {/* Header area */}
      <div className={styles.header}>
        <div className={`${styles.pulse} animate-up`} />
        <h1 className={`${styles.title} animate-up d1`}>
          What's the<br />
          <span className={styles.titleAccent}>emergency?</span>
        </h1>
        <p className={`${styles.sub} animate-up d2`}>
          Tap the situation below for instant step-by-step help.
        </p>
      </div>

      {/* Emergency grid */}
      <div className={`${styles.grid} animate-up d3`}>
        {CARDS.map((ed, i) => (
          <button
            key={ed.key}
            className={`${styles.card} ${pressed === ed.key ? styles.cardPressed : ''}`}
            data-card-color={ed.color}
            data-card-glow={ed.glow}
            data-animation-delay={`${0.05 + i * 0.06}s`}
            onClick={() => handleTap(ed.key)}
          >
            {/* Severity pill */}
            <div className={`${styles.sevPill} ${styles[ed.severity]}`}>
              {ed.severity === 'critical' ? '🔴' : ed.severity === 'high' ? '🟠' : '🟡'} {ed.sevLabel}
            </div>

            {/* Emoji */}
            <div className={styles.cardEmoji}>{ed.emoji}</div>

            {/* Text */}
            <div className={styles.cardLabel}>{ed.label}</div>
            <div className={styles.cardSub}>{ed.tagline}</div>

            {/* Arrow */}
            <div className={styles.cardArrow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            {/* Glow bg */}
            <div className={styles.cardGlow} />
          </button>
        ))}
      </div>

      {/* Bottom safe area */}
      <div className={styles.bottomNote}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        Always call 112 for life-threatening emergencies
      </div>
    </main>
  );
}