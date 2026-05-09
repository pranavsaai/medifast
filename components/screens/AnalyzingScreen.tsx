'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import { startEmergencyChat } from '@/lib/aiService';
import styles from './AnalyzingScreen.module.css';

// User-friendly steps — no NLP/ML/RAG jargon
const STEPS = [
  { icon: '🔍', label: 'Reading your situation...' },
  { icon: '📋', label: 'Finding the right steps...' },
  { icon: '🩺', label: 'Preparing your guide...' },
  { icon: '✅', label: 'Almost ready...' },
];

export default function AnalyzingScreen() {
  const { selected, description, setScreen, setAiResponse, setAiLoading } = useApp();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const label = emergencyData[selected].label;
    let cancelled = false;

    const geminiPromise = startEmergencyChat(label, description)
      .then(resp => { if (!cancelled) { setAiResponse(resp); setAiLoading(false); } })
      .catch(err => {
        console.error('Gemini error:', err);
        if (!cancelled) setError('Could not connect. Check your internet and try again.');
      });

    let step = 0;
    const tick = () => {
      if (cancelled) return;
      if (step < STEPS.length) {
        setCurrent(step++);
        setTimeout(tick, 850);
      } else {
        setDone([0, 1, 2, 3]);
        geminiPromise.then(() => { if (!cancelled) setScreen('ai-guidance' as any); });
      }
    };
    const t = setTimeout(tick, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return (
    <main className={styles.page}>
      {/* Big pulsing ring */}
      <div className={styles.ringWrap}>
        <div className={styles.ring1} />
        <div className={styles.ring2} />
        <div className={styles.ring3} />
        <div className={styles.centerIcon}>
          {error ? '⚠️' : STEPS[current]?.icon ?? '✅'}
        </div>
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={() => setScreen('home')}>← Go Back</button>
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Preparing your guide</h2>
          <p className={styles.sub}>This takes just a moment</p>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`${styles.step}
                  ${i === current ? styles.stepActive : ''}
                  ${done.includes(i) || i < current ? styles.stepDone : ''}`}
              >
                <div className={styles.stepDot}>
                  {(done.includes(i) || i < current) ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : i === current ? (
                    <div className={styles.dotSpinner} />
                  ) : null}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}