'use client';
// components/screens/AnalyzingScreen.tsx
// Runs the animated "NLP → ML → RAG → LLM" steps while ACTUALLY calling Gemini.
// When Gemini responds, it transitions to 'ai-guidance'.

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import { startEmergencyChat } from '@/lib/aiService';
import FlowStrip from '@/components/ui/FlowStrip';
import styles from './AnalyzingScreen.module.css';

const ANIM_STEPS = [
  { icon: '🔤', label: 'NLP parsing your description...' },
  { icon: '🤖', label: 'ML severity prediction...' },
  { icon: '📚', label: 'RAG searching medical database...' },
  { icon: '💡', label: 'Generating AI guidance...' },
];

// Minimum display time (ms) per animation step so it doesn't flash too fast
const STEP_DURATION = 900;

export default function AnalyzingScreen() {
  const {
    selected,
    description,
    setScreen,
    setAiResponse,
    setAiError,
    setAiLoading,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const label = emergencyData[selected].label;
    let cancelled = false;

    // 1. Kick off Gemini call in parallel with the animation
    const geminiPromise = startEmergencyChat(label, description)
      .then(resp => {
        setAiResponse(resp);
        setAiLoading(false);
      })
      .catch(err => {
        console.error('Gemini error:', err);
        const msg = err?.message?.includes('API_KEY_INVALID')
          ? 'Invalid API key. Please go back and re-enter your key.'
          : 'Could not reach the AI. Check your internet connection and try again.';
        if (!cancelled) {
          setApiError(msg);
          setAiError(msg);
        }
      });

    // 2. Animate the four steps regardless
    let step = 0;
    const animNext = () => {
      if (cancelled) return;
      if (step < ANIM_STEPS.length) {
        setCurrentStep(step);
        step++;
        setTimeout(animNext, STEP_DURATION);
      } else {
        // Animation done — wait for Gemini then navigate
        setDoneSteps([0, 1, 2, 3]);
        geminiPromise.then(() => {
          if (!cancelled) setScreen('ai-guidance' as any);
        });
      }
    };

    const t = setTimeout(animNext, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.analyzing}>
      <div className={styles.flowStripContainer}>
        <FlowStrip current="analyzing" />
      </div>

      <div className={styles.ring}>
        <svg width="120" height="120" viewBox="0 0 120 120" className={styles.spinner}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#E0D8C8" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52"
            fill="none" stroke="var(--green-dark)" strokeWidth="6"
            strokeDasharray="80 247" strokeLinecap="round"
          />
        </svg>
        <div className={styles.innerIcon}>
          {apiError ? '⚠️' : (ANIM_STEPS[currentStep]?.icon ?? '✅')}
        </div>
      </div>

      {apiError ? (
        <div className={styles.errorBox}>
          <p>{apiError}</p>
          <button className={styles.retryBtn} onClick={() => setScreen('home')}>
            ← Go Back
          </button>
        </div>
      ) : (
        <>
          <h3 className={styles.title}>AI is analyzing your emergency...</h3>
          <ul className={styles.steps}>
            {ANIM_STEPS.map((s, i) => (
              <li
                key={i}
                className={`${styles.step}
                  ${i === currentStep ? styles.stepActive : ''}
                  ${doneSteps.includes(i) ? styles.stepDone : ''}`}
              >
                <span className={`${styles.dot} ${i === currentStep ? styles.dotPulse : ''}`} />
                {s.icon} {s.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}