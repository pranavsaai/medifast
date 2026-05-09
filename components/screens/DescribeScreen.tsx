'use client';
import { useApp } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import styles from './DescribeScreen.module.css';

export default function DescribeScreen() {
  const { selected, description, setDescription, setScreen } = useApp();
  if (!selected) return null;
  const data = emergencyData[selected];

  return (
    <main className={styles.page}>
      {/* Emergency badge */}
      <div className={`${styles.badge} animate-up`} style={{ '--c': data.color } as React.CSSProperties}>
        <span>{data.emoji}</span>
        <span>{data.label}</span>
      </div>

      {/* Heading */}
      <h2 className={`${styles.title} animate-up d1`}>
        Tell us what<br />happened
      </h2>
      <p className={`${styles.sub} animate-up d2`}>
        The more you describe, the better we can help.
      </p>

      {/* Text area card */}
      <div className={`${styles.inputCard} animate-up d3`}>
        <textarea
          className={styles.textarea}
          placeholder={`e.g. "${data.chips[0]}"`}
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
          autoFocus
        />
      </div>

      {/* Quick chips */}
      <div className={`${styles.chipsLabel} animate-up d4`}>Or pick a common situation</div>
      <div className={`${styles.chips} animate-up d4`}>
        {data.chips.map(chip => (
          <button
            key={chip}
            className={`${styles.chip} ${description === chip ? styles.chipActive : ''}`}
            onClick={() => setDescription(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className={`${styles.cta} animate-up d5`}>
        <button
          className={styles.ctaBtn}
          onClick={() => setScreen('analyzing')}
          disabled={!description.trim()}
          style={{ '--c': data.color, '--g': data.glow } as React.CSSProperties}
        >
          Get help now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <p className={styles.ctaNote}>Our guide will walk you through every step</p>
      </div>
    </main>
  );
}