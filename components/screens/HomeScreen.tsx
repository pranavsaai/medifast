'use client';
// components/screens/HomeScreen.tsx

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { emergencyData, EmergencyType, severityConfig } from '@/lib/emergencyData';
import FlowStrip from '@/components/ui/FlowStrip';
import styles from './HomeScreen.module.css';

export default function HomeScreen() {
  const { selected, setSelected, setScreen } = useApp();
  const [hovered, setHovered] = useState<EmergencyType | null>(null);

  const handleProceed = () => {
    if (selected) setScreen('describe');
  };

  return (
    <main className={styles.home}>
      {/* Badge */}
      <div className={`${styles.badge} animate-fade-up`}>
        <span className={styles.dot} />
        AI-Powered Emergency Guide
      </div>

      {/* Hero */}
      <h1 className={`${styles.title} animate-fade-up delay-100`}>
        Emergency First Aid<br />
        <em>in your hands.</em>
      </h1>
      <p className={`${styles.sub} animate-fade-up delay-200`}>
        AI-guided first aid using NLP, ML severity analysis, and trusted medical knowledge. Get step-by-step help in seconds.
      </p>

      {/* Flow strip */}
      <div className={`animate-fade-up delay-300`} style={{ width: '100%', maxWidth: 680, display: 'flex', justifyContent: 'center' }}>
        <FlowStrip current="home" />
      </div>

      {/* Emergency grid */}
      <div className={`${styles.grid} animate-fade-up delay-400`}>
        {(Object.values(emergencyData) as typeof emergencyData[EmergencyType][]).map((ed) => {
          const sev = severityConfig[ed.severity];
          const isSelected = selected === ed.key;
          return (
            <div
              key={ed.key}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''} ${hovered === ed.key ? styles.cardHovered : ''}`}
              onClick={() => setSelected(ed.key)}
              onMouseEnter={() => setHovered(ed.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Severity badge */}
              <div
                className={styles.sevBadge}
                style={{ background: sev.bg, color: sev.color }}
              >
                {sev.label}
              </div>

              {/* Icon */}
              <div
                className={styles.cardIcon}
                style={{ background: sev.bg }}
              >
                {ed.emoji}
              </div>

              <div className={styles.cardTitle}>{ed.label}</div>
              <div className={styles.cardSub}>{ed.tagline}</div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        className={`${styles.cta} animate-fade-up delay-500`}
        onClick={handleProceed}
        disabled={!selected}
        style={{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
      >
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </main>
  );
}